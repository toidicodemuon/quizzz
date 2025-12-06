/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, QuestionSeed } from "../seedUtils";

export async function seedTH12L(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {{
  const questions: QuestionSeed[] = [
  {
    "text": "[TH12L] Đồ thị vô hướng gồm?",
    "explanation": "Tập đỉnh và tập cạnh (không có hướng).",
    "choices": [
      {
        "content": "Tập đỉnh và cạnh không hướng",
        "isCorrect": true
      },
      {
        "content": "Chỉ đỉnh",
        "isCorrect": false
      },
      {
        "content": "Chỉ cạnh",
        "isCorrect": false
      },
      {
        "content": "Đồ thị có hướng",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Thuật toán duyệt theo chiều sâu (DFS) sử dụng cấu trúc?",
    "explanation": "Ngăn xếp (stack) hoặc đệ quy.",
    "choices": [
      {
        "content": "Ngăn xếp hoặc đệ quy",
        "isCorrect": true
      },
      {
        "content": "Hàng đợi",
        "isCorrect": false
      },
      {
        "content": "Bảng băm",
        "isCorrect": false
      },
      {
        "content": "Heap",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Thuật toán Dijkstra tìm?",
    "explanation": "Đường đi ngắn nhất từ một nguồn đến các đỉnh khác (trọng số không âm).",
    "choices": [
      {
        "content": "Đường đi ngắn nhất với trọng số không âm",
        "isCorrect": true
      },
      {
        "content": "Cây khung nhỏ nhất",
        "isCorrect": false
      },
      {
        "content": "Tập độc lập cực đại",
        "isCorrect": false
      },
      {
        "content": "Bao lồi của điểm",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Trong CSDL, ràng buộc toàn vẹn tham chiếu yêu cầu?",
    "explanation": "Khóa ngoại phải tham chiếu tới khóa chính tồn tại.",
    "choices": [
      {
        "content": "Khóa ngoại tham chiếu khóa chính tồn tại",
        "isCorrect": true
      },
      {
        "content": "Tự động xóa tất cả dữ liệu",
        "isCorrect": false
      },
      {
        "content": "Cấm tạo bảng mới",
        "isCorrect": false
      },
      {
        "content": "Không cho phép chỉ mục",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Bảng băm (hash table) có thời gian tra cứu trung bình?",
    "explanation": "Trung bình O(1) nếu hàm băm tốt và hệ số tải phù hợp.",
    "choices": [
      {
        "content": "Trung bình O(1)",
        "isCorrect": true
      },
      {
        "content": "O(n)",
        "isCorrect": false
      },
      {
        "content": "O(log n)",
        "isCorrect": false
      },
      {
        "content": "O(n log n)",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Cây nhị phân tìm kiếm (BST) có đặc tính?",
    "explanation": "Trái < Nút < Phải (theo khóa).",
    "choices": [
      {
        "content": "Khóa trái < nút < khóa phải",
        "isCorrect": true
      },
      {
        "content": "Tất cả khóa bằng nhau",
        "isCorrect": false
      },
      {
        "content": "Theo thứ tự ngẫu nhiên",
        "isCorrect": false
      },
      {
        "content": "Chỉ chứa số chẵn",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Trong logic Boolean, phép AND tương ứng với ký hiệu?",
    "explanation": "AND thường ký hiệu bằng ∧ hoặc *.",
    "choices": [
      {
        "content": "∧ (AND)",
        "isCorrect": true
      },
      {
        "content": "∨ (OR)",
        "isCorrect": false
      },
      {
        "content": "¬ (NOT)",
        "isCorrect": false
      },
      {
        "content": "⊕ (XOR)",
        "isCorrect": false
      }
    ]
  },
  {
    "text": "[TH12L] Trong CSDL, chỉ mục (index) giúp?",
    "explanation": "Tăng tốc truy vấn đọc bằng cách tạo cấu trúc tìm kiếm.",
    "choices": [
      {
        "content": "Tăng tốc truy vấn đọc",
        "isCorrect": true
      },
      {
        "content": "Tăng kích thước dữ liệu đáng kể",
        "isCorrect": false
      },
      {
        "content": "Tự động sao lưu",
        "isCorrect": false
      },
      {
        "content": "Nén dữ liệu",
        "isCorrect": false
      }
    ]
  }
];

  for (const q of questions) {{
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }}
}}
