# Thiết kế bài thực hành frontend: nhóm đầu

## Mục tiêu

Chuyển ngân hàng câu hỏi thành bài chạy được cho phỏng vấn Mid/Senior.
Ứng viên nhận code có lỗi và đề rõ ràng; interviewer có lời giải riêng.
Không sửa các lỗi có chủ đích trong bài cũ và không chia sẻ lời giải ra ngoài.

Người dùng đã chọn bài chạy được kèm lời giải và duyệt nhóm đầu gồm
event delegation, debounce/search và responsive layout.

## Phạm vi đã chốt

Triển khai ba cặp bài HTML/CSS/JavaScript độc lập, không cần build hoặc
cài dependency để sử dụng. Mỗi bài có bản `test-*` và bản `test-*-fixed`.
Các bản chỉ khác nhau tại phần xử lý lỗi hoặc layout cần đánh giá.

| Bài | Bản ứng viên | Kiến thức |
| --- | --- | --- |
| Danh sách công việc động | `vanilla-js/test-script-event-delegation` | Event delegation, bubbling, default action |
| Tìm kiếm hai danh sách | `vanilla-js/test-script-search-race` | Q03, Q05, Q13: closure, debounce, request race |
| Lịch làm việc responsive | `css/test-css-responsive-agenda` | Q01, Q02: semantics, flex sizing, responsive |

Mỗi folder có README riêng. Đề ứng viên chỉ mô tả yêu cầu và cách tái hiện,
không chứa đáp án hoặc rubric. README bản fixed dành cho interviewer, gồm
nguyên nhân lỗi, cách sửa, test case và rubric 0-3.

## Bài 1: danh sách công việc động

Thời gian: 20 phút. Level: Mid.

Giao diện có form thêm công việc, danh sách và nút xóa trong mỗi hàng.
Nút xóa chứa một phần tử con để tái hiện click không trúng trực tiếp button.
Một link tới mục thống kê nằm trong vùng danh sách.

Bản lỗi chỉ gắn listener lên các nút có sẵn, kiểm tra target quá trực tiếp
và hủy default action quá rộng. Người dùng phải thấy được các lỗi bằng thao tác.

Acceptance criteria:

- Thêm công việc bằng click hoặc Enter mà không reload trang.
- Xóa được hàng có sẵn và hàng mới bằng cả button lẫn phần tử con của button.
- Không cần đăng ký listener riêng cho từng hàng sau khi thêm.
- Link vẫn điều hướng tới mục thống kê; thêm/xóa không làm phát sinh submit.
- Chuỗi nhập được hiển thị như text, không trở thành HTML.
- Thao tác button được bằng keyboard.

## Bài 2: debounce/search độc lập

Thời gian: 30 phút. Level: Mid; phần test tự động dành cho Senior.

Hai ô tìm kiếm độc lập: nhân viên và phòng họp. API giả lập là module local,
có dữ liệu cố định, delay xác định theo query và case lỗi. Không gọi mạng.
Debounce contract: 300 ms, trailing edge. Match không phân biệt hoa/thường,
trim query và tìm substring. Query rỗng xóa kết quả ngay và không gọi API.

Bản lỗi dùng chung timer giữa hai ô và cho response cũ ghi đè query hiện tại.
Fixtures cho phép query `a` trả về sau `an` để tái hiện race ổn định.

Acceptance criteria:

- Chỉ gọi API sau 300 ms không nhập thêm; hai ô không hủy timer của nhau.
- Chỉ kết quả của query hiện tại được phép cập nhật UI.
- Clear query trong khi request đang chạy không cho kết quả cũ xuất hiện lại.
- Có trạng thái loading, empty, error và success riêng cho từng ô.
- Error của query cũ không được ghi đè kết quả của query mới.
- Test kiểm tra debounce, hai instance, response đảo thứ tự và clear query.

Không bắt buộc dùng AbortController vì API giả lập có thể không hỗ trợ hủy.
Chấp nhận giải pháp request identity hoặc ignore flag đúng contract.

## Bài 3: lịch làm việc responsive

Thời gian: 20 phút. Level: Mid.

Giao diện lịch có các hàng thời gian, tên cuộc họp, người phụ trách và nút
xác nhận tham gia. Fixture có tên dài và chuỗi không có dấu cách.

Bản lỗi dùng clickable div và flex item không co được khi nội dung dài.
Không đánh giá gu thẩm mỹ; giữ giao diện utilitarian và cùng dữ liệu hai bản.

Acceptance criteria:

- Tại viewport 320 px và desktop, trang không tràn ngang hoặc mất nội dung.
- Tên dài hiển thị đầy đủ bằng wrap, không bị che bằng overflow hidden.
- Nút xác nhận là native button, dùng được với Tab, Enter và Space.
- Focus indicator nhìn thấy được; thay đổi trạng thái không làm layout nhảy.
- Có kiểm tra text resize/reflow; không coi chỉ đổi px sang rem là đủ.

## Kiểm thử và bàn giao

Mỗi bản lỗi phải fail ít nhất một test hành vi tương ứng; bản fixed phải pass
cùng test. Browser tests kiểm tra DOM và tương tác thực, không chỉ source text.
Responsive test kiểm tra bounding box và scroll width ở mobile/desktop.

Đề tự sử dụng được bằng cách mở index.html trong browser. Nếu browser test
runner cần HTTP, server chỉ phục vụ kiểm thử local và được dừng sau kiểm tra.
Không thêm dependency vào các project bài tập cũ.

Cập nhật common.md thành mục lục bài thực hành, giữ mapping tới câu hỏi cũ.
Ghi rõ ba bài nào đã chạy được, các nhóm khác chưa triển khai. Cập nhật README
gốc với cách mở bài và nguyên tắc tách đề ứng viên khỏi lời giải.

## Nhóm tiếp theo, chưa thuộc lần triển khai này

Q04 chuyển thành bài xử lý dữ liệu không chặn UI. Q06-Q09 thành các bài React
về effect, draft, list identity và submit. Q10-Q12 thành bài App Router, cache
và API contract. Q14-Q16 thành performance, accessible dialog và security.
E01-E03 thành deployment lab, SEO debugging và bài ưu tiên release cho Lead.

Các nhóm tiếp theo cần chốt fixture và acceptance criteria trước khi viết code.
Không dùng câu hỏi lý thuyết đổi tên thành bài tập để đánh dấu đã hoàn thành.
