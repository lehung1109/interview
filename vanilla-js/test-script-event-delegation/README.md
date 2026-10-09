# Danh sách công việc động

Level: Mid. Thời gian: 20 phút. Stack: HTML và JavaScript thuần.

## Chạy bài

Mở index.html bằng browser. Không cần cài dependency hoặc chạy server.
Đây là bài độc lập, không yêu cầu kết nối mạng.

## Tình huống

Nhân viên thêm công việc vào danh sách và xóa các công việc đã hoàn tất.
Một số thao tác xóa không hoạt động; link đến mục thống kê cũng có vấn đề.

## Tái hiện

1. Thử xóa một công việc có sẵn bằng phần chữ bên trong nút.
2. Thêm công việc "Review invoice", rồi thử xóa nó.
3. Dùng link "View statistics" để đi đến mục thống kê.
4. Thêm công việc bằng Enter, sau đó dùng keyboard để xóa.

## Yêu cầu

- Thêm công việc bằng click hoặc Enter, không reload trang.
- Chuỗi rỗng hoặc chỉ có khoảng trắng không tạo một hàng mới.
- Xóa được cả công việc có sẵn lẫn công việc vừa thêm.
- Click phần tử con bên trong nút xóa có cùng kết quả như click nút.
- Không đăng ký listener riêng cho mỗi hàng khi thêm mới.
- Link "View statistics" vẫn thay đổi fragment thành `#stats`.
- Xóa công việc không làm submit form; thao tác được bằng keyboard.
- Nội dung nhập hiển thị như text, không trở thành HTML.

## Bàn giao

Code đã sửa và mô tả ngắn nguyên nhân. Minh họa kiểm tra các yêu cầu trên,
bao gồm một công việc mới và một chuỗi trông giống HTML.
