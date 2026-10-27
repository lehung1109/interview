# Lời giải nội bộ: runtime API contract

Không giao folder này cho ứng viên. Node.js >=20.9 và npm.

```powershell
cd react-js/test-typescript-api-contract-fixed
npm install
npm run dev -- --port 3048
```

Mở http://127.0.0.1:3048; dùng port khác nếu đã được sử dụng.

## Nguyên nhân và cách sửa

Type assertion không kiểm tra response runtime. Bản sửa giữ payload unknown
cho tới khi Zod safeParse thành công; type được suy ra từ schema thay vì khai
báo interface không có liên kết với validator.

UI dùng discriminated union idle/loading/empty/error/success. Chỉ success có
data, chỉ error có message. Chuyển sang loading/error tạo state mới không chứa
data cũ; không cần đồng bộ nhiều flags bằng các setState độc lập.

HTTP success không đồng nghĩa payload hợp lệ. HTTP error và contract error đều
kết thúc loading; retry valid phục hồi success. Empty là kết quả hợp lệ riêng.

## Kiểm chứng

Browser tests gọi API local thật. Loading test giữ request trước khi gửi rồi
cho request tiếp tục, không mock response hoặc phụ thuộc tốc độ máy.
Parser tests import TypeScript qua tsx, dùng payload literal độc lập với schema.

```powershell
npm run lint
npm run typecheck
```

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Payload sai vẫn được render hoặc error còn giữ data/loading cũ. |
| 1 | Chỉ sửa happy path, bỏ edge case/parser hoặc retry. |
| 2 | Đạt runtime contract và state workflow, không dùng ép kiểu thay validation. |
| 3 | Đạt mức 2, có parser/state tests và giải thích schema/state trade-off. |

Không yêu cầu code giống lời giải. Tooling ESLint/glob có advisory đã biết;
runtime audit cần được đánh giá riêng.
