import { PrismaClient, QuestionType, Subject } from "@prisma/client";

/**
 * Ngân hàng câu hỏi cho Chứng chỉ Ứng dụng CNTT Cơ bản.
 */
const basicQuestions = [
  {
    question: "Hệ điều hành (Operating System) là gì?",
    answers: [
      { text: "Phần mềm điều khiển và quản lý phần cứng, tài nguyên", correct: true },
      { text: "Thiết bị ngoại vi máy tính", correct: false },
      { text: "Trình duyệt web", correct: false },
      { text: "Phần mềm chống virus", correct: false },
    ],
    explanation: "HĐH quản lý phần cứng và cung cấp môi trường cho ứng dụng chạy.",
  },
  {
    question: "Thao tác nào dùng để đổi tên tệp trong Windows?",
    answers: [
      { text: "Nhấn F2 hoặc chuột phải > Rename", correct: true },
      { text: "Nhấn F5", correct: false },
      { text: "Nhấn Ctrl+C", correct: false },
      { text: "Nhấn Alt+Tab", correct: false },
    ],
    explanation: "F2 là phím tắt đổi tên tệp/thư mục trong Explorer.",
  },
  {
    question: "Định dạng tệp văn bản Microsoft Word phổ biến là?",
    answers: [
      { text: ".docx", correct: true },
      { text: ".xlsx", correct: false },
      { text: ".pptx", correct: false },
      { text: ".pdfx", correct: false },
    ],
    explanation: ".docx là định dạng chuẩn của Word từ Office 2007 trở đi.",
  },
  {
    question: "Trong Excel, ký hiệu bắt đầu công thức là gì?",
    answers: [
      { text: "= (dấu bằng)", correct: true },
      { text: "+ (dấu cộng)", correct: false },
      { text: "# (dấu thăng)", correct: false },
      { text: "@ (a còng)", correct: false },
    ],
    explanation: "Mọi công thức Excel đều bắt đầu bằng dấu =.",
  },
  {
    question: "Trong PowerPoint, để trình chiếu từ slide hiện tại dùng phím?",
    answers: [
      { text: "Shift+F5", correct: true },
      { text: "F5", correct: false },
      { text: "Ctrl+F5", correct: false },
      { text: "Alt+F5", correct: false },
    ],
    explanation: "F5 từ đầu, Shift+F5 từ slide hiện tại.",
  },
  {
    question: "Email phishing là gì?",
    answers: [
      { text: "Email giả mạo để lừa lấy thông tin", correct: true },
      { text: "Email chứa tệp nén lớn", correct: false },
      { text: "Email tự động trả lời", correct: false },
      { text: "Email quảng cáo hợp pháp", correct: false },
    ],
    explanation: "Phishing nhắm đánh cắp thông tin cá nhân/mật khẩu.",
  },
  {
    question: "Trong Word, tổ hợp phím in đậm là?",
    answers: [
      { text: "Ctrl+B", correct: true },
      { text: "Ctrl+I", correct: false },
      { text: "Ctrl+U", correct: false },
      { text: "Ctrl+L", correct: false },
    ],
    explanation: "B=Bold, I=Italic, U=Underline.",
  },
  {
    question: "Đơn vị lưu trữ nhỏ nhất trong máy tính là?",
    answers: [
      { text: "Bit", correct: true },
      { text: "Byte", correct: false },
      { text: "Kilobyte", correct: false },
      { text: "Megabyte", correct: false },
    ],
    explanation: "8 bit = 1 byte.",
  },
  {
    question: "Trình duyệt web là phần mềm dùng để?",
    answers: [
      { text: "Truy cập và hiển thị trang web", correct: true },
      { text: "Quản lý tệp hệ điều hành", correct: false },
      { text: "Chỉnh sửa video", correct: false },
      { text: "Nén/giải nén dữ liệu", correct: false },
    ],
    explanation: "Ví dụ: Chrome, Firefox, Edge, Safari.",
  },
  {
    question: "USB là viết tắt của?",
    answers: [
      { text: "Universal Serial Bus", correct: true },
      { text: "Uniform System Bus", correct: false },
      { text: "Universal Service Board", correct: false },
      { text: "Unified Serial Board", correct: false },
    ],
    explanation: "Chuẩn kết nối ngoại vi phổ biến.",
  },
];

/**
 * Ngân hàng câu hỏi cho Chứng chỉ Ứng dụng CNTT Nâng cao.
 */
const advancedQuestions = [
  {
    question: "Trong Excel, PivotTable dùng để?",
    answers: [
      { text: "Tổng hợp và phân tích dữ liệu", correct: true },
      { text: "Chèn biểu đồ động", correct: false },
      { text: "Định dạng có điều kiện", correct: false },
      { text: "Bảo vệ trang tính", correct: false },
    ],
    explanation: "PivotTable giúp tổng hợp theo nhiều chiều và lọc nhanh.",
  },
  {
    question: "Hàm nào tra cứu theo cột trong Excel hiện đại?",
    answers: [
      { text: "XLOOKUP", correct: true },
      { text: "VLOOKUP", correct: false },
      { text: "HLOOKUP", correct: false },
      { text: "MATCH", correct: false },
    ],
    explanation: "XLOOKUP linh hoạt hơn VLOOKUP/HLOOKUP (hỗ trợ 2 chiều).",
  },
  {
    question: "Trong Word, Mail Merge dùng để?",
    answers: [
      { text: "Trộn dữ liệu vào mẫu thư/tài liệu", correct: true },
      { text: "Gộp nhiều tệp PDF", correct: false },
      { text: "Chèn mục lục tự động", correct: false },
      { text: "Theo dõi thay đổi", correct: false },
    ],
    explanation: "Mail Merge kết hợp nguồn dữ liệu (Excel/CSV) vào mẫu.",
  },
  {
    question: "Slide Master trong PowerPoint dùng để?",
    answers: [
      { text: "Quản lý bố cục, định dạng toàn bộ slide", correct: true },
      { text: "Chèn hoạt hình", correct: false },
      { text: "Xuất video", correct: false },
      { text: "Ghi chú thuyết trình", correct: false },
    ],
    explanation: "Thay đổi Slide Master áp dụng cho tất cả slide dùng layout đó.",
  },
  {
    question: "Giao thức an toàn khi duyệt web là?",
    answers: [
      { text: "HTTPS", correct: true },
      { text: "HTTP", correct: false },
      { text: "FTP", correct: false },
      { text: "SMTP", correct: false },
    ],
    explanation: "HTTPS mã hoá lưu lượng giữa trình duyệt và máy chủ.",
  },
  {
    question: "Password mạnh nên có?",
    answers: [
      { text: "Độ dài đủ lớn và ký tự đa dạng", correct: true },
      { text: "Chỉ chữ thường dễ nhớ", correct: false },
      { text: "Ngày sinh để dễ nhớ", correct: false },
      { text: "Chung cho nhiều tài khoản", correct: false },
    ],
    explanation: "Dùng >12 ký tự, gồm chữ hoa/thường, số, ký tự đặc biệt.",
  },
  {
    question: "Excel: tính tổng có điều kiện dùng hàm?",
    answers: [
      { text: "SUMIF/SUMIFS", correct: true },
      { text: "COUNTIF", correct: false },
      { text: "AVERAGEIF", correct: false },
      { text: "SUBTOTAL", correct: false },
    ],
    explanation: "SUMIF/SUMIFS là hàm tổng có điều kiện.",
  },
  {
    question: "Word: tạo Mục lục (Table of Contents) dựa trên?",
    answers: [
      { text: "Các Heading Styles (Heading 1/2/3)", correct: true },
      { text: "Cỡ chữ lớn", correct: false },
      { text: "Đoạn in đậm", correct: false },
      { text: "Trang đầu tiên", correct: false },
    ],
    explanation: "TOC dựa trên các style Heading.",
  },
  {
    question: "Mạng máy tính: thiết bị định tuyến là?",
    answers: [
      { text: "Router", correct: true },
      { text: "Switch", correct: false },
      { text: "Access Point", correct: false },
      { text: "Repeater", correct: false },
    ],
    explanation: "Router kết nối nhiều mạng và định tuyến gói tin.",
  },
  {
    question: "Sao lưu dữ liệu tốt nhất là?",
    answers: [
      { text: "3-2-1 (3 bản, 2 loại, 1 bản offsite)", correct: true },
      { text: "Chỉ một bản trên máy", correct: false },
      { text: "Chỉ cloud, không cần kiểm tra", correct: false },
      { text: "USB duy nhất", correct: false },
    ],
    explanation: "Quy tắc 3-2-1 là phương án an toàn phổ biến.",
  },
];

/**
 * Seed questions and their answers for a given quiz. It ensures there are
 * at least 20 questions by duplicating the base questions array until
 * reaching that number. Questions are created with nested answer records.
 *
 * @param prisma Instance of PrismaClient for DB operations.
 * @param quiz The quiz record returned from seedQuiz.
 * @returns An array of created question records (including their answers).
 */
export async function seedQuestionsWithAnswers(
  prisma: PrismaClient,
  exam: { id: number; authorId: number | null }
): Promise<
  Array<{ id: number; choices: Array<{ id: number; isCorrect: boolean }> }>
> {
  // Nhân bản để đủ >= 20 câu hỏi
  const questions = basicQuestions.map((q) => ({ ...q }));
  const baseLen = questions.length;
  while (questions.length < 20) {
    questions.push({ ...questions[questions.length % baseLen] });
  }

  const created: Array<{
    id: number;
    choices: Array<{ id: number; isCorrect: boolean }>;
  }> = [];
  let order = 1;
  for (const q of questions) {
    const createdQuestion = await prisma.question.create({
      data: {
        subject: Subject.IT,
        type: QuestionType.SC,
        text: q.question,
        explanation: q.explanation,
        authorId: exam.authorId ?? undefined,
        choices: {
          create: q.answers.map((a: any, idx: number) => ({
            content: a.text,
            isCorrect: a.correct,
            order: idx,
          })),
        },
      },
      select: { id: true, choices: { select: { id: true, isCorrect: true } } },
    });

    await prisma.examQuestion.create({
      data: {
        examId: exam.id,
        questionId: createdQuestion.id,
        points: 1.0,
        order: order++,
      },
    });

    created.push(createdQuestion);
  }

  return created;
}

/**
 * Seed bộ câu hỏi Nâng cao cho một Exam.
 */
export async function seedAdvancedQuestionsWithAnswers(
  prisma: PrismaClient,
  exam: { id: number; authorId: number | null }
): Promise<Array<{ id: number; choices: Array<{ id: number; isCorrect: boolean }> }>> {
  const questions = advancedQuestions.map((q) => ({ ...q }));
  const baseLen = questions.length;
  while (questions.length < 20) {
    questions.push({ ...questions[questions.length % baseLen] });
  }

  const created: Array<{ id: number; choices: Array<{ id: number; isCorrect: boolean }> }> = [];
  let order = 1;
  for (const q of questions) {
    const createdQuestion = await prisma.question.create({
      data: {
        subject: Subject.IT,
        type: QuestionType.SC,
        text: q.question,
        explanation: q.explanation,
        authorId: exam.authorId ?? undefined,
        choices: {
          create: q.answers.map((a: any, idx: number) => ({
            content: a.text,
            isCorrect: a.correct,
            order: idx,
          })),
        },
      },
      select: { id: true, choices: { select: { id: true, isCorrect: true } } },
    });

    await prisma.examQuestion.create({
      data: {
        examId: exam.id,
        questionId: createdQuestion.id,
        points: 1.0,
        order: order++,
      },
    });

    created.push(createdQuestion);
  }

  return created;
}
