# Editor project với draft và danh sách động

Level: Mid/Senior. Thời gian: 30 phút. Next.js 16, React 19, TypeScript.
Yêu cầu Node.js >= 20.9 và npm; không cần API key hoặc dịch vụ bên ngoài.

## Chạy bài

Từ root repo:

```powershell
cd react-js/test-react-draft-board
npm install
npm run dev -- --port 3041
```

Mở http://127.0.0.1:3041. Dùng port khác nếu port này đang được sử dụng.

## Tình huống và dữ liệu

Nhân viên chỉnh title của ba project: Atlas onboarding, Boreal reporting
và Cypress migration. Draft chưa được lưu phải theo đúng project khi danh sách
đổi thứ tự hoặc có dữ liệu mới từ server.

Refresh server mô phỏng revision v1 -> v2 và title có hậu tố ` (v2)`; lần kế
tiếp là v3. ID không đổi. Reverse order chỉ đổi thứ tự, không reload trang.
Discard bỏ draft và lấy title server mới nhất của project đó.

Draft check chạy một lần sau 250 ms không nhập thêm khi draft đang dirty.
Số check không tự tăng khi người dùng ngừng nhập hoặc chỉ refresh/reverse.

## Tái hiện

1. Refresh server khi chưa chỉnh sửa; kiểm tra title ở label và input.
2. Chỉnh Atlas thành "Atlas local draft", reverse và kiểm tra cả ba project.
3. Ngừng nhập một lúc và theo dõi Draft checks.
4. Refresh khi Atlas còn dirty, sau đó Discard.

## Acceptance criteria

- Refresh cập nhật input pristine nhưng giữ nguyên draft đang dirty.
- Reverse không chuyển draft hoặc số check sang project khác.
- Discard luôn lấy title server mới nhất và bỏ dirty indicator.
- Một lần chỉnh sửa đã debounce chỉ thêm một check, không tiếp tục tăng khi idle.
- Nhập nhiều lần trong 250 ms chỉ check draft cuối cùng.
- Refresh/reverse không tự tạo thêm check cho một draft đã được kiểm tra.
- Input có label, control dùng được bằng keyboard và visible focus.
- Trang không tràn ngang ở viewport 320 px và 1280 px.
- Không đổi fixture, thời gian 250 ms hoặc tắt Strict Mode để tránh lỗi.

## Bàn giao

Code đã sửa, giải thích ngắn nguyên nhân và bằng chứng kiểm tra các case trên.
Không yêu cầu một thư viện quản lý state hoặc cách tổ chức component cụ thể.

