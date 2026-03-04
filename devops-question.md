# DevOps Questions for Frontend Lead

## CI/CD Pipeline

- **CI/CD là gì và tại sao nó quan trọng với frontend?**
  (Giải thích flow từ push code → build → test → deploy)

- **Khi `npm run build` chạy, điều gì xảy ra bên trong?**
  (Webpack bundling, tree-shaking, code splitting, minification)

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

- **Core Web Vitals là gì và team bạn đo lường chúng thế nào trong pipeline?**

---

## Leadership & Cross-team (FE Lead góc nhìn)

- **Khi DevOps team thay đổi pipeline ảnh hưởng đến FE build, bạn xử lý thế nào?**

- **Bạn làm gì để đảm bảo toàn bộ FE team tuân thủ quy trình CI/CD?**
  (PR gates, required checks, branch protection)

- **Làm thế nào để bạn onboard một FE developer mới vào hệ thống CI/CD của team?**

---

> 💡 **Tip:** Kết hợp câu trả lời với các dịch vụ Azure cụ thể:
> **Azure DevOps Pipelines**, **Azure Static Web Apps**,
> **Azure Container Registry**, **Azure Application Insights**
