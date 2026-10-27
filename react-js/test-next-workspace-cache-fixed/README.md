# Lời giải nội bộ: cache/mutation theo workspace

Không giao folder này cho ứng viên. Next.js 16, React 19, Node.js >=20.9.

```powershell
cd react-js/test-next-workspace-cache-fixed
npm install
npm run dev -- --port 3046
```

Mở http://127.0.0.1:3046; dùng port khác nếu đã được sử dụng.

## Nguyên nhân và lời giải

Closure workspace không tự thành cache key. Tags phục vụ invalidation, không
phân biệt entry. Bản sửa thêm workspace vào key và dùng tag riêng cho mỗi scope.

Redirect/route refresh không tự expire mọi Data Cache. Server Action gọi
updateTag đúng tag sau mutation để request kế tiếp đọc dữ liệu mới ngay.
Không dùng stale-while-revalidate cho contract yêu cầu read-your-own-writes.

Marker chỉ được đọc trong module server-only. Server page truyền dữ liệu công
khai xuống Client controls; không serialize marker qua prop hoặc hidden DOM.
Client chỉ dùng form status để hiển thị pending và gọi Server Action.

unstable_cache vẫn hỗ trợ với Cache Components tắt trong Next 16. Bài không
bắt buộc migrate use cache/PPR, vì mục tiêu là semantics của key/invalidation.

## Kiểm chứng và giới hạn

Browser suite dùng workspace navigation và action thật, warm cache trước khi
đổi scope, mutation/reload và kiểm tra HTML/DOM không có marker. Build directory
test tách khỏi preview để cache từ run trước không ảnh hưởng fixture.

Storage trong memory theo process; cache trên disk có thể còn sau restart.
Muốn reset hoàn toàn cần process và build directory mới. Workspace query không
phải authorization; marker là giả, không có secret/API key thật.

```powershell
npm run lint
npm run typecheck
```

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Cache còn lẫn workspace hoặc serialize giá trị server-only. |
| 1 | Sửa một phần nhưng mutation/reload chưa thấy dữ liệu đúng. |
| 2 | Đạt contract isolation/freshness/boundary, giữ Next Data Cache. |
| 3 | Đạt mức 2, có test warm-cache/action và giải thích key/tag/route cache. |

Tooling ESLint/glob có advisory đã biết; runtime audit cần được đánh giá riêng.
