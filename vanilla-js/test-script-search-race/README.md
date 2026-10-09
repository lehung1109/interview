# Tìm kiếm nhân viên và phòng họp

Level: Mid; phần test dành cho Senior. Thời gian: 30 phút.
Mở index.html trực tiếp bằng browser. Không gọi mạng hoặc cần API key.

## Tình huống

Hai bộ phận dùng cùng màn hình để tìm nhân viên và phòng họp. Khi nhập nhanh,
đôi lúc không có request cho một ô hoặc kết quả không khớp nội dung hiện tại.

## Dữ liệu và contract

- Hai danh sách độc lập: People và Rooms.
- Match substring sau khi trim query, không phân biệt hoa/thường.
- Chờ 300 ms không nhập thêm trước khi gọi API; trailing-edge debounce.
- API local trả Promise. Query `a` và `error` mất 900 ms; query khác 120 ms.
- Query `error` trả lỗi. Query `zzz` không có kết quả.
- People gồm Anna Nguyen, Andrew Tran và Mark Lee.
- Rooms gồm Cedar room, River room và Studio.
- Request log trên màn hình ghi lại request thật của API local.

## Tái hiện

1. Nhập `an` trong People, rồi nhập `room` trong Rooms trước 300 ms.
2. Nhập `a`, chờ request xuất hiện trong log, rồi đổi thành `an`.
3. Nhập `a`, chờ request bắt đầu, rồi xóa query trước khi response về.
4. Nhập `error`, chờ request bắt đầu, rồi đổi thành `an`.

## Acceptance criteria

- Mỗi ô tìm kiếm có debounce độc lập, không hủy timer của ô kia.
- Chỉ query hiện tại được cập nhật kết quả và trạng thái.
- Query rỗng xóa kết quả ngay, không gọi API và không nhận lại response cũ.
- Mỗi ô có loading, empty, error và success riêng.
- Cả success lẫn error của request cũ đều không ghi đè trạng thái mới.
- Query ` AN ` trả Anna Nguyen và Andrew Tran, không trả Mark Lee.
- Không thay đổi dữ liệu, delay của API hoặc contract để che lỗi.

## Bàn giao

Code đã sửa và cách kiểm chứng. Senior bổ sung test cho debounce, hai ô độc lập,
response đảo thứ tự, clear query và error cũ. Không bắt buộc một thư viện hoặc
API cancellation cụ thể.
