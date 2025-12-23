import type { AttemptAnswerView } from "../components/attempts/AttemptAnswersList.vue";
import { getAttemptShuffleSeed, shuffleQuestionsAndChoices } from "./shuffle";

export type PrintAttemptDetail = {
  id: number;
  examId?: number;
  examTitle?: string | null;
  examCode?: string | null;
  roomId?: number | null;
  studentId?: number;
  studentName?: string | null;
  studentCode?: string | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  timeTakenSec?: number | null;
  score?: number | null;
  passMarkPercent?: number | null;
  answers: AttemptAnswerView[];
  roomShuffleQuestions?: boolean;
  roomShuffleChoices?: boolean;
};

export function openPrintWindow(title?: string): Window | null {
  const win = window.open("", "_blank");
  if (!win) return null;
  const safeTitle = escapeHtml(title || "Print");
  win.document.open();
  win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #444; margin-bottom: 16px; }
    .meta span { display: inline-block; margin-right: 12px; }
    .question { margin: 16px 0; page-break-inside: avoid; }
    .question-title { font-weight: 600; margin-bottom: 6px; }
    .choice { margin: 2px 0; }
    .choice.selected { font-weight: 600; }
    .choice.correct { color: #0a7a43; }
    .choice.wrong { color: #b91c1c; }
    .score { margin-top: 8px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <div class="meta">Preparing print...</div>
</body>
</html>`);
  win.document.close();
  return win;
}

export function renderAttemptPrint(
  win: Window,
  detail: PrintAttemptDetail
): void {
  const answers = orderAnswers(detail);
  const correctCount = answers.filter((a) => a.isCorrect === true).length;
  const totalCount = answers.length;
  const title = `BÀI THI #${detail.id}`;
  const metaParts: string[] = [];
  metaParts.push(
    `<strong>Để thi</strong>: ${escapeHtml(detail.examTitle || "-")}(${
      detail.examCode
    })`
  );
  metaParts.push(
    `<strong>Phòng:</strong> ${escapeHtml(
      typeof detail.roomId === "number" ? String(detail.roomId) : "-"
    )}`
  );
  if (detail.studentName || detail.studentCode || detail.studentId) {
    const student = [
      detail.studentName || "",
      detail.studentCode ? `(${detail.studentCode})` : "",
      detail.studentId ? `#${detail.studentId}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    metaParts.push(
      `<strong>Học viên:</strong> ${escapeHtml(student || "-")}<br />`
    );
  }
  if (detail.startedAt) {
    metaParts.push(
      `<strong>Thời gian bắt đầu làm bài:</strong> ${escapeHtml(
        fmtDate(detail.startedAt)
      )}<br />`
    );
  }
  if (detail.submittedAt) {
    metaParts.push(
      `<strong>Thời gian nộp bài:</strong> ${escapeHtml(
        fmtDate(detail.submittedAt)
      )}<br />`
    );
  }
  if (typeof detail.timeTakenSec === "number") {
    metaParts.push(
      `<strong>Tổng thời gian làm bài:</strong> ${escapeHtml(
        fmtDuration(detail.timeTakenSec)
      )}<br />`
    );
  }
  if (totalCount > 0) {
    metaParts.push(
      `<strong>Số câu đúng:</strong> ${correctCount}/${totalCount}`
    );
  }
  if (typeof detail.score === "number") {
    metaParts.push(
      `<strong>Điểm số:</strong> ${escapeHtml(String(detail.score))}`
    );
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #444; margin-bottom: 16px; }
    .meta span { display: inline-block; margin-right: 12px; }
    .question { margin: 16px 0; page-break-inside: avoid; }
    .question-title { font-weight: 600; margin-bottom: 6px; }
    .choice { margin: 2px 0; }
    .choice.selected { font-weight: 600; }
    .choice.correct { color: #0a7a43; }
    .choice.wrong { color: #b91c1c; }
    .score { margin-top: 8px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    ${metaParts.map((m) => `<span>${m}</span>`).join("<br/>")}
  </div>
  ${answers
    .map((ans, idx) => {
      const selectedAny = (ans.choices || []).some((c) => c.selected);
      const choices = (ans.choices || [])
        .map((c) => {
          const marker = c.selected ? "[x]" : "[ ]";
          const cls = [
            "choice",
            c.selected ? "selected" : "",
            c.isCorrect ? "correct" : c.selected ? "wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return `<div class="${cls}">${marker} ${escapeHtml(c.content || "")}${
            c.isCorrect ? " (correct)" : ""
          }</div>`;
        })
        .join("");
      const fallback = selectedAny
        ? ""
        : `<div class="choice wrong">[ ] No answer</div>`;
      const score =
        typeof ans.earned === "number"
          ? `<div class="score">Điểm: ${escapeHtml(
              String(ans.earned)
            )} / ${escapeHtml(String(ans.points ?? 1))}</div>`
          : "";
      return `<div class="question">
  <div class="question-title">Q${idx + 1}: ${escapeHtml(
        ans.questionText || ""
      )}</div>
  ${choices}${fallback}
  ${score}
</div>`;
    })
    .join("")}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function renderPrintError(win: Window, message: string): void {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Print</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
  </style>
</head>
<body>
  <h1>Print failed</h1>
  <p>${escapeHtml(message || "Không thể tải đề thi.")}</p>
</body>
</html>`;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function orderAnswers(detail: PrintAttemptDetail): AttemptAnswerView[] {
  const base = detail.answers || [];
  const hasShuffle =
    typeof detail.roomShuffleQuestions === "boolean" ||
    typeof detail.roomShuffleChoices === "boolean";
  if (!hasShuffle) return base;
  const seed = getAttemptShuffleSeed({
    studentId: detail.studentId,
    roomId: detail.roomId,
    examId: detail.examId,
  });
  return shuffleQuestionsAndChoices(base, {
    seed,
    shuffleQuestions: !!detail.roomShuffleQuestions,
    shuffleChoices: !!detail.roomShuffleChoices,
  });
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(d?: string | null): string {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function fmtDuration(sec?: number | null): string {
  const s = Number(sec || 0);
  if (!s || s <= 0) return "-";
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}
