# Inventory API: runtime contract và state

Level: Mid/Senior. Thời gian: 30 phút. Next.js 16, React 19, TypeScript.
Node.js >=20.9 và npm. API local, không cần credential hoặc dịch vụ ngoài.

```powershell
cd react-js/test-typescript-api-contract
npm install
npm run dev -- --port 3047
```

Mở http://127.0.0.1:3047; dùng port khác nếu đã được sử dụng.

## Tình huống và response

Inventory API có thể trả 200 với dữ liệu sai cấu trúc. Màn hình phải phân biệt
success, empty và error, không hiển thị dữ liệu cũ như dữ liệu thành công mới.
GET /api/inventory?scenario=... luôn chờ 200 ms trước response:

| Scenario | HTTP / payload |
| --- | --- |
| valid | 200, items [{ id: lamp, name: Desk lamp, quantity: 4 }] |
| empty | 200, items [] |
| invalid | 200, item như valid nhưng quantity là string 4 |
| error | 503, message Service unavailable |

Contract: envelope có items là array; mỗi item có id/name là string không rỗng
và quantity là integer không âm. Zod đã có trong dependency nếu cần.

## Tái hiện

1. Load Valid response và xem item/total.
2. Load Invalid quantity, so sánh kết quả với contract.
3. Load Valid response rồi HTTP error và kiểm tra data/loading/control.
4. Từ lỗi, chọn Valid response và thử lại.

## Acceptance criteria

- Idle không có rows. Loading không hiển thị rows/error cũ và khóa control.
- Valid hiển thị Desk lamp, quantity/total 4.
- Empty có state riêng, không bị coi là lỗi contract.
- Invalid có contract error, không hiển thị rows hoặc total từ payload sai.
- HTTP error bỏ data cũ, kết thúc loading và cho phép retry.
- Loading/error/data không cùng tồn tại; state model loại bỏ tổ hợp không hợp lệ.
- Runtime parser reject null, envelope sai, items không phải array, quantity
  string/âm/phân số và id/name sai kiểu hoặc rỗng.
- Không sửa API fixture, delay hoặc chỉ ép kiểu any/as để làm payload hợp lệ.
- Có label, status announcement, keyboard/focus và không tràn ở 320/1280 px.

## Bàn giao

Code parser/UI đã sửa, giải thích cách TypeScript khác runtime validation và
bằng chứng kiểm tra các response/edge case. Không yêu cầu thư viện state cụ thể.
