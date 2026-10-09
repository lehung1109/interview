# Yêu cầu chi phí: submit và retry

Level: Mid/Senior. Thời gian: 30 phút. Next.js 16, React 19, TypeScript.
Yêu cầu Node.js >= 20.9 và npm. Không có thanh toán thật hoặc dịch vụ ngoài.

## Chạy bài

Từ root repo:

```powershell
cd react-js/test-react-submit-retry
npm install
npm run dev -- --port 3043
```

Mở http://127.0.0.1:3043; dùng port khác nếu đang được sử dụng.

## Tình huống

Nhân viên gửi yêu cầu chi phí. Khi dịch vụ tạm lỗi, họ cần retry mà không mất
dữ liệu hoặc tạo yêu cầu trùng. Ngoài thao tác click, form có thể được gửi bằng
Enter hoặc một luồng tự động dùng requestSubmit.

## Contract

- Request title sau trim dài 3-80 ký tự.
- Amount USD là số hữu hạn, lớn hơn 0 và không quá 10000.
- Scenario: Success hoặc Fail first attempt.
- API local POST /api/requests chờ 600 ms cho mỗi attempt thực.
- API nhận JSON title, amount, scenario và header Idempotency-Key.
- Key là định danh công khai của ý định submit, không phải credential.
- Retry cùng payload dùng cùng key; sửa dữ liệu/scenario cần key mới.
- Fail first attempt trả 503 trước khi tạo record; retry cùng key thành công.
- Hai request đồng thời hoặc replay cùng key/payload phải trả cùng receipt ID.
- Cùng key nhưng payload khác trả 409, không ghi đè record.
- Payload/key không hợp lệ trả 400, kể cả khi bypass client validation.
- Dữ liệu fixture nằm trong process dev server, reset khi restart/hot reload.

## Tái hiện

1. Gửi form rỗng bằng click, rồi thử luồng submit trực tiếp trong DevTools:

```javascript
document.querySelector("#expense-form").requestSubmit();
```

2. Điền Team training, 100.25, chọn Fail first attempt và submit.
3. Kiểm tra dữ liệu sau lỗi, retry và quan sát receipt.
4. Gửi nhanh hai lần; kiểm tra request/receipt trong Network panel.

## Acceptance criteria

- Click, Enter và requestSubmit có cùng validation, không reload document.
- Dữ liệu không hợp lệ có field error liên kết với input và không gọi API.
- Pending khóa field/scenario/submit và chặn submit trùng ngay lập tức.
- Lỗi không xóa dữ liệu; retry giữ key/payload, success hiển thị receipt ID.
- Sửa dữ liệu/scenario không replay receipt của payload cũ.
- API validate dữ liệu và thực hiện đúng contract đồng thời/replay/conflict.
- Label, visible focus, keyboard và status announcement hoạt động.
- Trang không tràn ngang ở viewport 320 px và 1280 px.
- Không đổi delay, fixture hoặc bỏ case lỗi để làm bài pass.

## Bàn giao

Code đã sửa và cách kiểm chứng UI/API. Senior có thể bổ sung test concurrency,
retry và validation bypass. Không yêu cầu thư viện form hoặc state cụ thể.
