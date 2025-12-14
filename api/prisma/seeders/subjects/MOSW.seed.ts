/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedMOSW(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[MOSW] Tính năng Styles dùng để?",
    "explanation": "Áp dụng định dạng nhất quán cho tiêu đề/đoạn văn, hỗ trợ mục lục tự động.",
    "choices": [
      {
        "content": "Định dạng nhất quán và hỗ trợ mục lục",
        "isCorrect": true
      },
      {
        "content": "Chỉ đổi font chữ",
        "isCorrect": false
      },
      {
        "content": "Chỉ chèn hình ảnh",
        "isCorrect": false
      },
      {
        "content": "Chỉ kiểm tra chính tả",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Để tạo Mục lục (Table of Contents) tự động cần?",
    "explanation": "Áp dụng các Heading Styles cho tiêu đề trước khi Insert TOC.",
    "choices": [
      {
        "content": "Áp dụng Heading Styles rồi Insert TOC",
        "isCorrect": true
      },
      {
        "content": "Tô đậm thủ công",
        "isCorrect": false
      },
      {
        "content": "Dùng bảng",
        "isCorrect": false
      },
      {
        "content": "Dán từ Excel",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Theo dõi thay đổi (Track Changes) nằm ở thẻ?",
    "explanation": "Review → Track Changes.",
    "choices": [
      {
        "content": "Review → Track Changes",
        "isCorrect": true
      },
      {
        "content": "Home → Track",
        "isCorrect": false
      },
      {
        "content": "Insert → Changes",
        "isCorrect": false
      },
      {
        "content": "Layout → Track",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Ngắt phần (Section Break) dùng để?",
    "explanation": "Chia tài liệu thành phần để thay đổi định dạng (lề, hướng trang, đánh số).",
    "choices": [
      {
        "content": "Chia phần để thay đổi định dạng cục bộ",
        "isCorrect": true
      },
      {
        "content": "Chèn bảng",
        "isCorrect": false
      },
      {
        "content": "Chèn hình",
        "isCorrect": false
      },
      {
        "content": "Tạo đánh số đầu dòng",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Tìm–Thay (Find & Replace) mở bằng phím tắt?",
    "explanation": "Ctrl + H mở hộp thoại Replace.",
    "choices": [
      {
        "content": "Ctrl + H",
        "isCorrect": true
      },
      {
        "content": "Ctrl + F",
        "isCorrect": false
      },
      {
        "content": "Ctrl + G",
        "isCorrect": false
      },
      {
        "content": "Ctrl + R",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Chèn chú thích hình (Caption) nằm ở?",
    "explanation": "References → Insert Caption.",
    "choices": [
      {
        "content": "References → Insert Caption",
        "isCorrect": true
      },
      {
        "content": "Insert → Caption",
        "isCorrect": false
      },
      {
        "content": "Layout → Caption",
        "isCorrect": false
      },
      {
        "content": "Review → Caption",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Thiết lập lề (Margins) ở?",
    "explanation": "Layout → Margins.",
    "choices": [
      {
        "content": "Layout → Margins",
        "isCorrect": true
      },
      {
        "content": "Home → Margins",
        "isCorrect": false
      },
      {
        "content": "Insert → Margins",
        "isCorrect": false
      },
      {
        "content": "View → Margins",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[MOSW] Để tạo Header khác nhau cho mỗi Section, cần?",
    "explanation": "Tắt 'Link to Previous' rồi chỉnh Header cho từng Section.",
    "choices": [
      {
        "content": "Tắt Link to Previous trong Header/Footer",
        "isCorrect": true
      },
      {
        "content": "Bật Same As Previous",
        "isCorrect": false
      },
      {
        "content": "Dùng Watermark",
        "isCorrect": false
      },
      {
        "content": "Chỉ đổi Font",
        "isCorrect": false
      }
    ]
  }
,
{
  "text": "[MOSW] Câu hỏi bổ sung số 9 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 10 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 11 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 12 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 13 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 14 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 15 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 16 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 17 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 18 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 19 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 20 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 21 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 22 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 23 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 24 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 25 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 26 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 27 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 28 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 29 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 30 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 31 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 32 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 33 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 34 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 35 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 36 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 37 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 38 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 39 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 40 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 41 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 42 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 43 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 44 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 45 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 46 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 47 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 48 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 49 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 50 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 51 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 52 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 53 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 54 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 55 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 56 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 57 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 58 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 59 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 60 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 61 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 62 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 63 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 64 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 65 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 66 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 67 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 68 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 69 cho môn MOS Word (placeholder)?",
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
  "text": "[MOSW] Câu hỏi bổ sung số 70 cho môn MOS Word (placeholder)?",
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
