# Lời giải nội bộ: project draft board

Không giao folder này cho ứng viên. Yêu cầu Node.js >= 20.9 và npm.

```powershell
cd react-js/test-react-draft-board-fixed
npm install
npm run dev -- --port 3042
```

Mở http://127.0.0.1:3042; chọn port khác nếu đã được sử dụng.

## Nguyên nhân và cách sửa

useState chỉ lấy props lúc khởi tạo. Bản sửa theo dõi revision và điều chỉnh
state của chính component có điều kiện: pristine lấy title mới, dirty giữ draft.
Không sync tất cả thay đổi props bằng một effect ghi đè input đang chỉnh.

Key theo ID giữ state của hàng đúng project khi reorder. Effect check phụ thuộc
draft/dirty là primitive, có cleanup timer, không phụ thuộc object mới mỗi render.
Việc tăng counter không đổi các dependency nên không tạo vòng lặp check.

Discard lấy props server hiện tại, không dùng snapshot đầu tiên. Strict Mode
giữ bật; cleanup ngăn timer của lần setup cũ còn chạy.

## Kiểm chứng

Browser suite nội bộ kiểm tra refresh pristine/dirty, reorder, Discard,
mốc 249/250 ms, 1000 ms idle và input liên tục. Cùng suite phải fail các lỗi
có chủ đích ở starter và pass ở fixed. Kiểm tra thêm keyboard và ảnh mobile.

```powershell
npm run lint
npm run typecheck
```

## Rubric 0-3

| Điểm | Bằng chứng |
| --- | --- |
| 0 | Không sửa được lỗi chính hoặc làm mất draft. |
| 1 | Sửa được một phần, còn props/reorder/idle check không đúng contract. |
| 2 | Đạt toàn bộ acceptance criteria, không tắt Strict Mode hoặc đổi fixture. |
| 3 | Đạt mức 2, có kiểm chứng timing/identity và giải thích trade-off state. |

Đánh giá hành vi, không yêu cầu code giống lời giải này.
Tooling ESLint 9 hiện có npm advisory; audit runtime không có advisory ở lần
kiểm tra này. Không dùng audit fix --force để đổi major khi làm bài.
