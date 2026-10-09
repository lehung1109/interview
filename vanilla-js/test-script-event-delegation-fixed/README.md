# Lời giải nội bộ: danh sách công việc động

Không giao folder này hoặc bộ test cho ứng viên. Mở index.html trực tiếp.
Đề ứng viên nằm trong folder test-script-event-delegation kế bên.

## Nguyên nhân và cách sửa

Listener gắn lên nút ban đầu không xử lý nút được thêm sau. Kiểm tra trực tiếp
event.target bỏ qua span bên trong button. preventDefault ở vùng quá rộng
hủy hành vi điều hướng của link.

Bản sửa đăng ký một listener trên list và tìm action qua closest. Chỉ form
submit cần preventDefault; nút xóa có type=button. Text được tạo bằng
textContent. Sau xóa, focus chuyển sang nút tiếp theo hoặc input.

## Kiểm chứng

Chạy nhóm delegation theo README của tests/practical-exercises. Cùng test
phải phát hiện lỗi ở bản ứng viên và pass ở bản fixed.

Kiểm tra thêm/xóa hàng mới, click span, Enter, tên rỗng, chuỗi giống HTML
và fragment #stats. Không chỉ thử click một nút ban đầu.

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Không sửa được thao tác xóa hoặc gây reload/mất dữ liệu. |
| 1 | Sửa được một trường hợp nhưng bỏ sót hàng mới hoặc click phần tử con. |
| 2 | Đạt toàn bộ acceptance criteria bằng delegation đúng phạm vi. |
| 3 | Đạt mức 2, kiểm chứng keyboard/default action và giải thích focus handling. |

Không bắt buộc tên hàm, cấu trúc code hoặc style giống lời giải này.
