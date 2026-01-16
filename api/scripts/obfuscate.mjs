import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import JavaScriptObfuscator from "javascript-obfuscator";

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const options = {
  // --- NHÓM TỐI ƯU HIỆU NĂNG (QUAN TRỌNG) ---
  compact: true, // Gộp code thành 1 dòng (giảm dung lượng).
  target: "node",
  controlFlowFlattening: false, // TẮT: Đây là thủ phạm chính làm chậm code. Tắt nó đi code chạy vèo vèo.
  deadCodeInjection: false, // TẮT: Không chèn mã rác.
  numbersToExpressions: false, // TẮT: Giữ nguyên số (ví dụ 100) thay vì tính toán (10*10).
  simplify: true, // BẬT: Đơn giản hóa code gốc trước khi obfuscate.

  // --- NHÓM BẢO MẬT VỪA PHẢI ---
  // Đổi tên biến thành dạng ngắn gọn (a, b, c,...) giúp file siêu nhẹ và parse nhanh.
  // Nếu muốn nhìn "nguy hiểm" hơn thì đổi thành "hexadecimal".
  identifierNamesGenerator: "mangled",

  renameGlobals: false, // An toàn cho Node.js
  renameProperties: false, // An toàn cho Object/JSON
  selfDefending: false, // Tắt để tránh crash không mong muốn.

  // --- XỬ LÝ CHUỖI (STRING) ---
  stringArray: true, // Vẫn gom string lại để giấu nội dung text.
  stringArrayRotate: true,
  stringArrayShuffle: true,

  // MẤU CHỐT TỐC ĐỘ Ở ĐÂY:
  // Để mảng rỗng [] hoặc false. Code sẽ KHÔNG tốn CPU để giải mã (base64/rc4) mỗi khi gọi string.
  // Tuy nhiên string vẫn bị tách ra khỏi code logic nên vẫn khó đọc.
  stringArrayEncoding: [],

  stringArrayThreshold: 0.75, // 75% chuỗi sẽ bị giấu đi.
  transformObjectKeys: false, // Tắt để truy xuất object nhanh nhất.
  unicodeEscapeSequence: false, // Tắt để file nhẹ.
  sourceMap: false,
};

async function obfuscateFile(file) {
  try {
    const code = await readFile(file, "utf8");
    const result = JavaScriptObfuscator.obfuscate(code, options);
    const out = result.getObfuscatedCode();
    if (out && out.length) {
      await writeFile(file, out, "utf8");
      return true;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Obfuscate failed for", file, message);
  }
  return false;
}

async function run() {
  if (!process.argv.includes("--obfuscate")) {
    console.log("[obfuscate] Skipping obfuscation (no --obfuscate flag).");
    return;
  }

  const dist = join(process.cwd(), "dist");
  try {
    const s = await stat(dist);
    if (!s.isDirectory()) return;
  } catch {
    return;
  }
  let count = 0;
  for await (const file of walk(dist)) {
    if (extname(file) === ".js") {
      const ok = await obfuscateFile(file);
      if (ok) count++;
    }
  }
  console.log(`[obfuscate] Obfuscated ${count} JS files in dist`);
}

run();
