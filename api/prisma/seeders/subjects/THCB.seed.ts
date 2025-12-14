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
,
{
  "text": "[THCB] Câu hỏi bổ sung số 9 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 10 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 11 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 12 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 13 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 14 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 15 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 16 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 17 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 18 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 19 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 20 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 21 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 22 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 23 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 24 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 25 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 26 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 27 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 28 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 29 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 30 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 31 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 32 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 33 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 34 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 35 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 36 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 37 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 38 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 39 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 40 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 41 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 42 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 43 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 44 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 45 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 46 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 47 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 48 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 49 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 50 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 51 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 52 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 53 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 54 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 55 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 56 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 57 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 58 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 59 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
},
{
  "text": "[THCB] Câu hỏi bổ sung số 60 cho môn Tin học cơ bản (placeholder)?",
  "explanation": "Câu hỏi placeholder được sinh tự động để đủ số lượng. Vui lòng chỉnh sửa nội dung thực tế sau khi seed dữ liệu.",
  "choices": [
    {
      "content": "Đáp án đúng (placeholder)",
      "isCorrect": true
    },
    {
      "content": "Đáp án sai 1 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 2 (placeholder)",
      "isCorrect": false
    },
    {
      "content": "Đáp án sai 3 (placeholder)",
      "isCorrect": false
    }
  ]
}];

  for (const q of questions) {{
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }}
}}
