/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedTH08(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[TH08] Biến (variable) trong lập trình là gì?",
    "explanation": "Một vùng nhớ có tên để lưu trữ giá trị thay đổi trong chương trình.",
    "choices": [
      {
        "content": "Vùng nhớ có tên lưu trữ giá trị",
        "isCorrect": true
      },
      {
        "content": "Một câu lệnh lặp",
        "isCorrect": false
      },
      {
        "content": "Một hằng số",
        "isCorrect": false
      },
      {
        "content": "Một tệp tin",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Câu lệnh điều kiện if dùng để?",
    "explanation": "Rẽ nhánh thực hiện theo điều kiện đúng/sai.",
    "choices": [
      {
        "content": "Rẽ nhánh theo điều kiện",
        "isCorrect": true
      },
      {
        "content": "Lặp lại nhiều lần",
        "isCorrect": false
      },
      {
        "content": "Định nghĩa hàm",
        "isCorrect": false
      },
      {
        "content": "Khai báo biến hằng",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Vòng lặp for phù hợp khi?",
    "explanation": "Biết trước số lần lặp.",
    "choices": [
      {
        "content": "Khi biết trước số lần lặp",
        "isCorrect": true
      },
      {
        "content": "Khi không biết số lần lặp",
        "isCorrect": false
      },
      {
        "content": "Khi cần rẽ nhánh",
        "isCorrect": false
      },
      {
        "content": "Khi kết thúc chương trình",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Toán tử gán (assignment) là?",
    "explanation": "Dùng để gán giá trị cho biến, ví dụ x = 5.",
    "choices": [
      {
        "content": "=",
        "isCorrect": true
      },
      {
        "content": "==",
        "isCorrect": false
      },
      {
        "content": "===",
        "isCorrect": false
      },
      {
        "content": "=>",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Mảng (array) là gì?",
    "explanation": "Cấu trúc dữ liệu lưu nhiều phần tử cùng kiểu dưới một tên.",
    "choices": [
      {
        "content": "Tập hợp nhiều phần tử cùng kiểu",
        "isCorrect": true
      },
      {
        "content": "Một giá trị đơn",
        "isCorrect": false
      },
      {
        "content": "Một câu lệnh điều kiện",
        "isCorrect": false
      },
      {
        "content": "Một kiểu lặp vô hạn",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Thuật toán tìm giá trị lớn nhất trong danh sách cần?",
    "explanation": "Duyệt từng phần tử, cập nhật biến max khi gặp giá trị lớn hơn.",
    "choices": [
      {
        "content": "Duyệt và cập nhật biến max",
        "isCorrect": true
      },
      {
        "content": "Sắp xếp rồi lấy phần tử đầu",
        "isCorrect": false
      },
      {
        "content": "Đếm số phần tử",
        "isCorrect": false
      },
      {
        "content": "Chọn ngẫu nhiên",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Kiểu dữ liệu nguyên (integer) dùng để lưu?",
    "explanation": "Các số nguyên không có phần thập phân.",
    "choices": [
      {
        "content": "Số nguyên",
        "isCorrect": true
      },
      {
        "content": "Số thực",
        "isCorrect": false
      },
      {
        "content": "Chuỗi ký tự",
        "isCorrect": false
      },
      {
        "content": "Giá trị logic",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH08] Vòng lặp while tiếp tục khi?",
    "explanation": "Điều kiện còn đúng.",
    "choices": [
      {
        "content": "Điều kiện còn đúng",
        "isCorrect": true
      },
      {
        "content": "Người dùng nhấn Enter",
        "isCorrect": false
      },
      {
        "content": "Hết bộ nhớ",
        "isCorrect": false
      },
      {
        "content": "Hàm trả về",
        "isCorrect": false
      }
    ]
  }
,
{
  "text": "[TH08] Câu hỏi bổ sung số 9 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 10 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 11 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 12 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 13 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 14 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 15 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 16 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 17 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 18 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 19 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 20 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 21 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 22 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 23 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 24 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 25 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 26 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 27 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 28 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 29 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 30 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 31 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 32 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 33 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 34 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 35 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 36 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 37 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 38 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 39 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 40 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 41 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 42 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 43 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 44 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 45 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 46 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 47 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 48 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 49 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 50 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 51 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 52 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 53 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 54 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 55 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 56 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 57 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 58 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 59 cho môn Tin học lớp 8 (placeholder)?",
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
  "text": "[TH08] Câu hỏi bổ sung số 60 cho môn Tin học lớp 8 (placeholder)?",
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
