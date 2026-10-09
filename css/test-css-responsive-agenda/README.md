# Lịch làm việc responsive

Level: Mid. Thời gian: 20 phút. Stack: HTML/CSS và một script tương tác nhỏ.
Mở index.html bằng browser; không cần cài dependency hoặc chạy server.

## Tình huống

Nhân viên xem lịch và xác nhận tham gia cuộc họp bằng desktop hoặc điện thoại.
Tên cuộc họp dài làm trang tràn ngang, còn thao tác bằng keyboard chưa ổn.

## Tái hiện

1. Mở trang ở viewport rộng 320 px, kiểm tra các tên cuộc họp dài.
2. Dùng Tab, Enter và Space để xác nhận tham gia.
3. Phóng to hoặc tăng cỡ chữ và kiểm tra nội dung có bị mất không.
4. Xác nhận/hủy xác nhận một cuộc họp và quan sát bố cục.

## Acceptance criteria

- Trang không tràn ngang ở viewport 320 px và 1280 px.
- Giữ nguyên dữ liệu, hiển thị đầy đủ tên dài và chuỗi không có khoảng trắng.
- Không cắt/ẩn nội dung để giải quyết tràn ngang.
- Nút tham gia là native button, có accessible name và visible focus.
- Tab tới được nút; Enter và Space thay đổi `aria-pressed`.
- Thay đổi trạng thái không làm kích thước nút hoặc hàng nhảy.
- Khi tăng font mặc định từ 16 px lên 32 px, nội dung vẫn reflow ở 320 px.
- Không thêm thư viện hoặc dùng kích thước trang cố định để tránh bài toán.

## Bàn giao

Code đã sửa và ảnh chụp mobile/desktop. Giải thích nguyên nhân tràn ngang,
cách keyboard hoạt động và cách đã kiểm tra text resize.
Không đánh giá gu màu sắc hoặc yêu cầu thiết kế lại toàn bộ giao diện.
