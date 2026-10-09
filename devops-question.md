# DevOps Questions for Frontend Lead

Chọn câu theo trách nhiệm deploy/operations trong JD. Docker và Azure chỉ là
lựa chọn triển khai, không phải yêu cầu mặc định cho mọi frontend role.
Áp dụng thang chấm 0-3 trong [common.md](common.md); ghi rõ đáp án kỳ vọng.

## CI/CD Pipeline

- **CI/CD là gì và tại sao nó quan trọng với frontend?**
  (Giải thích flow từ push code → build → test → deploy)

- **Khi `npm run build` chạy, điều gì xảy ra bên trong?**
Kỳ vọng: đọc script trong package.json trước khi mô tả các bước build.
Next.js 16 mặc định dùng Turbopack cho dev/build; Webpack vẫn có thể được chọn
bằng `--webpack`. Phân biệt compilation/bundling, TypeScript checking,
prerendering theo cấu hình và runtime server. `next build` không tự chạy lint;
pipeline phải có lint/test gates riêng.

- **Làm thế nào để cache build artifacts trong CI pipeline để tăng tốc?**
  (node_modules caching, Docker layer caching)

- **Mô tả một pipeline CI/CD hoàn chỉnh cho React/Next.js app của bạn.**
  (lint → test → build → staging deploy → production deploy)

- **Bạn xử lý thế nào khi một pipeline fail ở staging nhưng không fail ở local?**

---

## Environments & Configuration

- **Sự khác biệt giữa Development, Staging, và Production environment?**

- **Environment variables hoạt động thế nào? Tại sao KHÔNG được đưa `.env` lên Git?**

- **Làm thế nào để inject env vars vào frontend app lúc build time vs runtime?**
  (Ví dụ: `REACT_APP_*`, `NEXT_PUBLIC_*`)

- **Bạn quản lý secrets (API keys, tokens) trong pipeline như thế nào?**
  (Azure Key Vault, GitHub Secrets)

---

## Docker & Containerization

- **Docker image và Docker container khác nhau thế nào?**

- **Viết một `Dockerfile` cơ bản để build và serve một React app.**
  (Multi-stage build: node → nginx)

- **Tại sao dùng multi-stage build cho frontend?**
  (Giảm image size, tách build env khỏi runtime)

- **Nginx được dùng thế nào khi deploy frontend app?**
  (Serve static files, reverse proxy, gzip, caching headers)

---

## Deployment & Rollback

- **Chiến lược deploy nào phù hợp với frontend app?**
  (Blue/Green, Canary, Rolling)

- **Rollback trong deployment là gì? Bạn sẽ rollback khi nào?**

- **Làm thế nào để deploy một React/Next.js app lên Azure Static Web Apps hoặc Azure App Service?**

- **Bạn debug lỗi production như thế nào khi không reproduce được ở local?**
  (Logs, Application Insights, source maps)

---

## Performance & Monitoring

- **Các best practices về web performance liên quan đến build/deploy?**
  (Code splitting, lazy loading, CDN, caching headers)

- **Bạn set up monitoring và alerting cho frontend app thế nào?**
  (Azure Monitor, Application Insights, Sentry)

- **Bạn kết hợp performance checks trong CI với real-user monitoring thế nào?**
Kỳ vọng: Core Web Vitals hiện tại là LCP, INP, CLS. Lab checks giúp phát hiện
regression nhưng không thay thế field data. Lighthouse navigation dùng TBT
làm proxy cho interactivity, không trực tiếp đo INP của người dùng thực.
Đánh giá field metrics tại p75, tách mobile/desktop và theo dõi sau release.

---

## Leadership & Cross-team (FE Lead góc nhìn)

- **Khi DevOps team thay đổi pipeline ảnh hưởng đến FE build, bạn xử lý thế nào?**

- **Bạn làm gì để đảm bảo toàn bộ FE team tuân thủ quy trình CI/CD?**
  (PR gates, required checks, branch protection)

- **Làm thế nào để bạn onboard một FE developer mới vào hệ thống CI/CD của team?**

---

Chỉ đào sâu các dịch vụ Azure khi JD yêu cầu. Chấp nhận ví dụ tương đương từ
cloud hoặc CI provider khác nếu ứng viên giải thích được nguyên tắc, cách
kiểm chứng deployment và rollback.
