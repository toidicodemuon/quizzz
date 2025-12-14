/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedMOSE(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[MOSE] Tên vùng có tên (Named Range) giúp?",
    "explanation": "Dễ tham chiếu trong công thức và điều hướng.",
    "choices": [
      {
        "content": "Dễ tham chiếu công thức, điều hướng",
        "isCorrect": true
      },
      {
        "content": "Tăng dung lượng tệp",
        "isCorrect": false
      },
      {
        "content": "Giảm tốc độ tính toán",
        "isCorrect": false
      },
      {
        "content": "Ẩn dữ liệu",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Hàm VLOOKUP dùng để?",
    "explanation": "Tìm giá trị theo cột đầu tiên và trả về từ cột chỉ định.",
    "choices": [
      {
        "content": "Tra cứu theo cột đầu tiên, trả về ở cột khác",
        "isCorrect": true
      },
      {
        "content": "Tính tổng theo điều kiện",
        "isCorrect": false
      },
      {
        "content": "Đếm số ô có dữ liệu",
        "isCorrect": false
      },
      {
        "content": "Tách chuỗi",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] PivotTable dùng để?",
    "explanation": "Tóm tắt, tổng hợp và phân tích dữ liệu linh hoạt.",
    "choices": [
      {
        "content": "Tổng hợp/phân tích dữ liệu linh hoạt",
        "isCorrect": true
      },
      {
        "content": "Tạo biểu đồ duy nhất",
        "isCorrect": false
      },
      {
        "content": "Định dạng có điều kiện",
        "isCorrect": false
      },
      {
        "content": "Xóa dữ liệu trùng",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Hàm COUNTIF(A1:A10, \">5\") trả về?",
    "explanation": "Đếm số ô trong A1:A10 có giá trị > 5.",
    "choices": [
      {
        "content": "Số ô có giá trị > 5 trong A1:A10",
        "isCorrect": true
      },
      {
        "content": "Tổng các ô > 5",
        "isCorrect": false
      },
      {
        "content": "Đếm ô trống",
        "isCorrect": false
      },
      {
        "content": "Đếm văn bản",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Ghép chuỗi họ và tên trong A2 và B2 dùng công thức?",
    "explanation": "Dùng =A2&\" \"&B2 hoặc =CONCAT(A2,\" \",B2).",
    "choices": [
      {
        "content": "=A2&\" \"&B2",
        "isCorrect": true
      },
      {
        "content": "=A2+B2",
        "isCorrect": false
      },
      {
        "content": "=SUM(A2,B2)",
        "isCorrect": false
      },
      {
        "content": "=TEXT(A2,B2)",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Định dạng có điều kiện (Conditional Formatting) dùng để?",
    "explanation": "Đổi màu/định dạng ô dựa trên quy tắc.",
    "choices": [
      {
        "content": "Định dạng dựa trên quy tắc",
        "isCorrect": true
      },
      {
        "content": "Sao chép định dạng",
        "isCorrect": false
      },
      {
        "content": "Khóa trang tính",
        "isCorrect": false
      },
      {
        "content": "Tạo biểu đồ",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Hàm TEXT(..., \"dd/mm/yyyy\") dùng để?",
    "explanation": "Định dạng số/ngày thành chuỗi theo mẫu.",
    "choices": [
      {
        "content": "Chuyển số/ngày thành chuỗi định dạng",
        "isCorrect": true
      },
      {
        "content": "Chuyển chuỗi thành ngày",
        "isCorrect": false
      },
      {
        "content": "Tạo số ngẫu nhiên",
        "isCorrect": false
      },
      {
        "content": "Làm tròn số",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSE] Power Query dùng để?",
    "explanation": "Kết nối, biến đổi và nạp dữ liệu từ nhiều nguồn.",
    "choices": [
      {
        "content": "Kết nối/biến đổi/nạp dữ liệu",
        "isCorrect": true
      },
      {
        "content": "Tạo macro VBA",
        "isCorrect": false
      },
      {
        "content": "Bảo mật tệp",
        "isCorrect": false
      },
      {
        "content": "Vẽ sơ đồ Gantt",
        "isCorrect": false
      }
    ]
  }
,
{
  "text": "[MOSE] Câu hỏi bổ sung số 9 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 10 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 11 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 12 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 13 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 14 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 15 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 16 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 17 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 18 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 19 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 20 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 21 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 22 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 23 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 24 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 25 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 26 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 27 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 28 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 29 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 30 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 31 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 32 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 33 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 34 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 35 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 36 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 37 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 38 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 39 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 40 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 41 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 42 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 43 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 44 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 45 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 46 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 47 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 48 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 49 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 50 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 51 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 52 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 53 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 54 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 55 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 56 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 57 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 58 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 59 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 60 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 61 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 62 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 63 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 64 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 65 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 66 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 67 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 68 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 69 cho môn MOS Excel (placeholder)?",
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
  "text": "[MOSE] Câu hỏi bổ sung số 70 cho môn MOS Excel (placeholder)?",
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
