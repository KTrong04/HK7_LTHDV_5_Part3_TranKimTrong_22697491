# Supplier & Product Management (Demo)

Ứng dụng demo quản lý nhà cung cấp và sản phẩm, built with Node.js, Express, MongoDB, EJS, Bootstrap.

## Tính năng
- Đăng ký, đăng nhập, đăng xuất (session + cookie)
- Quên mật khẩu (demo)
- CRUD cho Nhà cung cấp (Supplier)
- CRUD cho Sản phẩm (Product), product tham chiếu tới supplier
- Trang chủ có menu lọc theo nhà cung cấp và thanh tìm kiếm theo tên sản phẩm
- Giao diện dùng Bootstrap
- Cấu hình rút ra `.env`
- Swagger UI mô tả API tại `/api-docs`

## Cấu trúc thư mục
Theo yêu cầu: `models`, `controllers`, `routes`, `views`, `public`, `config`, `middleware`, v.v.

## Thiết lập
1. Clone repo
2. Tạo file `.env` (ví dụ đã có trong repo)
3. Cài dependency:
   ```bash
   npm install
Chạy MongoDB (local hoặc Atlas)

Chạy app:

npm run dev


Mở http://localhost:3000

Lưu ý

Trong môi trường production, cần nâng cấp bảo mật cho reset password (email + token), dùng HTTPS, CSRF protection, validation mạnh hơn.

Không commit node_modules và .env (đã thêm .gitignore).


---

## Hướng dẫn nhanh để chạy
1. Tạo thư mục theo cấu trúc bạn đính kèm, tạo các file tương ứng và paste nội dung trên.
2. `npm install`
3. Thiết lập `.env` (theo ví dụ).
4. Chạy MongoDB local (hoặc set `MONGODB_URI` tới Atlas).
5. `npm run dev` hoặc `npm start`.
6. Mở `http://localhost:3000` và API docs: `http://localhost:3000/api-docs`.

---

## Ghi chú kỹ thuật & nhỏ
- Mình đã dùng `express-session` + `connect-mongo` để lưu session vào MongoDB.
- Swagger docs định nghĩa cơ bản thông qua comment JSDoc trên các route files; bạn có thể mở rộng schema docs nếu cần.
- Mình để Bootstrap dùng CDN cho nhanh; bạn có thể đổi sang tải xuống và lưu trong `/public`.
- Flash messages: nếu không hiện, đảm bảo bạn thêm middleware để đẩy `res.locals.messages = req.flash()` ngay sau `app.use(flash())` trong `app.js`. (Mình đã nhắc thêm trong phần views).
- `views/layout.ejs` dùng cú pháp `layout('layout')` — đảm bảo sử dụng EJS thuận tiện. Nếu muốn dùng một cách khác (render with locals), có thể thay đổi theo nhu cầu.

---

Nếu bạn muốn mình **tạo file zip / commit sẵn** hoặc **gửi từng file theo thứ tự để bạn copy dễ hơn**, báo mình — mình sẽ xuất theo dạng dễ copy (hoặc tạo hướng dẫn line-by-line). Hoặc nếu muốn mở rộng: thêm roles (admin), API JSON, hoặc tích hợp email cho reset password — mình làm tiếp luôn.
