# Lời giải nội bộ: submit và retry an toàn

Không giao folder này cho ứng viên. Node.js >= 20.9 và npm.

```powershell
cd react-js/test-react-submit-retry-fixed
npm install
npm run dev -- --port 3044
```

Mở http://127.0.0.1:3044; dùng port khác nếu đang được sử dụng.

## Nguyên nhân và cách sửa

Validation nằm ở onClick không bảo vệ form submit trực tiếp. Bản sửa validate
trong onSubmit và dùng cùng parser với API. Ref inFlight khóa ngay, không chờ
React commit disabled state, nên hai submit đồng bộ chỉ tạo một request.

Error giữ dữ liệu và key để retry đúng ý định. Thay đổi input/scenario bỏ key
và receipt cũ; các control bị khóa trong pending.

API lưu entry theo key và payload đã normalize. Đăng ký pending Promise trước
await để hai request đồng thời chia sẻ cùng attempt. Receipt success được lưu
để replay; lỗi tạm thời không tạo receipt, retry được chạy attempt tiếp theo.
Payload khác dưới cùng key bị từ chối với 409.

## Giới hạn fixture

Entry/receipt chỉ nằm trong memory của một process, reset khi restart/hot reload.
Không có auth, database, TTL hoặc multi-instance coordination. Đây không phải
API production hay giải pháp thanh toán. Production cần storage/transaction và
authorization phù hợp, ngoài phạm vi bài này.

## Kiểm chứng

Suite nội bộ dùng API thật local: UI click/Enter/requestSubmit, duplicate submit,
pending, retry key/payload, validation bypass, concurrent POST và replay/conflict.
Test dùng key riêng cho mỗi case để không phụ thuộc dữ liệu của case trước.

```powershell
npm run lint
npm run typecheck
```

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Không sửa được submit hoặc còn mất dữ liệu/tạo trùng. |
| 1 | Sửa UI cơ bản nhưng bỏ pending guard, retry hoặc server deduplication. |
| 2 | Đạt contract UI và API, không chỉ disable button để chống trùng. |
| 3 | Đạt mức 2, có test concurrency/replay và giải thích giới hạn memory fixture. |

Không bắt buộc code giống lời giải. Tooling ESLint/glob hiện có npm advisory;
audit runtime không có advisory ở lần kiểm tra này. Không dùng audit fix --force
để thay major stack khi làm bài.
