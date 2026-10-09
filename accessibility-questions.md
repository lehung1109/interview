# Câu hỏi Accessibility cho Frontend Lead

Foundation/Technical có thể dùng cho Mid/Senior; Leadership dành cho Lead.
Chọn câu theo JD, áp dụng thang chấm 0-3 trong [common.md](common.md) và ghi rõ
đáp án kỳ vọng. Đánh giá trải nghiệm sử dụng, không chỉ khả năng nhớ tên ARIA.

---

## 1. Kiến thức nền tảng (Foundation)

- **WCAG là gì? Bạn đang áp dụng level nào (A, AA, AAA) và tại sao?**
- **4 nguyên tắc POUR là gì?**
  (Perceivable, Operable, Understandable, Robust) — Cho ví dụ thực tế với mỗi nguyên tắc.
- **Accessibility tree là gì?**
  Nó khác DOM tree như thế nào và ảnh hưởng đến screen reader ra sao?

---

## 2. Kỹ thuật (Technical Deep Dive)

- **Khi nào dùng ARIA, khi nào KHÔNG nên dùng?**
  (Rule of thumb: nếu có native HTML element thì dùng native.)
- **Làm thế nào để quản lý keyboard focus trong SPA (React) khi thay đổi route?**
- **`aria-label`, `aria-labelledby`, `aria-describedby` khác nhau thế nào?**
  Dùng cái nào trong trường hợp nào?
- **`aria-live` regions hoạt động thế nào?**
  Khi nào dùng `polite` vs `assertive`?
- **Browser zoom, thay đổi font mặc định và text resize khác nhau thế nào?**
Kỳ vọng: font dùng `px` vẫn phóng to khi browser zoom. `rem` dựa trên font size
của root; `em` cho font size dựa trên parent. Relative units có thể tôn trọng
font preference nếu root không bị cố định. Kiểm tra resize/reflow và nội dung
không bị cắt, thay vì coi đơn vị font là bằng chứng đạt accessibility.
- **`tabindex="0"`, `tabindex="-1"`, `tabindex="5"` — khi nào hợp lệ?**
- **Làm thế nào để accessible hóa một custom modal/dialog component?**
  (focus trap, `role="dialog"`, `aria-modal`, escape key)

---

## 3. Testing & Tooling

- **Bạn dùng công cụ nào để test accessibility?**
  Gợi ý: Lighthouse, axe DevTools, `jest-axe`, `eslint-plugin-jsx-a11y`, NVDA/VoiceOver.
- **Automated accessibility testing bỏ sót những vấn đề nào?**
Kỳ vọng: công cụ có thể kiểm tra một số rule về label, ARIA hoặc contrast,
nhưng không chứng minh toàn bộ trải nghiệm accessible. Cần test keyboard,
screen reader, thứ tự focus và chất lượng nội dung. Không dùng một tỷ lệ
phần trăm cố định làm đáp án vì phụ thuộc công cụ, phạm vi và cách tính lỗi.
- **Bạn tích hợp accessibility testing vào CI/CD pipeline như thế nào?**

---

## 4. Leadership & Process

- **Mô tả cách bạn xây dựng culture accessibility trong team.**
- **Khi backlog có nhiều accessibility issue hơn team có thể handle, bạn ưu tiên thế nào?**
- **Nếu stakeholder/client không muốn đầu tư vào accessibility, bạn xử lý thế nào?**
  (Đưa argument về pháp lý, reach, và ROI.)
- **Bạn phối hợp với designer và PM để đảm bảo accessibility ngay từ giai đoạn design như thế nào?**

---

## 5. Common Mistakes (Red Flags cần biết khi review code team)

- Dùng `<div>`/`<span>` thay vì `<button>`, `<nav>`, `<main>`
- Không có `alt` text cho ảnh (hoặc `alt` không có nghĩa)
- Dùng màu sắc là cách DUY NHẤT để truyền thông tin
- Form không có `<label>` liên kết với input
- Bỏ qua visible focus indicator (`:focus` bị `outline: none`)
- Không test với screen reader thực tế
