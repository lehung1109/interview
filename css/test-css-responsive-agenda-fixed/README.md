# Lời giải nội bộ: lịch responsive

Không giao folder này hoặc tests cho ứng viên. Mở index.html trực tiếp.
Giữ nguyên nội dung so với bản đề.

## Nguyên nhân và cách sửa

Minimum size mặc định của flex item giữ chuỗi dài không có dấu cách ở một dòng.
Bản sửa dùng min-width: 0 và overflow-wrap: anywhere để co và wrap nội dung.
Ở mobile, hàng xếp dọc; không cắt nội dung hoặc che tràn bằng overflow hidden.

Div có role=button không tự có keyboard behavior. Native button xử lý Tab,
Enter, Space; script cập nhật aria-pressed và nhãn. Focus indicator rõ ràng.
Width cố định có giới hạn responsive giúp Join/Joined không đổi kích thước.

## Kiểm chứng

Nhóm agenda trong tests/practical-exercises kiểm tra viewport 320/1280 px,
DOM geometry, chuỗi không dấu cách, native button, keyboard, visible focus
và tăng root font từ 16 lên 32 px. Test lưu ảnh vào test-results được git-ignore.

Ngoài kiểm tra tự động, xem trang bằng browser zoom và kiểm tra reflow.
Text resize test không chứng minh đạt toàn bộ WCAG hoặc thay screen reader test.

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Trang vẫn tràn hoặc nội dung bị ẩn để tránh tràn. |
| 1 | Sửa mobile thông thường nhưng bỏ sót chuỗi dài, keyboard hoặc resize. |
| 2 | Đạt toàn bộ acceptance criteria, giữ nội dung và control ổn định. |
| 3 | Đạt mức 2, có kiểm chứng geometry/keyboard và giải thích sizing/reflow. |

Không bắt buộc dùng đúng CSS của lời giải nếu hành vi và semantics tương đương.
