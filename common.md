# Bài thực hành và câu hỏi Frontend: Mid / Senior

Tài liệu nội bộ dành cho người phỏng vấn. Không chia sẻ ngân hàng câu hỏi,
đáp án hoặc thư mục `-fixed` với ứng viên.

Bộ câu hỏi ưu tiên JavaScript, React 19, Next.js 16 App Router và TypeScript.
Level là mức đánh giá mục tiêu, không phải yêu cầu thuộc lòng API.
Chọn câu theo JD; không hỏi toàn bộ ngân hàng trong một buổi.

## Bài thực hành chạy được

Có năm cặp bài độc lập. P01-P03 mở HTML trực tiếp; P04-P05 cần Node.js >= 20.9,
npm install và dev server theo README của từng bài. Không cần API key hoặc
dịch vụ ngoài. Mỗi folder đề có acceptance criteria; README fixed có giải thích
và rubric dành cho interviewer.

| Bài | Đề và cách chạy | Lời giải nội bộ | Level / thời gian | Mapping |
| --- | --- | --- | --- | --- |
| P01: danh sách công việc động | [Đề](vanilla-js/test-script-event-delegation/README.md), [mở HTML](vanilla-js/test-script-event-delegation/index.html) | [README](vanilla-js/test-script-event-delegation-fixed/README.md), [HTML](vanilla-js/test-script-event-delegation-fixed/index.html) | Mid / 20 phút | Event delegation, bubbling, default action |
| P02: tìm kiếm nhân viên và phòng họp | [Đề](vanilla-js/test-script-search-race/README.md), [mở HTML](vanilla-js/test-script-search-race/index.html) | [README](vanilla-js/test-script-search-race-fixed/README.md), [HTML](vanilla-js/test-script-search-race-fixed/index.html) | Mid / 30 phút; test cho Senior | Q03, Q05, Q13 |
| P03: lịch làm việc responsive | [Đề](css/test-css-responsive-agenda/README.md), [mở HTML](css/test-css-responsive-agenda/index.html) | [README](css/test-css-responsive-agenda-fixed/README.md), [HTML](css/test-css-responsive-agenda-fixed/index.html) | Mid / 20 phút | Q01, Q02 |
| P04: editor project với draft và reorder | [Đề / cách chạy](react-js/test-react-draft-board/README.md) | [Lời giải / cách chạy](react-js/test-react-draft-board-fixed/README.md) | Mid / Senior, 30 phút | Q06-Q08 |
| P05: yêu cầu chi phí với submit/retry | [Đề / cách chạy](react-js/test-react-submit-retry/README.md) | [Lời giải / cách chạy](react-js/test-react-submit-retry-fixed/README.md) | Mid / Senior, 30 phút | Q09 |

[Browser tests](tests/practical-exercises/README.md) kiểm tra cùng hành vi ở cả
bản đề lẫn bản fixed. Bản đề cố ý fail một số test; bản fixed phải pass.
Không giao test, mục lục có lời giải hoặc folder fixed cho ứng viên.

## Nhóm tiếp theo: chưa triển khai

Các hàng dưới đây là định hướng chuyển đổi, chưa có starter hoặc lời giải mới.
Không coi chúng là bài chạy được. Các câu gốc phía dưới giữ để tham chiếu.

| Bài dự kiến | Mapping | Sản phẩm cần bàn giao |
| --- | --- | --- |
| Import dữ liệu không chặn UI | Q04 | Pipeline xử lý file, UI tiến độ và bằng chứng input vẫn phản hồi. |
| Dashboard App Router và mutation | Q10-Q11 | Ranh giới server/client, freshness sau mutation và cache isolation. |
| Kiểm tra API contract bằng TypeScript | Q12, discriminated union | Runtime validation, state union và case response không hợp lệ. |
| Tối ưu dashboard có dữ liệu lớn | Q14, memoization, transitions, Suspense, Error Boundary | Profiling trước/sau, UI phản hồi và fallback/error recovery. |
| Dialog dùng keyboard và screen reader | Q15 | Focus lifecycle, background inert và kiểm chứng tương tác. |
| Review và sửa luồng cookie session | Q16 | Patch server/client, threat model và case XSS/CSRF/authorization. |
| Deployment, SEO và quyết định release | E01-E03 | Artifact/pipeline lab, SEO debug và kế hoạch ưu tiên có bằng chứng. |

## Cách đánh giá

Mỗi câu hoặc bài chấm từ 0 đến 3 theo bằng chứng trong lời giải và kiểm chứng:

| Điểm | Tiêu chí |
| --- | --- |
| 0 | Sai nền tảng hoặc không giải thích được hành vi. |
| 1 | Hiểu một phần nhưng giải pháp còn thiếu hoặc cần nhiều gợi ý. |
| 2 | Giải thích đúng nguyên nhân và đưa ra giải pháp phù hợp với tình huống. |
| 3 | Đạt mức 2, đồng thời phân tích trade-off, edge case và cách kiểm chứng. |

Đáp án kỳ vọng dưới đây là các điểm đánh giá, không phải một lời giải duy nhất.
Ghi lại câu hỏi, điểm, mức hỗ trợ và bằng chứng; không dùng một ngưỡng tổng điểm
chung cho mọi level.

## HTML & CSS

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q01 | Một `<div onClick>` hoạt động bằng chuột. Vì sao vẫn nên đổi thành `<button>`? | Mid | 3 phút | Native semantics, keyboard activation, focus và accessible name. Biết mặc định submit của button trong form và chọn `type` phù hợp. |
| Q02 | Một phần tử Flexbox chứa chuỗi dài làm tràn màn hình mobile. Bạn điều tra và sửa thế nào? | Mid | 4 phút | Kiểm tra kích thước và minimum size của flex item; cân nhắc `min-width: 0`, wrapping và bố cục responsive. Không mặc định che nội dung bằng `overflow: hidden`; kiểm chứng với chuỗi dài và zoom. |

Câu hỏi đào sâu: Khi nào chọn Grid thay cho Flexbox? Làm sao tìm rule thắng
trong CSS cascade mà không lạm dụng `!important`?

## JavaScript Core

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q03 | Closure là gì? Trong hàm debounce, timer được giữ ở đâu giữa các lần gọi? Vì sao mỗi ô tìm kiếm cần instance debounce riêng? | Mid | 4 phút | Function giữ quyền truy cập lexical environment sau khi outer function kết thúc. Timer thuộc closure, được thay thế bằng `clearTimeout`; chia sẻ một instance có thể khiến các ô hủy timer của nhau. |
| Q04 | Promise callback và `setTimeout(..., 0)` cùng được đăng ký trong một tác vụ đồng bộ: thứ tự chạy thế nào? `async` có làm tác vụ CPU hết chặn UI không? | Mid | 4 phút | Synchronous code trước, microtask từ Promise sau, timer task tiếp theo. `async` không tự chuyển CPU work sang thread khác; cân nhắc chia nhỏ tác vụ hoặc Web Worker. |
| Q05 | Người dùng gõ tìm kiếm liên tục; response cũ về sau response mới. Làm sao tránh hiển thị sai kết quả? | Mid | 5 phút | Debounce giảm số request nhưng không bảo đảm thứ tự response. Dùng cancellation hoặc request identity để bỏ kết quả cũ; cleanup, xử lý lỗi, loading và empty state. |

Câu hỏi đào sâu: Event delegation hoạt động thế nào khi danh sách thêm phần tử
động? Khi nào `preventDefault` khác `stopPropagation`?

## React

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q06 | Một effect gọi `setState` khiến component cập nhật liên tục. Bạn tìm nguyên nhân bằng cách nào? | Mid | 5 phút | Tìm vòng lặp state/effect và dependency đổi identity. Phân biệt dữ liệu có thể tính trong render với synchronization cần effect. Không xóa dependency để che lỗi; phân biệt với kiểm tra setup/cleanup thêm của Strict Mode trong development. |
| Q07 | `useState(props.value)` không cập nhật khi props đổi. Nên sửa thế nào nếu người dùng đang chỉnh bản nháp? | Mid | 5 phút | Initial state không tự sync với props. Xác định nguồn dữ liệu: controlled value, local draft hoặc reset theo identity. Tránh effect ghi đè chỉnh sửa chưa lưu khi props đổi. |
| Q08 | Vì sao dùng index làm `key` có thể khiến input trong danh sách nhận nhầm dữ liệu sau khi reorder? | Mid | 4 phút | Key tham gia nhận diện component và giữ state. Dùng ID ổn định trong tập sibling; không tạo random key mỗi render. Mô tả cách tái hiện bằng reorder/delete. |
| Q09 | Form gửi hai lần hoặc thất bại giữa chừng: bạn thiết kế luồng submit thế nào? | Mid / Senior | 5 phút | Validation, pending/error/success, retry và phản hồi accessible. Disable nút không thay thế idempotency ở backend khi cần. Chấp nhận event handler hoặc form action phù hợp; Senior giải thích được optimistic update/rollback nếu áp dụng. |

Câu hỏi đào sâu cho Senior:

**Khi nào dùng `useMemo`/`useCallback`?** Kỳ vọng: có bằng chứng profiling hoặc
nhu cầu identity, không memoize mặc định. React Compiler không mặc định được
bật chỉ vì dùng Next.js 16.

**Concurrent rendering, `startTransition` và `useDeferredValue` giúp gì khi
nhập liệu làm render danh sách nặng?** Kỳ vọng: phân biệt cập nhật
urgent/non-urgent; không coi chúng là debounce hay giải pháp tự giảm
network request.

**Khi nào Suspense hiển thị fallback?** Kỳ vọng: nguồn dữ liệu/code hỗ trợ
Suspense như `lazy`, `use` với Promise ổn định hoặc framework integration.
Fetch trong effect không tự kích hoạt Suspense.

**Error Boundary khác `try...catch` thế nào?** Kỳ vọng: phân biệt lỗi render ở
descendant với lỗi event handler hoặc tác vụ async cần xử lý riêng.

## Next.js & TypeScript

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q10 | Trong Next.js App Router, phần nào nên là Server Component, phần nào cần Client Component? | Mid / Senior | 5 phút | Browser APIs, state và event handlers cần client boundary. Hiểu phạm vi `'use client'` với imports; tránh đưa secrets xuống browser, giảm client JS. Client Component vẫn có thể được prerender trên server. |
| Q11 | Sau mutation, UI vẫn hiển thị dữ liệu cũ. Bạn phân biệt cache phía client, server và CDN thế nào? | Senior | 5 phút | Xác định lớp cache trước khi invalidation; phân biệt router refresh với invalidation dữ liệu đã cache. Xem cấu hình/version Next.js thay vì giả định mọi fetch đều cache; cân nhắc freshness và phạm vi dữ liệu theo user. |
| Q12 | API trả dữ liệu sai cấu trúc dù đã khai báo kiểu TypeScript. Tại sao và xử lý thế nào? | Mid / Senior | 4 phút | TypeScript không validate runtime. Dùng `unknown`, narrowing hoặc schema validation tại boundary; type assertion/generic không chứng minh response hợp lệ. Xử lý lỗi dữ liệu thay vì ép kiểu để qua compiler. |

Câu hỏi đào sâu: Thiết kế discriminated union cho trạng thái
loading/success/error để tránh tổ hợp state không hợp lệ. Khi nào dùng Context,
khi nào cần state library hoặc server-state cache?

## Testing & Performance

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q13 | Bạn sẽ test ô tìm kiếm có debounce và request race bằng những case nào? | Senior | 5 phút | Fake timers, response đảo thứ tự, input rỗng, lỗi API và unmount. Kiểm tra kết quả người dùng thấy, không chỉ số lần gọi nội bộ. |
| Q14 | Người dùng báo trang chậm nhưng Lighthouse tốt. Bạn sẽ đo và điều tra gì trước? | Senior | 5 phút | RUM và dữ liệu thiết bị/network thực; LCP, INP, CLS và profiling. Phân biệt lab với field: Lighthouse navigation dùng TBT làm proxy, không thay phép đo INP thực. Tối ưu bottleneck và đo lại, không mặc định thêm memoization. |

## Accessibility & Security

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| Q15 | Một modal phải hoạt động bằng keyboard và screen reader. Bạn kiểm tra những gì? | Mid / Senior | 5 phút | Accessible name, initial focus, focus containment, Escape, return focus và background inert. Cân nhắc native `<dialog>`; ARIA không tự triển khai keyboard behavior. Test keyboard và screen reader, không chỉ automated scan. |
| Q16 | Với ứng dụng dùng cookie session, bạn đánh giá XSS và CSRF thế nào? CORS có thay authorization không? | Senior | 5 phút | Cookie `HttpOnly`/`Secure`/`SameSite`, biện pháp CSRF theo kiến trúc và server-side authorization. HttpOnly không ngăn mọi tác hại của XSS; CORS không phải authorization. Không coi localStorage hay cookie là đáp án đúng tuyệt đối cho mọi hệ thống. |

## Mở rộng theo JD

Không yêu cầu ứng viên biết Azure, Docker, một state library hoặc SEO chuyên sâu
nếu vị trí không cần chúng.

| ID | Câu hỏi | Level | Thời gian | Đáp án kỳ vọng / tiêu chí đánh giá |
| --- | --- | --- | --- | --- |
| E01 | Build thành công nhưng deploy lỗi; bạn kiểm tra gì và rollback thế nào? | Senior | 5 phút | Runtime, env, artifact, logs và smoke test. Phân biệt static export với ứng dụng cần Next.js server. Lint/test là gates riêng; `next build` trong Next.js 16 không tự chạy lint. Có tiêu chí rollback và kiểm tra tương thích với backend. |
| E02 | Trang sản phẩm render được nhưng không được index: bạn điều tra thế nào? | Senior, khi cần SEO | 5 phút | HTTP status, HTML thực nhận, metadata, canonical, robots/noindex và Search Console. SSR không tự bảo đảm index; robots.txt không phải cơ chế giữ dữ liệu bí mật. |
| E03 | Team có deadline gấp và nhiều lỗi accessibility/security. Bạn ưu tiên, phân công và ngăn tái diễn thế nào? | Lead | 6 phút | Đánh giá tác động và rủi ro, xác định owner, phối hợp PM/design/backend, release gates và kết quả đo được. Không chỉ kể tên công cụ hay đẩy hết trách nhiệm sang QA. |

Các ngân hàng chuyên đề: [Accessibility](accessibility-questions.md),
[Security](security-question.md), [DevOps](devops-question.md),
[SEO](seo-question.md). Dùng làm câu hỏi đào sâu, áp dụng cùng thang chấm
và ghi rõ đáp án kỳ vọng trước buổi phỏng vấn.

## Bài thực hành có sẵn

Chọn một bài, dành khoảng 20 phút. Các tiêu chí dưới đây dành cho interviewer,
không thay đổi code hoặc bổ sung yêu cầu ngầm cho đề ứng viên.

| Bài | Tiêu chí đánh giá | Câu hỏi đào sâu |
| --- | --- | --- |
| [Effect / change count](react-js/test-char-count-react/README.md) | Ứng viên xác định nguyên nhân cập nhật lặp, sửa đúng hành vi đếm và giải thích cách kiểm chứng. | Dependency identity và Strict Mode khác nhau thế nào? |
| [Search / API](react-js/test-use-hook-react/README.md) | Kết quả phù hợp search text, có dữ liệu API và giải thích được luồng async. Thống nhất quy tắc match trước khi bắt đầu. | Nếu response về sai thứ tự hoặc API lỗi thì sao? |
| [Props / state](react-js/text-use-prop-in-state/README.md) | Interviewer cần viết đề và chốt khi nào reset draft trước khi giao bài; đánh giá nguồn dữ liệu và nguy cơ mất chỉnh sửa. | Khi nào controlled component hoặc reset theo key phù hợp? |

README của một số bài vẫn là template. Không giao bài chỉ dựa vào tên thư mục;
cần bổ sung hành vi quan sát được, acceptance criteria và prerequisites trước
khi sử dụng. Không đánh trượt vì ứng viên không xử lý một yêu cầu chưa được nêu.

## Tham khảo kỹ thuật

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React: Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React: Suspense](https://react.dev/reference/react/Suspense)
- [Next.js 16](https://nextjs.org/blog/next-16)
- [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [WAI-ARIA: Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [OWASP: CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
