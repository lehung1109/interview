# Thiết kế bài thực hành React: editor và submit

## Mục tiêu và phạm vi

Tiếp tục chuyển Q06-Q09 thành bài thực hành chạy được cho Mid/Senior.
Người dùng đã chốt hai cặp bài Next.js 16 / React 19 và thực hiện trực tiếp
trong workspace. Không sửa code bài cũ hoặc ba cặp HTML đã hoàn thành.

| Bài | Folder đề | Mapping | Thời gian |
| --- | --- | --- | --- |
| Project draft board | react-js/test-react-draft-board | Q06-Q08 | 30 phút |
| Expense request | react-js/test-react-submit-retry | Q09 | 30 phút |

Mỗi folder có bản `-fixed` độc lập với cùng giao diện, dữ liệu và contract.
Đề có README riêng, không lộ lời giải. README fixed có rubric 0-3 và test case.
Không tạo branch hoặc commit. Các nhóm Q04, Q10-Q16 và E01-E03 chưa triển khai.

## Stack và cấu trúc

Theo các bài hiện tại: Next.js 16, React 19, TypeScript, App Router, ESLint.
CSS nằm trong app/globals.css; không cần thêm UI library hoặc external assets
để giải bài. Không dùng React.FC. JSX có khoảng trắng giữa các sibling dễ đọc.

Mỗi project độc lập, có package.json, tsconfig, Next config, app/layout.tsx,
app/page.tsx và component sở hữu hành vi. Các dependency cần được cài local.
Không cần dịch vụ ngoài, API key hoặc thông tin người dùng thật.

## Bài 1: project draft board

Ba fixture projects có ID ổn định:

| ID | Title ban đầu |
| --- | --- |
| atlas | Atlas onboarding |
| boreal | Boreal reporting |
| cypress | Cypress migration |

Mỗi hàng có title editor, dirty indicator, số lần draft check và nút Discard.
Toolbar có Reverse order và Refresh server. Refresh tăng revision từ v1 lên v2
và đặt title server thành title fixture có hậu tố ` (v2)`; lần tiếp theo là v3.
Không thay đổi ID. Reverse chỉ đổi thứ tự; không reload hoặc làm mất state.

Draft check thực hiện một lần sau 250 ms không nhập thêm khi draft đang dirty.
Counter không tăng tiếp khi idle hoặc chỉ reverse/refresh. Tăng counter không
được tự khởi động một lần check mới. Strict Mode vẫn bật.

Acceptance criteria:

- Refresh cập nhật editor pristine theo title mới từ server.
- Refresh cùng ID không ghi đè draft đang dirty.
- Discard đưa editor về title server mới nhất và trạng thái pristine.
- Reverse giữ draft và counter đúng project ID, không gắn chúng theo vị trí.
- Draft check chạy đúng một lần cho lần chỉnh sửa đã debounce, không chạy lặp.
- Nhập liên tục trong 250 ms chỉ kiểm tra draft cuối cùng.
- Button và input dùng được bằng keyboard, có label và visible focus.
- Mobile không tràn ngang; giữ nguyên dữ liệu và Strict Mode khi sửa.

Bản đề chứa ba lỗi có thể quan sát: initial state không nhận refresh của props,
key theo index và dependency object không ổn định làm check tiếp tục sau idle.
Vòng lặp check dùng timer 250 ms có cleanup, không tạo vòng render đồng bộ
đóng băng browser. Các lỗi này chỉ ở starter, không ở bản fixed.

## Bài 2: expense request

Form có Request title, Amount USD và Scenario (Success / Fail first attempt).
POST /api/requests là fixture API local, delay 600 ms cho mỗi attempt thực.
Không thực hiện thanh toán hoặc gọi một dịch vụ ngoài.

Contract của request:

- Title trim có 3-80 ký tự; amount là số hữu hạn, lớn hơn 0 và không quá 10000.
- Scenario là success hoặc fail-once; server và client đều validate.
- Header Idempotency-Key là định danh công khai của một ý định submit,
  không phải credential. Retry cùng payload dùng cùng key.
- Payload mới hoặc scenario mới cần key mới; input bị khóa trong pending.
- Hai request đồng thời có cùng key/payload chia sẻ một attempt đang chạy.
- Thành công tạo đúng một record và trả ID ổn định khi replay cùng key.
- Cùng key nhưng payload khác trả 409 và không tạo record.
- fail-once trả 503 trước khi tạo record ở attempt đầu; retry trả success.
- Validation sai trả 400, không chạy delay tạo record.

Response success có request ID và dữ liệu đã validate. Fixture API giữ dữ liệu
in-memory trong process dev server; reset khi restart. Không coi API này là
hướng dẫn authentication hoặc lưu trữ production.

Acceptance criteria:

- Click và Enter dùng cùng validation/submit path, không reload document.
- Dữ liệu không hợp lệ hiển thị lỗi có liên kết với field và không gọi API.
- Có pending/error/success; pending chặn submit trùng và khóa input/scenario.
- Lỗi không xóa form; retry giữ dữ liệu và key, không tạo record trùng.
- Response success hiển thị request ID; keyboard và status announcement dùng được.
- API local từ chối payload không hợp lệ kể cả khi bypass UI.
- API deduplicate cả request đang chạy và replay sau thành công.
- Cùng key khác payload bị từ chối, không ghi đè record trước.

Bản đề validate trong click handler thay vì form submit; bỏ pending guard,
làm mất dữ liệu khi lỗi và không deduplicate API. API vẫn validate payload
để bài không phụ thuộc vào việc framework chấp nhận dữ liệu sai.

## Kiểm thử và bàn giao

Thêm React browser suite trong tests/practical-exercises, dùng cùng Playwright
đã có và lựa chọn Edge đã được kiểm chứng trên máy. Không thay đổi test HTML.
Test khởi chạy hai dev servers riêng cho variant đang kiểm tra; chỉ dừng
process do test tự tạo. Port không dùng các server người dùng đang chạy.

Cùng bộ test chạy cho broken/fixed. Quan sát failure của starter trước khi
viết lời giải. Fixed phải pass browser suite, typecheck và lint. Lint warnings
do lỗi cố ý ở starter phải được phân biệt với lỗi của bản fixed.

Editor tests dùng clock dừng trước input để kiểm tra 250 ms, idle và identity.
Form tests dùng API local thật, quan sát request/payload và UI, không chỉ mock.
Backend tests kiểm tra hai POST đồng thời, replay, payload conflict và validation.
Không dùng snapshot source làm bằng chứng hành vi.

Chụp và xem screenshot mobile/desktop; kiểm tra scroll width và focus/keyboard.
Cập nhật common.md và README, đánh dấu hai bài mới chạy được, giữ nhóm còn lại
ở trạng thái chưa triển khai. Khởi chạy fixed dev servers và cung cấp URL local.
