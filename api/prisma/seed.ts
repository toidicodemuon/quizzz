import { PrismaClient, UserRole, QuizStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.submissionAnswer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
  console.log("Đã xóa dữ liệu cũ.");
  // ====== 1. Tạo tài khoản mẫu ======
  const teacherPassword = await bcrypt.hash("123456", 10);
  const studentPassword = await bcrypt.hash("123456", 10);

  const teacher = await prisma.user.upsert({
    where: { username: "teacher1" },
    update: {},
    create: {
      username: "teacher1",
      passwordHash: teacherPassword,
      role: UserRole.TEACHER,
    },
  });

  const student = await prisma.user.upsert({
    where: { username: "student1" },
    update: {},
    create: {
      username: "student1",
      passwordHash: studentPassword,
      role: UserRole.STUDENT,
    },
  });

  // ====== 2. Tạo đề thi ======
  const quiz = await prisma.quiz.create({
    data: {
      title: "Đề thi Lập trình JavaScript cơ bản",
      description:
        "Đề kiểm tra kiến thức JavaScript cơ bản: cú pháp, biến, hàm, mảng, vòng lặp, DOM, ES6...",
      timeLimitMinutes: 30,
      status: QuizStatus.PUBLISHED,
      teacherId: teacher.id,
    },
  });

  // ====== 3. Danh sách câu hỏi ======
  const questions = [
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
      explanation:
        "`let` và `const` có phạm vi block, còn `var` là function scope.",
    },
    {
      question: "Kết quả của `typeof null` là gì?",
      answers: [
        { text: '"null"', correct: false },
        { text: '"undefined"', correct: false },
        { text: '"object"', correct: true },
        { text: '"number"', correct: false },
      ],
      explanation:
        'Đây là một “bug lịch sử” trong JavaScript, `typeof null` trả về "object".',
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
      question: 'Hàm `parseInt("10abc")` trả về gì?',
      answers: [
        { text: "NaN", correct: false },
        { text: "10", correct: true },
        { text: '"10abc"', correct: false },
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
        { text: 'Dấu ngoặc kép ""', correct: false },
        { text: "Dấu ngoặc đơn ''", correct: false },
        { text: "Dấu backtick ``", correct: true },
        { text: "Dấu ngoặc nhọn {}", correct: false },
      ],
      explanation:
        "Template string dùng dấu backtick `` và có thể chèn biến `${}`.",
    },
    // thêm 10 câu nữa tuỳ bạn muốn mở rộng (ở seed có thể clone 1 số)
  ];

  // Tạo 20 câu (nhân đôi nếu cần)
  while (questions.length < 20) {
    questions.push({ ...questions[questions.length % 10] });
  }

  // Tạo câu hỏi và đáp án trong DB
  const createdQuestions = [];
  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        questionText: q.question,
        explanation: q.explanation,
        quizId: quiz.id,
        answers: {
          create: q.answers.map((a) => ({
            answerText: a.text,
            isCorrect: a.correct,
          })),
        },
      },
      include: { answers: true },
    });
    createdQuestions.push(question);
  }

  // ====== 4. Tạo bài nộp mẫu ======
  let correctCount = 0;
  const submission = await prisma.submission.create({
    data: {
      score: 0,
      studentId: student.id,
      quizId: quiz.id,
      submissionAnswers: {
        create: createdQuestions.map((q) => {
          const correct = q.answers.find((a) => a.isCorrect);
          const random = Math.random() < 0.6; // 60% đúng
          const selected =
            random && correct
              ? correct
              : q.answers[Math.floor(Math.random() * q.answers.length)];
          if (selected.isCorrect) correctCount++;
          return { questionId: q.id, selectedAnswerId: selected.id };
        }),
      },
    },
  });

  // Cập nhật điểm
  const score = (correctCount / createdQuestions.length) * 100;
  await prisma.submission.update({
    where: { id: submission.id },
    data: { score },
  });

  console.log("✅ Seed hoàn tất!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
