# FabriContract Backend API

Complete Node.js/Express backend API for a fabrication contract marketplace connecting companies with skilled workers.

## 🚀 Features

- **User Authentication**: JWT-based auth with role-based access (company/worker)
- **Worker Profiles**: Create and manage worker profiles with skills, expertise, and portfolio
- **Contract Management**: Companies can post, update, and manage fabrication contracts
- **Application System**: Workers can apply to contracts with bids and proposals
- **Advanced Filtering**: Search workers and contracts with multiple filter options
- **Pagination**: Efficient data loading for large datasets
- **Security**: Password hashing with bcrypt, JWT tokens, role-based authorization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## ⚙️ Installation

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and update the values:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/fabricontract
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRES_IN=7d
     FRONTEND_URL=http://localhost:5173
     ```

4. **Start MongoDB** (if using local installation):
   ```bash
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "password": "password123",
  "role": "worker"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Worker Routes (`/api/worker`)

#### Create/Update Worker Profile
```http
POST /api/worker/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "city": "Mumbai",
  "state": "Maharashtra",
  "radiusKm": 50,
  "availability": "full-time",
  "experienceYears": 5,
  "skills": ["Welding", "Fabrication", "Blueprint Reading"],
  "expertisePrimary": ["welding"],
  "expertiseSecondary": ["structural", "piping"],
  "expertiseLevel": "Expert",
  "portfolioImages": ["https://example.com/image1.jpg"],
  "documents": ["https://example.com/cert1.pdf"]
}
```

#### Get My Profile
```http
GET /api/worker/profile/me
Authorization: Bearer <token>
```

#### Search Workers
```http
GET /api/workers?city=Mumbai&skill=Welding&experienceYears=3&page=1&limit=20
```

### Contract Routes (`/api/contracts`)

#### Create Contract
```http
POST /api/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Steel Frame Fabrication for Commercial Building",
  "description": "Need experienced fabricators for steel frame construction...",
  "category": "structural",
  "locationCity": "Mumbai",
  "locationState": "Maharashtra",
  "budgetMin": 50000,
  "budgetMax": 100000,
  "deadlineDate": "2026-03-01",
  "attachments": ["https://example.com/blueprint.pdf"]
}
```

#### Get Contracts
```http
GET /api/contracts?keyword=steel&city=Mumbai&category=structural&budgetMin=50000&page=1&limit=20
```

#### Get Contract by ID
```http
GET /api/contracts/:id
```

#### Update Contract
```http
PATCH /api/contracts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed",
  "budgetMax": 120000
}
```

#### Apply to Contract
```http
POST /api/contracts/:id/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "bidAmount": 75000,
  "proposedDays": 30,
  "message": "I have 5 years of experience in steel fabrication..."
}
```

#### Get Contract Applications
```http
GET /api/contracts/:id/applications?page=1&limit=20
Authorization: Bearer <token>
```

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

After login/register, include the returned token in subsequent requests.

## 🛡️ Role-Based Access

- **Company Role**: Can create contracts, view applications, update own contracts
- **Worker Role**: Can create profile, apply to contracts, view own profile

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.config.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User authentication
│   │   ├── CompanyProfile.js     # Company details
│   │   ├── WorkerProfile.js      # Worker details
│   │   ├── Contract.js           # Contract listings
│   │   └── Application.js        # Worker applications
│   ├── controllers/
│   │   ├── auth.controller.js    # Auth logic
│   │   ├── worker.controller.js  # Worker logic
│   │   └── contract.controller.js # Contract logic
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── worker.routes.js      # Worker endpoints
│   │   └── contract.routes.js    # Contract endpoints
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── role.middleware.js    # Role checking
│   │   └── validation.middleware.js # Input validation
│   └── utils/
│       └── jwt.utils.js          # JWT helpers
├── server.js                     # Entry point
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

Use tools like Postman, Thunder Client, or cURL to test the API endpoints.

**Example cURL request**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+91 9876543210","password":"password123","role":"worker"}'
```

## 🔧 Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running and `MONGODB_URI` in `.env` is correct
- **JWT errors**: Check `JWT_SECRET` is set in `.env`
- **CORS errors**: Verify `FRONTEND_URL` matches your frontend application URL

## 📝 License

ISC

## 👨‍💻 Author

FabriContract Team
