# Browser tests cho bài thực hành

Tài liệu nội bộ; không giao folder này cho ứng viên vì test chứa tiêu chí chấm.
Các bài HTML vẫn mở trực tiếp được, không phụ thuộc bộ test.

## Chuẩn bị

Yêu cầu Node.js 20 trở lên và npm. Chạy từ root repository:

```powershell
npm --prefix tests/practical-exercises install
npm --prefix tests/practical-exercises run install-browser
```

## Kiểm tra bản lời giải

```powershell
npm --prefix tests/practical-exercises test
```

Mặc định chạy bản `-fixed`. Kỳ vọng tất cả test pass.

## Kiểm tra bản có lỗi

```powershell
$env:EXERCISE_VARIANT = 'broken'
npm --prefix tests/practical-exercises test
Remove-Item Env:EXERCISE_VARIANT
```

Bản có lỗi cố ý fail một số test hành vi. Mỗi nhóm bài phải có ít nhất một
failure do lỗi của bài, không phải lỗi browser, thiếu file hoặc lỗi cú pháp.
Không sửa test thành pass để che đi lỗi có chủ đích.

## Chạy một nhóm

```powershell
node --test --test-name-pattern=delegation tests/practical-exercises/exercises.test.mjs
```

Thay pattern bằng `search` hoặc `agenda` khi kiểm tra các nhóm tương ứng.
Browser tests dùng file URL; không cần server phục vụ trang.

## Dùng browser có sẵn

Nếu Chromium chưa cài được, có thể dùng Edge đã cài trên máy:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm --prefix tests/practical-exercises test
Remove-Item Env:PLAYWRIGHT_CHANNEL
```

Tùy chọn này chỉ đổi browser runtime, không đổi test hoặc tiêu chí đánh giá.

## Kiểm tra React

Yêu cầu Node.js >= 20.9. Cài dependency cho hai bản fixed từ root repo:

```powershell
npm --prefix react-js/test-react-draft-board-fixed install
npm --prefix react-js/test-react-submit-retry-fixed install
npm --prefix tests/practical-exercises run test:react
```

Mặc định chạy cả draft và submit. Suite khởi tạo port trống, spawn Next trong
folder của variant và dừng đúng process tree do chính test tạo. Không cần mở
dev server bằng tay; không dùng hoặc dừng các server đang chạy của người dùng.

Chọn một nhóm:

```powershell
$env:REACT_EXERCISE = 'draft'
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm --prefix tests/practical-exercises run test:react
Remove-Item Env:REACT_EXERCISE
Remove-Item Env:PLAYWRIGHT_CHANNEL
```

Thay draft bằng submit, hoặc all để chạy cả hai. Bản broken cũng dùng cùng suite:
cài dependency riêng trong hai starter, đặt EXERCISE_VARIANT=broken như phần
HTML, chạy test:react rồi xóa biến đó. Failure đúng chủ đích là bằng chứng test
phân biệt được hai bản; lỗi startup, thiếu dependency hoặc browser không tính.

Draft tests dùng clock dừng trước input. Submit tests gọi API local thật với
key riêng cho mỗi case. Backend memory reset khi restart/hot reload; đây không
phải API production. Screenshot được lưu trong test-results đã git-ignore.


