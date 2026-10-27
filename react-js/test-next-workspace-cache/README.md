# Dashboard tồn kho theo workspace

Level: Mid/Senior. Thời gian: 30 phút. Next.js 16, React 19, TypeScript.
Yêu cầu Node.js >= 20.9 và npm. Không cần tài khoản hoặc API key.

```powershell
cd react-js/test-next-workspace-cache
npm install
npm run dev -- --port 3045
```

Mở http://127.0.0.1:3045; dùng port khác nếu đã được sử dụng.

## Tình huống và fixture

Hai workspace công khai có tồn kho độc lập. Studio bắt đầu với Desk lamp/4;
Operations bắt đầu với Barcode scanner/7. Receive one tăng quantity workspace
hiện tại lên một sau 300 ms. Storage fixture reset khi restart process.

Trang dùng Next Data Cache thật. Build output/cache trên disk có thể còn sau
restart; dùng build directory mới khi cần reset hoàn toàn để tái hiện ban đầu.
Không coi việc restart mà giữ cache cũ là một phép kiểm tra dữ liệu fixture mới.

Marker DEMO_SERVER_TOKEN_ONLY_2026 là giá trị giả minh họa dữ liệu server-only,
không phải credential. Workspace query chỉ chọn fixture, không phải auth.

## Tái hiện

1. Mở Studio, rồi chuyển Operations và so sánh item/quantity.
2. Receive one, chờ hoàn tất và kiểm tra quantity mà không hard reload.
3. Chuyển workspace khác, quay lại rồi reload.
4. Kiểm tra response HTML/RSC hoặc DOM có marker server-only hay không.

## Acceptance criteria

- Workspace luôn có đúng item/quantity, kể cả khi workspace khác đã warm cache.
- Mutation hiển thị quantity mới ngay và không thay workspace khác.
- Reload/navigation vẫn thấy quantity đã cập nhật trong cùng process.
- Không serialize marker xuống HTML/RSC, client props hoặc DOM.
- Giữ server data access/mutation phía server, client chỉ sở hữu tương tác.
- Không thay toàn bộ kiến trúc bằng client fetch hoặc bỏ Data Cache để che lỗi.
- Có pending, native keyboard control, visible focus và không tràn ở 320/1280 px.
- Không đổi fixture, delay hoặc tắt Strict Mode để tránh lỗi.

## Bàn giao

Code đã sửa và bằng chứng kiểm tra warm cache, mutation, workspace isolation
và server/client boundary. Không yêu cầu triển khai auth hay database production.
