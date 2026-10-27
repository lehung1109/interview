# Thiết kế bài thực hành Next.js và API contract

## Phạm vi đã chốt

Tiếp tục Q10-Q12 bằng hai cặp bài độc lập, mỗi bài 30 phút:

| Bài | Folder đề | Mapping |
| --- | --- | --- |
| Inventory workspace dashboard | react-js/test-next-workspace-cache | Q10-Q11 |
| Inventory API loader | react-js/test-typescript-api-contract | Q12 |

Mỗi bài có bản `-fixed`, cùng UI/fixture/contract. Next.js 16, React 19,
TypeScript, CSS theo các bài hiện tại. Loader dùng Zod để validate runtime.
API và dữ liệu local; không có tài khoản, dịch vụ ngoài hay credential thật.
Giữ nguyên bài cũ và server đang chạy. Không tạo branch/commit.

## Dashboard: workspace và cache

Trang Server Component nhận workspace từ searchParams (Promise của Next 16).
Workspace selector là navigation link; control nhập liệu/mutation là Client
Component nhỏ, gửi form tới Server Action. Hai workspace fixture công khai:

| Workspace | Item | Quantity ban đầu |
| --- | --- | --- |
| studio | Desk lamp | 4 |
| operations | Barcode scanner | 7 |

Nút Receive one tăng quantity của workspace hiện tại lên một. Storage là fixture
in-memory theo process, reset khi restart. Không có auth/multi-instance database.
Query workspace chỉ chọn fixture, không mô phỏng authorization của người dùng.

Read sử dụng Next Data Cache thật qua unstable_cache với Cache Components tắt.
API này vẫn hỗ trợ trong Next 16; không yêu cầu bật use cache hay làm PPR.
Cache phải được phân biệt theo workspace, tag invalidation không thay cache key.
Mutation cần read-your-own-writes bằng cơ chế Next phù hợp trong Server Action.

Server helper có marker giả DEMO_SERVER_TOKEN_ONLY_2026; đây không phải secret
hoặc API key thật. Marker minh họa giá trị chỉ dùng phía server, không được
serialize vào HTML/RSC/client props hoặc DOM ở bản fixed.

Acceptance criteria:

- Studio và Operations luôn hiển thị đúng item/quantity, kể cả sau khi warm cache.
- Receive one hiển thị quantity mới ngay sau hoàn tất, không cần hard reload.
- Mutation của Studio không thay data của Operations hoặc ngược lại.
- Reload/navigation vẫn thấy giá trị mới của workspace đã mutate.
- Private server marker không xuất hiện trong response HTML/RSC hoặc DOM.
- Chỉ tương tác cần browser được đưa vào Client Component; server helper không
  được import vào client graph. Không chuyển toàn bộ logic thành client fetch.
- Có pending, native form/button, keyboard và layout mobile không tràn ngang.

Starter có ba lỗi: closure workspace không có trong cache key, mutation chỉ
refresh route nhưng không expire đúng Data Cache, và marker bị truyền xuống
client prop. Starter phải chạy được, không phá compile để tạo câu đố framework.

## Loader: response không đáng tin cậy

GET /api/inventory?scenario=... là API local, delay 200 ms. Các scenario:

| Scenario | Response |
| --- | --- |
| valid | 200, items [{ id: lamp, name: Desk lamp, quantity: 4 }] |
| empty | 200, items [] |
| invalid | 200, item giống valid nhưng quantity là string 4 |
| error | 503, message Service unavailable |

Schema yêu cầu envelope items là array; id/name là string không rỗng và quantity
là integer không âm. Có các fixture trực tiếp để test wrong envelope, null,
quantity âm/phân số và id/name sai kiểu ngoài browser workflow.

User chọn scenario rồi Load inventory. Select/button bị khóa trong loading để
không mở thêm bài request race vốn đã có ở P02. Sản phẩm bàn giao gồm parser
runtime và UI state model, không chỉ type assertion hoặc generic useFetch.

Acceptance criteria:

- Initial idle không có rows; loading không render data hoặc error cũ.
- Valid hiển thị Desk lamp, quantity 4 và total 4.
- Empty có trạng thái empty riêng, không bị báo lỗi contract.
- Invalid hiển thị contract error, không render rows/total từ payload sai.
- HTTP error hiển thị error và bỏ data cũ; loading kết thúc sau mọi kết quả.
- Retry từ error sang valid hoạt động, không đồng thời hiển thị loading/error/data.
- TypeScript state union biểu diễn các trạng thái hợp lệ; dữ liệu chỉ được coi
  là typed sau validation runtime. Không chữa lỗi bằng ép kiểu any/as.
- Parser từ chối wrong envelope, null, âm/phân số và id/name không hợp lệ.
- Có label, status announcement, keyboard và layout mobile không tràn ngang.

Starter ép response thành type mà không validate và giữ flags/data độc lập,
bỏ cleanup loading khi lỗi. Payload invalid được chọn để vẫn hiển thị được,
không cố ý làm browser crash. Fixed dùng Zod và discriminated union.

## Test và bàn giao

Thêm suite riêng trong tests/practical-exercises, không sửa assertion cũ.
Suite dùng cùng Playwright/Edge, spawn server theo variant trên port trống.
Mỗi server Next mới dùng NEXT_EXERCISE_DISTDIR trỏ build directory riêng cho
test run để Data Cache cũ không gây contamination. Cleanup chỉ process/output
do test tạo, không đụng dev server của người dùng.

Cùng assertions chạy trên starter/fixed. Observe failures của starter trước
fixed implementation. Cache tests dùng UI/navigation và Server Action thật,
kiểm tra response private marker; loader tests dùng API thật và parser tests
trực tiếp. Fixed phải pass lint/typecheck và browser/parser suites.

Chụp và xem mobile/desktop screenshots. Cập nhật common.md/README: hai bài mới
chạy được, giữ các nhóm khác chưa triển khai. Candidate README không chứa đáp án;
fixed README giải thích cache/API semantics và rubric 0-3. Mở fixed dev server
trên port trống, bàn giao URL local. Advisory tooling/IDE đã biết phải báo rõ.
