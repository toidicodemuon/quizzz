/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedTHCB(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[THCB] Đơn vị nhỏ nhất để đo thông tin trong máy tính là gì?",
    "explanation": "Bit là đơn vị nhỏ nhất (giá trị 0 hoặc 1).",
    "choices": [
      {
        "content": "Bit",
        "isCorrect": true
      },
      {
        "content": "Byte",
        "isCorrect": false
      },
      {
        "content": "Kilobyte (KB)",
        "isCorrect": false
      },
      {
        "content": "Megabyte (MB)",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Thiết bị nào sau đây là THIẾT BỊ NHẬP dữ liệu?",
    "explanation": "Bàn phím (keyboard) là thiết bị nhập.",
    "choices": [
      {
        "content": "Bàn phím",
        "isCorrect": true
      },
      {
        "content": "Màn hình",
        "isCorrect": false
      },
      {
        "content": "Máy in",
        "isCorrect": false
      },
      {
        "content": "Loa",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Hệ điều hành (Operating System) là gì?",
    "explanation": "Hệ điều hành là phần mềm quản lý tài nguyên và cung cấp dịch vụ cho phần mềm ứng dụng.",
    "choices": [
      {
        "content": "Phần mềm quản lý tài nguyên và cung cấp dịch vụ cho ứng dụng",
        "isCorrect": true
      },
      {
        "content": "Thiết bị lưu trữ ngoài",
        "isCorrect": false
      },
      {
        "content": "Trình soạn thảo văn bản",
        "isCorrect": false
      },
      {
        "content": "Trình duyệt web",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Phím tắt sao chép (Copy) trên Windows là?",
    "explanation": "Ctrl + C dùng để sao chép nội dung đã chọn.",
    "choices": [
      {
        "content": "Ctrl + C",
        "isCorrect": true
      },
      {
        "content": "Ctrl + V",
        "isCorrect": false
      },
      {
        "content": "Ctrl + X",
        "isCorrect": false
      },
      {
        "content": "Ctrl + Z",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Tên tệp hợp lệ trong Windows là?",
    "explanation": "Tên tệp không được chứa ký tự đặc biệt như \\ / : * ? \" < > |.",
    "choices": [
      {
        "content": "Bao_cao.docx",
        "isCorrect": true
      },
      {
        "content": "Bai?tap.txt",
        "isCorrect": false
      },
      {
        "content": "Anh|1.png",
        "isCorrect": false
      },
      {
        "content": "Thu:Muc.pdf",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Bộ nhớ nào là bộ nhớ tạm thời, mất dữ liệu khi tắt máy?",
    "explanation": "RAM là bộ nhớ truy cập ngẫu nhiên, dữ liệu mất khi tắt nguồn.",
    "choices": [
      {
        "content": "RAM",
        "isCorrect": true
      },
      {
        "content": "ROM",
        "isCorrect": false
      },
      {
        "content": "Ổ cứng HDD",
        "isCorrect": false
      },
      {
        "content": "Ổ SSD",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Tổ hợp phím chuyển nhanh giữa các cửa sổ (Windows) là?",
    "explanation": "Alt + Tab cho phép chuyển đổi giữa các cửa sổ đang mở.",
    "choices": [
      {
        "content": "Alt + Tab",
        "isCorrect": true
      },
      {
        "content": "Win + D",
        "isCorrect": false
      },
      {
        "content": "Ctrl + Tab",
        "isCorrect": false
      },
      {
        "content": "Ctrl + Alt + Del",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[THCB] Ứng dụng nào là phần mềm ứng dụng (application software)?",
    "explanation": "Microsoft Word là phần mềm ứng dụng soạn thảo văn bản.",
    "choices": [
      {
        "content": "Microsoft Word",
        "isCorrect": true
      },
      {
        "content": "BIOS",
        "isCorrect": false
      },
      {
        "content": "Trình điều khiển (driver)",
        "isCorrect": false
      },
      {
        "content": "Firmware",
        "isCorrect": false
      }
    ]
  }
];

  for (const q of questions) {{
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }}
}}
