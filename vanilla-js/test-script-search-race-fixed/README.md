# Lời giải nội bộ: search debounce và request race

Không giao folder này hoặc tests cho ứng viên. Mở index.html trực tiếp.
Fixtures và contract giống bản đề, không cần mạng.

## Nguyên nhân và cách sửa

Một timer chung khiến input Rooms hủy lịch gọi API của People. Mỗi lần gọi
bindSearch tạo closure riêng chứa timer và requestId cho ô đó.

Debounce chỉ giảm request, không bảo đảm thứ tự response. Tăng requestId ngay
khi input đổi và kiểm tra identity trước cả success lẫn error. Khi query rỗng,
identity vẫn đổi để response đang chạy không khôi phục kết quả cũ.

API local không hỗ trợ cancel. Bỏ response cũ là đủ cho contract của bài;
trong hệ thống khác có thể kết hợp AbortController nếu API hỗ trợ.

## Kiểm chứng

Nhóm search trong tests/practical-exercises sử dụng browser clock được dừng
trước thao tác. Kiểm tra 299/300 ms, hai ô độc lập, success/error về sai thứ tự,
clear query đang chạy và match không phân biệt hoa/thường sau trim.

Chạy bằng thao tác tay đúng query trong README bản đề. Chờ request trong log
rồi mới đổi query để phân biệt race với debounce.

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Search còn hỏng hoặc thay delay/dữ liệu để tránh tái hiện. |
| 1 | Sửa timer nhưng bỏ sót stale success, stale error hoặc clear query. |
| 2 | Đạt toàn bộ contract, xử lý riêng timer và identity cho mỗi ô. |
| 3 | Đạt mức 2, có test timing/race ổn định và giải thích cancellation trade-off. |

Không yêu cầu code hoặc tên biến giống lời giải; đánh giá hành vi và bằng chứng.
