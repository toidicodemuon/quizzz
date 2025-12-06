/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedTH06L(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[TH06L] Thuật toán là gì?",
    "explanation": "Là tập hợp hữu hạn các bước để giải quyết một bài toán.",
    "choices": [
      {
        "content": "Tập hợp hữu hạn bước giải bài toán",
        "isCorrect": true
      },
      {
        "content": "Ngôn ngữ lập trình",
        "isCorrect": false
      },
      {
        "content": "Máy tính",
        "isCorrect": false
      },
      {
        "content": "Chỉ là sơ đồ",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Ký hiệu bắt đầu/kết thúc trong lưu đồ (flowchart) là hình gì?",
    "explanation": "Hình bầu dục (terminator) dùng cho bắt đầu/kết thúc.",
    "choices": [
      {
        "content": "Hình bầu dục (terminator)",
        "isCorrect": true
      },
      {
        "content": "Hình chữ nhật (process)",
        "isCorrect": false
      },
      {
        "content": "Hình thoi (decision)",
        "isCorrect": false
      },
      {
        "content": "Hình bình hành (input/output)",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Trong bảng tính, \"ô\" (cell) là gì?",
    "explanation": "Giao điểm của một hàng và một cột.",
    "choices": [
      {
        "content": "Giao điểm hàng và cột",
        "isCorrect": true
      },
      {
        "content": "Một trang tính",
        "isCorrect": false
      },
      {
        "content": "Một biểu đồ",
        "isCorrect": false
      },
      {
        "content": "Một công thức",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Hàm tính tổng trong Excel là?",
    "explanation": "Hàm SUM tính tổng dãy số, ví dụ =SUM(A1:A10).",
    "choices": [
      {
        "content": "SUM",
        "isCorrect": true
      },
      {
        "content": "AVERAGE",
        "isCorrect": false
      },
      {
        "content": "MAX",
        "isCorrect": false
      },
      {
        "content": "COUNT",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Trong Scratch, khối lệnh nào để di chuyển nhân vật theo trục x?",
    "explanation": "Khối \"change x by ...\" (thay đổi x).",
    "choices": [
      {
        "content": "change x by ...",
        "isCorrect": true
      },
      {
        "content": "set size to ...",
        "isCorrect": false
      },
      {
        "content": "repeat ...",
        "isCorrect": false
      },
      {
        "content": "when green flag clicked",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] \"Trình chiếu\" là gì?",
    "explanation": "Là tập các slide trình bày nội dung theo thứ tự.",
    "choices": [
      {
        "content": "Tập các slide trình bày nội dung",
        "isCorrect": true
      },
      {
        "content": "Một trang web",
        "isCorrect": false
      },
      {
        "content": "Một tệp âm thanh",
        "isCorrect": false
      },
      {
        "content": "Một chương trình diệt virus",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Hệ đếm nhị phân sử dụng mấy ký số?",
    "explanation": "Hệ nhị phân chỉ dùng 2 ký số: 0 và 1.",
    "choices": [
      {
        "content": "2 ký số: 0 và 1",
        "isCorrect": true
      },
      {
        "content": "8 ký số",
        "isCorrect": false
      },
      {
        "content": "10 ký số",
        "isCorrect": false
      },
      {
        "content": "16 ký số",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH06L] Trong Excel, địa chỉ vùng (range) từ A1 đến B3 viết là?",
    "explanation": "A1:B3 đại diện cho vùng chữ nhật từ A1 đến B3.",
    "choices": [
      {
        "content": "A1:B3",
        "isCorrect": true
      },
      {
        "content": "A1->B3",
        "isCorrect": false
      },
      {
        "content": "(A1,B3)",
        "isCorrect": false
      },
      {
        "content": "A1..B3",
        "isCorrect": false
      }
    ]
  }
];

  for (const q of questions) {{
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }}
}}
