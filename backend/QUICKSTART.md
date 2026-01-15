# 🚀 Quick Start Guide - FabriContract Backend

## Step-by-Step Setup (5 minutes)

### 1. Start MongoDB
You need MongoDB running for the backend to work.

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Free Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

### 2. Start the Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5000
📍 Environment: development
```

### 3. Test the API
Open a new terminal and test:

```bash
# Test server is running
curl http://localhost:5000

# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+91 9999999999\",\"password\":\"test123\",\"role\":\"worker\"}"
```

Or use **Postman/Thunder Client** for easier testing!

---

## 📋 What's Available

### ✅ Complete Backend API
- **5 Database Models**: User, CompanyProfile, WorkerProfile, Contract, Application
- **12 API Endpoints**: Auth, Worker profiles, Contracts with applications
- **JWT Authentication**: Secure login with role-based access
- **Input Validation**: All endpoints validated
- **Documentation**: Full API docs in `README.md` and `API_SAMPLES.md`

### 🔗 API Base URL
```
http://localhost:5000/api
```

### 📚 Key Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/worker/profile` - Create worker profile
- `POST /api/contracts` - Create contract (company)
- `POST /api/contracts/:id/apply` - Apply to contract (worker)
- `GET /api/workers` - Search workers
- `GET /api/contracts` - Search contracts

---

## 🎯 Next Steps

1. **Test all endpoints** using Postman
2. **Connect your frontend** by updating API URLs to `http://localhost:5000/api`
3. **Deploy** (optional):
   - Backend: Render, Railway, Heroku
   - Database: MongoDB Atlas (free tier)

---

## 📖 Full Documentation
- **Setup Guide**: [README.md](./README.md)
- **API Examples**: [API_SAMPLES.md](./API_SAMPLES.md)
- **Project Walkthrough**: See artifacts folder

## 🆘 Troubleshooting

**Issue**: MongoDB connection error  
**Fix**: Make sure MongoDB is running (`mongod`) or check Atlas connection string

**Issue**: Port 5000 already in use  
**Fix**: Change `PORT` in `.env` file

**Issue**: JWT errors  
**Fix**: Ensure `JWT_SECRET` is set in `.env`

---

## ✨ You're All Set!
The backend is fully functional and ready to integrate with your frontend! 🎉
