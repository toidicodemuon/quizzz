import { PrismaClient } from "@prisma/client";

/**
 * Define the list of questions and answers for the quiz. Each question
 * includes the question text, possible answers with a boolean indicating
 * correctness, and an explanation. Later this list will be duplicated
 * to ensure there are at least 20 questions.
 */
const baseQuestions = [
  {
    question: "JavaScript là ngôn ngữ kiểu gì?",
    answers: [
      { text: "Ngôn ngữ biên dịch tĩnh", correct: false },
      { text: "Ngôn ngữ thông dịch động", correct: true },
      { text: "Ngôn ngữ lập trình hệ thống", correct: false },
      { text: "Ngôn ngữ máy", correct: false },
    ],
    explanation:
      "JavaScript là ngôn ngữ thông dịch, kiểu động chạy trong trình duyệt hoặc Node.js.",
  },
  {
    question: "Từ khóa nào khai báo biến có phạm vi block?",
    answers: [
      { text: "var", correct: false },
      { text: "let", correct: true },
      { text: "const", correct: false },
      { text: "function", correct: false },
    ],
    explanation: "`let` và `const` có phạm vi block, còn `var` là function scope.",
  },
  {
    question: "Kết quả của `typeof null` là gì?",
    answers: [
      { text: "\"null\"", correct: false },
      { text: "\"undefined\"", correct: false },
      { text: "\"object\"", correct: true },
      { text: "\"number\"", correct: false },
    ],
    explanation:
      "Đây là một “bug lịch sử” trong JavaScript, `typeof null` trả về \"object\".",
  },
  {
    question: "Phương thức nào thêm phần tử vào cuối mảng?",
    answers: [
      { text: "push()", correct: true },
      { text: "pop()", correct: false },
      { text: "shift()", correct: false },
      { text: "unshift()", correct: false },
    ],
    explanation:
      "`push()` thêm phần tử vào cuối mảng, `pop()` loại bỏ phần tử cuối.",
  },
  {
    question: "DOM viết tắt của cụm từ nào?",
    answers: [
      { text: "Document Object Model", correct: true },
      { text: "Data Object Management", correct: false },
      { text: "Dynamic Object Map", correct: false },
      { text: "Document Oriented Mapping", correct: false },
    ],
    explanation:
      "DOM = Document Object Model, mô tả cấu trúc HTML như cây các node.",
  },
  {
    question: "Khai báo hằng số trong JavaScript dùng từ khóa nào?",
    answers: [
      { text: "let", correct: false },
      { text: "const", correct: true },
      { text: "var", correct: false },
      { text: "static", correct: false },
    ],
    explanation: "Hằng số dùng `const` và không thể gán lại giá trị.",
  },
  {
    question: "Hàm `parseInt(\"10abc\")` trả về gì?",
    answers: [
      { text: "NaN", correct: false },
      { text: "10", correct: true },
      { text: "\"10abc\"", correct: false },
      { text: "Error", correct: false },
    ],
    explanation:
      "`parseInt` sẽ lấy số hợp lệ đầu tiên, dừng khi gặp ký tự không hợp lệ.",
  },
  {
    question: "Giá trị mặc định của biến chưa gán là gì?",
    answers: [
      { text: "null", correct: false },
      { text: "undefined", correct: true },
      { text: "0", correct: false },
      { text: "NaN", correct: false },
    ],
    explanation: "Biến chưa gán sẽ có giá trị `undefined`.",
  },
  {
    question: "Cú pháp arrow function đúng?",
    answers: [
      { text: "function => () {}", correct: false },
      { text: "() => {}", correct: true },
      { text: "=> {}", correct: false },
      { text: "(=>) {}", correct: false },
    ],
    explanation: "Arrow function có dạng `() => {}`.",
  },
  {
    question: "Template string được viết với ký tự gì?",
    answers: [
      { text: "Dấu ngoặc kép \"\"", correct: false },
      { text: "Dấu ngoặc đơn ''", correct: false },
      { text: "Dấu backtick ``", correct: true },
      { text: "Dấu ngoặc nhọn {}", correct: false },
    ],
    explanation:
      "Template string dùng dấu backtick `` và có thể chèn biến `${}`.",
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
  quiz: { id: number }
): Promise<any[]> {
  // Make a copy so modifications (like duplication) don't affect the original base.
  const questions: any[] = baseQuestions.map((q) => ({ ...q }));

  // Duplicate questions until we have at least 20 entries.
  while (questions.length < 20) {
    questions.push({ ...questions[questions.length % 10] });
  }

  const createdQuestions = [];
  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        questionText: q.question,
        explanation: q.explanation,
        quizId: quiz.id,
        answers: {
          create: q.answers.map((a: any) => ({
            answerText: a.text,
            isCorrect: a.correct,
          })),
        },
      },
      include: { answers: true },
    });
    createdQuestions.push(question);
  }
  return createdQuestions;
}