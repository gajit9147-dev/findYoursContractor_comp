# Advanced Authentication API Documentation

Complete API documentation for FabriContract's multi-method authentication system.

## Base URL
```
http://localhost:5000/api/auth
```

---

## Authentication Methods

1. **Email/Password** - Traditional login
2. **Google OAuth** - Social login
3. **Phone OTP** - Passwordless login with SMS verification
4. **Password Reset** - Email-based password recovery

---

## API Endpoints

### 1. Email/Password Authentication

#### Register User
**POST** `/api/auth/register`

Create a new user account with email or phone and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+911234567890",
  "password": "password123",
  "role": "worker"
}
```

**Notes:**
- Either `email` OR `phone` is required (or both)
- Password minimum 6 characters
- Role must be "company" or "worker"

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "userCode": "USR-A1B2C3",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+911234567890",
      "role": "worker",
      "authProviders": {
        "local": true,
        "google": false,
        "phone": false
      }
    }
  }
}
```

#### Login
**POST** `/api/auth/login`

Login with email/phone and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
OR
```json
{
  "phone": "+911234567890",
  "password": "password123"
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "userCode": "USR-A1B2C3",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+911234567890",
      "role": "worker",
      "authProviders": {
        "local": true,
        "google": false,
        "phone": false
      }
    }
  }
}
```

---

### 2. Google OAuth Authentication

#### Initiate Google Login
**GET** `/api/auth/google`

Redirects user to Google OAuth consent screen. No body required.

**Browser Flow:**
1. Frontend redirects to: `http://localhost:5000/api/auth/google`
2. User signs in with Google
3. Backend redirects back to: `http://localhost:5173/auth/callback?token=<jwt-token>`
4. Frontend extracts token and stores it

**Example:**
```javascript
// Frontend: Redirect to Google OAuth
window.location.href = 'http://localhost:5000/api/auth/google';

// Frontend: Handle callback
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  localStorage.setItem('token', token);
  // Redirect to dashboard
}
```

**Account Linking:**
- If email already exists: Links Google provider
- If new user: Creates account with Google

---

### 3. Phone OTP Authentication

#### Request OTP
**POST** `/api/auth/phone/request-otp`

Send 4-digit OTP to phone number via SMS.

**Request Body:**
```json
{
  "phone": "+911234567890"
}
```

**Rate Limit:** 10 requests per hour per IP

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**DEV_MODE:**
When `DEV_MODE=true` in `.env`, OTP is logged to console:
```
========== OTP SMS (DEV MODE) ==========
To: +911234567890
OTP: 1234
Message: Your FabriContract verification code is: 1234. Valid for 5 minutes.
========================================
```

#### Verify OTP
**POST** `/api/auth/phone/verify-otp`

Verify OTP and login/create account.

**Request Body:**
```json
{
  "phone": "+911234567890",
  "otp": "1234"
}
```

**Rate Limit:** 10 requests per 10 minutes per IP
**Attempt Limit:** 5 attempts per OTP

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "userCode": "USR-D4E5F6",
      "name": "User 7890",
      "phone": "+911234567890",
      "role": "worker",
      "authProviders": {
        "local": false,
        "google": false,
        "phone": true
      },
      "isNewUser": false
    }
  }
}
```

**Error Response - Invalid OTP (400):**
```json
{
  "success": false,
  "message": "Invalid OTP. 3 attempts remaining."
}
```

---

### 4. Password Reset

#### Request Reset Link
**POST** `/api/auth/password/forgot`

Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Rate Limit:** 3 requests per hour per IP

**Success Response (200):**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Note:** Always returns success for security (doesn't reveal if email exists)

**DEV_MODE:**
When `DEV_MODE=true`, reset link is logged to console:
```
========== PASSWORD RESET EMAIL (DEV MODE) ==========
To: john@example.com
Reset Link: http://localhost:5173/reset-password?token=abc123...
Token: abc123...
====================================================
```

#### Reset Password
**POST** `/api/auth/password/reset`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

**Error Response - Invalid Token (400):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## React Frontend Integration

### Setup Axios Instance
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Email/Password Flow
```javascript
// Register
const register = async (data) => {
  const response = await api.post('/auth/register', data);
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};
```

### Phone OTP Flow
```javascript
const [otp, setOtp] = useState('');
const [phone, setPhone] = useState('');

// Step 1: Request OTP
const requestOTP = async () => {
  await api.post('/auth/phone/request-otp', { phone });
  alert('OTP sent! Check console in DEV_MODE');
};

// Step 2: Verify OTP
const verifyOTP = async () => {
  const response = await api.post('/auth/phone/verify-otp', { phone, otp });
  localStorage.setItem('token', response.data.data.token);
  // Redirect to dashboard
};
```

### Google OAuth Flow
```javascript
// Redirect to Google OAuth
const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};

// Handle callback (in /auth/callback route)
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  }
}, []);
```

### Password Reset Flow
```javascript
// Step 1: Request reset
const forgotPassword = async (email) => {
  await api.post('/auth/password/forgot', { email });
  alert('If email exists, reset link sent! Check console in DEV_MODE');
};

// Step 2: Reset password (token from email link)
const resetPassword = async (token, newPassword) => {
  await api.post('/auth/password/reset', { token, newPassword });
  alert('Password reset successful!');
  navigate('/login');
};
```

---

## Security Features

✅ **Password Hashing**: bcrypt with 10 salt rounds  
✅ **OTP Hashing**: All OTPs hashed before storage  
✅ **Token Hashing**: Reset tokens hashed  
✅ **Rate Limiting**: Prevents brute force attacks  
✅ **Attempt Limits**: Max 5 OTP attempts  
✅ **Expiration**: OTPs expire in 5 mins, reset tokens in 15 mins  
✅ **Generic Errors**: Doesn't reveal if email/phone exists  
✅ **DEV_MODE**: Test without external services  

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created (registration) |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (invalid credentials) |
| 403 | Forbidden (wrong auth method) |
| 429 | Too many requests (rate limited) |
| 500 | Server error |

---

## Testing with DEV_MODE

Set `DEV_MODE=true` in `.env` to test without Twilio/Email:

1. **Phone OTP**: Check console for OTP
2. **Password Reset**: Check console for reset link
3. **Google OAuth**: Requires real Google credentials

This is perfect for hackathons and development!
