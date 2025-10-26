# Job Portal Backend

## Cấu trúc thư mục

```
backend/
├── configs/          # Cấu hình
├── controllers/      # Controller
├── models/           # Model
├── routes/           # Route
├── utils/            # Utils
├── server.js         # Server
├── package.json      # Package
├── .env              # Environment variables
├── .env.example      # Environment variables example
├── .gitignore        # Git ignore
└── README.md         # README
```

## Mô tả

Đây là backend API cho ứng dụng Job Portal, được xây dựng bằng Node.js, Express và MongoDB.

## Tính năng

- Xác thực và ủy quyền
- Quản lý người dùng
- Danh sách công việc
- Ứng tuyển công việc
- Công việc đã lưu
- Phân tích
- Quản lý hồ sơ
- Tải lên tệp
- Thông báo
- Tính năng AI phân tích CV, luyện phỏng vấn
- Quản lý phiên luyện phỏng vấn

## Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB với Mongoose
- JWT cho xác thực
- Cloudinary cho tải lên tệp
- Nodemailer cho email
- Các thư viện khác: bcryptjs, multer, v.v.

## Cài đặt

1. Clone dự án `git clone https://github.com/PhamHaThang/job-portal-backend.git`
2. Điều hướng đến thư mục backend `cd backend`
3. Chạy `npm install`
4. Tạo tệp .env với các biến sau (tham khảo .env.example):
   - MONGO_URI
   - PORT (tùy chọn, mặc định 5000)
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - EMAIL_USER
   - EMAIL_PASS
   - EMAIL_FROM
   - FRONTEND_RESET_PASSWORD_URL
   - FRONTEND_LOGIN_URL
   - GEMINI_API_KEY
   - PUTER_AUTH_TOKEN
   - JWT_EXPIRES_IN
   - JWT_SECRET
5. Chạy `npm run dev`

## Endpoints API

- /api/auth
- /api/user
- /api/jobs
- /api/applications
- /api/saved-jobs
- /api/analytics
- /api/resumes
- /api/sessions
- /api/questions
- /api/ai
- /api/upload
- /api/notifications
