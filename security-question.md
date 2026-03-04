# Security Questions cho Frontend Lead

---

## XSS (Cross-Site Scripting)

- **Q1:** Phân biệt **Stored XSS**, **Reflected XSS**, và **DOM-based XSS**. Cách mitigate từng loại trong React/Vue là gì?
- **Q2:** Tại sao `innerHTML` nguy hiểm? Bạn sẽ dùng gì thay thế?
- **Q3:** Content Security Policy (CSP) hoạt động như thế nào? Viết một CSP header hạn chế script chỉ từ cùng origin.
  - *Expected answer:* `Content-Security-Policy: default-src 'self'; script-src 'self' trusted.com;`
- **Q4:** DOMPurify dùng để làm gì? Khi nào bạn cần dùng nó?

---

## CSRF & Cookies

- **Q5:** Anti-CSRF token và `SameSite` cookie khác nhau như thế nào? Trong SPA (Single Page App), bạn dùng cách nào?
- **Q6:** Giải thích các thuộc tính cookie: `HttpOnly`, `Secure`, `SameSite=Strict` vs `SameSite=Lax` — trade-off giữa security và UX là gì?
- **Q7:** Nếu backend không hỗ trợ CSRF token, bạn có giải pháp nào thay thế không?

---

## Authentication & Token Management

- **Q8:** JWT nên được lưu ở đâu: `localStorage` hay `httpOnly cookie`? Tại sao?
- **Q9:** OAuth 2.0 flow trong SPA (PKCE) hoạt động như thế nào? Tại sao không dùng implicit flow nữa?
- **Q10:** Access token hết hạn thì xử lý như thế nào? Silent refresh là gì và rủi ro của nó?

---

## Clickjacking & Headers

- **Q11:** `X-Frame-Options` và CSP `frame-ancestors` khác nhau chỗ nào? Cái nào nên dùng hơn trong 2026?
- **Q12:** Nêu 5 HTTP security headers quan trọng mà một FE Lead cần biết và cấu hình.
  - *Expected:* `CSP`, `X-Frame-Options`, `Strict-Transport-Security (HSTS)`, `X-Content-Type-Options`, `Referrer-Policy`

---

## API Security & Secrets Management

- **Q13:** Tại sao không được hardcode API key trong frontend JavaScript bundle? Bạn xử lý điều này thế nào?
- **Q14:** Backend-for-Frontend (BFF) pattern là gì? Khi nào nên áp dụng?
- **Q15:** CORS hoạt động như thế nào? Sự khác biệt giữa `preflight request` và `simple request`?

---

## Supply Chain & Dependencies

- **Q16:** Bạn kiểm tra security của third-party npm package bằng cách nào? (`npm audit`, Snyk, Dependabot)
- **Q17:** Subresource Integrity (SRI) là gì? Dùng khi nào?
- **Q18:** Nếu một package bị phát hiện có lỗ hổng critical trong production, quy trình xử lý của bạn là gì?

---

## Câu hỏi nâng cao cho Lead

- **Q19:** Trong một dự án team lớn, bạn tích hợp security vào CI/CD pipeline như thế nào?
- **Q20:** Bạn đã từng review code của người khác và phát hiện lỗ hổng security chưa? Mô tả tình huống đó (STAR method).
- **Q21:** Làm thế nào để balance giữa developer experience và security strictness khi set CSP policy?

---

## Mức kỳ vọng theo level

| Chủ đề                    | Mid FE | Senior FE | FE Lead |
|---------------------------|--------|-----------|---------|
| XSS / CSRF basics         | ✅     | ✅        | ✅      |
| Cookie attributes         | ✅     | ✅        | ✅      |
| JWT storage trade-offs    | ➖     | ✅        | ✅      |
| CSP configuration         | ➖     | ✅        | ✅      |
| Supply chain security     | ❌     | ➖        | ✅      |
| Security trong CI/CD      | ❌     | ➖        | ✅      |
| BFF pattern & API secrets | ❌     | ➖        | ✅      |
