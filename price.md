# Bảng giá dự kiến cho Phần mềm Quizzz

Chào bạn,

Việc định giá một sản phẩm có nhiều tính năng phức tạp như thế này đúng là không dễ. Dựa trên phân tích các tính năng đã có trong codebase của `api` và `frontend`, tôi đề xuất một mô hình giá theo các gói khác nhau. Mô hình này giúp bạn dễ dàng tiếp cận nhiều đối tượng khách hàng, từ các giáo viên dạy thêm nhỏ lẻ đến các trung tâm giáo dục lớn hơn.

Mô hình gồm 3 gói: **Cơ bản** (cho giáo viên độc lập), **Tiêu chuẩn** (cho trung tâm nhỏ), và **Doanh nghiệp** (cho trung tâm lớn hoặc yêu cầu cài đặt riêng).

## Bảng so sánh tính năng các gói

| Tính năng                               | Gói Cơ bản                         | Gói Tiêu chuẩn                      | Gói Doanh nghiệp                     | Ghi chú (tính năng cần phát triển thêm nếu có)                                   |
| ------------------------------------- | ----------------------------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| **QUẢN LÝ NGƯỜI DÙNG**                 |                                     |                                     |                                      |                                                                                 |
| Số lượng giáo viên                    | 1                                   | Lên đến 10                         | Không giới hạn                      |                                                                                 |
| Số lượng học sinh                     | 50                                  | Lên đến 500                        | Không giới hạn                      |                                                                                 |
| Phân quyền (Admin, Teacher, Student)  | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| **NGÂN HÀNG CÂU HỎI**                  |                                     |                                     |                                      |                                                                                 |
| Tạo câu hỏi (Trắc nghiệm)             | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Soạn thảo câu hỏi đa dạng (Rich Text & Hình ảnh)    | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Quản lý câu hỏi theo môn học          | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Import câu hỏi hàng loạt (từ file Excel/Word) | ❌                                  | ✅                                  | ✅                                   | Cần phát triển thêm tính năng import.                                            |
| **QUẢN LÝ ĐỀ THI & PHÒNG THI**         |                                     |                                     |                                      |                                                                                 |
| Tạo đề thi từ ngân hàng câu hỏi       | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Tạo phòng thi (có mật khẩu)           | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Giới hạn thời gian làm bài             | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Tự động đảo câu hỏi & đáp án          | ❌                                  | ✅                                  | ✅                                   | Chống gian lận. Code đã có file `shuffle.ts`, có thể tận dụng.                    |
| **TỔ CHỨC THI & CHẤM ĐIỂM**               |                                     |                                     |                                      |                                                                                 |
| Học sinh làm bài trực tuyến           | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Tự động chấm điểm và trả kết quả ngay | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Học sinh xem lại chi tiết bài làm     | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| In bài làm và đáp án chi tiết         | ❌                                  | ✅                                  | ✅                                   | Code đã có file `printAttempt.ts`, có thể hoàn thiện.                           |
| **BÁO CÁO & THỐNG KÊ**                 |                                     |                                     |                                      |                                                                                 |
| Thống kê kết quả cho học sinh          | ✅                                  | ✅                                  | ✅                                   |                                                                                 |
| Thống kê chi tiết cho giáo viên       | Theo từng bài thi                    | Theo lớp & phổ điểm                 | Phân tích hiệu suất, so sánh các lớp |                                                                                 |
| **TÍNH NĂNG CAO CẤP**                  |                                     |                                     |                                      |                                                                                 |
| **Cài đặt trên máy chủ riêng (On-premise)** | ❌                                  | ❌                                  | ✅                                   | Giá trị cao nhất. Dùng tính năng `Licensing` đã có trong code để cấp phép.         |
| Tùy chỉnh thương hiệu (logo, tên miền riêng) | ❌                                  | ❌                                  | ✅                                   |                                                                                 |
| Hỗ trợ kỹ thuật                       | Hỗ trợ qua Email                     | Hỗ trợ qua Email & Chat            | Hỗ trợ ưu tiên 24/7                  |                                                                                 |

## Gợi ý về giá

Đây là phần khó nhất, giá cả phụ thuộc nhiều vào thị trường. Dưới đây là gợi ý để bạn tham khảo và điều chỉnh:

-   **Gói Cơ bản:** Có thể **Miễn phí** hoặc một mức giá rất thấp (ví dụ: **99.000 VNĐ/tháng**) để thu hút người dùng mới, cho họ trải nghiệm sản phẩm.
-   **Gói Tiêu chuẩn:** Đây là gói chính để tạo doanh thu.
    -   **Cách tính giá:** Theo số lượng giáo viên.
    -   **Mức giá đề xuất:** **250.000 - 499.000 VNĐ / giáo viên / tháng**. Một trung tâm có 5 giáo viên sẽ trả khoảng 1.250.000 - 2.500.000 VNĐ/tháng.
-   **Gói Doanh nghiệp:** Dành cho khách hàng lớn, cần cài đặt riêng.
    -   **Cách tính giá:** Hợp đồng theo năm.
    -   **Mức giá đề xuất:**
        -   **Phí cài đặt ban đầu:** 10.000.000 - 20.000.000 VNĐ (tùy độ phức tạp).
        -   **Phí bản quyền & bảo trì hàng năm:** 50.000.000 - 200.000.000 VNĐ/năm, tùy vào số lượng người dùng và yêu cầu hỗ trợ.

**Lưu ý:** Bảng giá này chỉ là gợi ý ban đầu. Bạn nên nói chuyện với một vài khách hàng tiềm năng (trung tâm giáo dục) để hiểu rõ hơn nhu cầu và ngân sách của họ, từ đó điều chỉnh lại cho phù hợp.

Chúc bạn thành công!
