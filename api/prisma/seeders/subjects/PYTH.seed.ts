/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedPYTH(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[PYTH] Kết quả của biểu thức 2 ** 3 trong Python là?",
    "explanation": "Toán tử ** là lũy thừa, 2**3 = 8.",
    "choices": [
      {
        "content": "8",
        "isCorrect": true
      },
      {
        "content": "6",
        "isCorrect": false
      },
      {
        "content": "9",
        "isCorrect": false
      },
      {
        "content": "16",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Hàm nào chuyển chuỗi '123' thành số nguyên?",
    "explanation": "int('123') trả về 123.",
    "choices": [
      {
        "content": "int('123')",
        "isCorrect": true
      },
      {
        "content": "str(123)",
        "isCorrect": false
      },
      {
        "content": "float('123')",
        "isCorrect": false
      },
      {
        "content": "eval('123.0')",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Biểu thức [1,2,3][1:] trả về?",
    "explanation": "Cắt từ chỉ số 1 đến hết: [2, 3].",
    "choices": [
      {
        "content": "[2, 3]",
        "isCorrect": true
      },
      {
        "content": "[1, 2]",
        "isCorrect": false
      },
      {
        "content": "[1, 2, 3, 4]",
        "isCorrect": false
      },
      {
        "content": "[3]",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Từ khóa định nghĩa hàm trong Python là?",
    "explanation": "def dùng để định nghĩa hàm.",
    "choices": [
      {
        "content": "def",
        "isCorrect": true
      },
      {
        "content": "function",
        "isCorrect": false
      },
      {
        "content": "fun",
        "isCorrect": false
      },
      {
        "content": "lambda",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Kiểu dữ liệu của {'a':1, 'b':2} là?",
    "explanation": "Đó là dict (từ điển).",
    "choices": [
      {
        "content": "dict",
        "isCorrect": true
      },
      {
        "content": "list",
        "isCorrect": false
      },
      {
        "content": "set",
        "isCorrect": false
      },
      {
        "content": "tuple",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Toán tử 'in' dùng để?",
    "explanation": "Kiểm tra phần tử có thuộc trong một tập hợp/chuỗi.",
    "choices": [
      {
        "content": "Kiểm tra phần tử thuộc tập hợp/chuỗi",
        "isCorrect": true
      },
      {
        "content": "So sánh bằng",
        "isCorrect": false
      },
      {
        "content": "Gán giá trị",
        "isCorrect": false
      },
      {
        "content": "Tạo bản sao",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Khối lệnh nào xử lý ngoại lệ?",
    "explanation": "try ... except ... finally.",
    "choices": [
      {
        "content": "try / except / finally",
        "isCorrect": true
      },
      {
        "content": "if / else",
        "isCorrect": false
      },
      {
        "content": "for / else",
        "isCorrect": false
      },
      {
        "content": "with / as",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[PYTH] Hàm len('hello') trả về?",
    "explanation": "Độ dài chuỗi 'hello' là 5.",
    "choices": [
      {
        "content": "5",
        "isCorrect": true
      },
      {
        "content": "4",
        "isCorrect": false
      },
      {
        "content": "6",
        "isCorrect": false
      },
      {
        "content": "0",
        "isCorrect": false
      }
    ]
  }
,
{
  "text": "[PYTH] Câu hỏi bổ sung số 9 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 10 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 11 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 12 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 13 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 14 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 15 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 16 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 17 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 18 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 19 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 20 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 21 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 22 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 23 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 24 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 25 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 26 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 27 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 28 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 29 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 30 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 31 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 32 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 33 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 34 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 35 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 36 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 37 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 38 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 39 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 40 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 41 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 42 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 43 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 44 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 45 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 46 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 47 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 48 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 49 cho môn Lập trình Python (placeholder)?",
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
  "text": "[PYTH] Câu hỏi bổ sung số 50 cho môn Lập trình Python (placeholder)?",
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
