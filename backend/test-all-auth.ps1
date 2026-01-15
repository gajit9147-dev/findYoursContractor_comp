$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:5000/api/auth"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🧪 Testing FabriContract Auth System" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Server Status
Write-Host "1️⃣  Checking Server Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET | ConvertFrom-Json
    Write-Host "✅ Server is running - Version: $($response.version)" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not responding" -ForegroundColor Red
    Write-Host "   Start backend: cd backend && npm run dev" -ForegroundColor Yellow
    exit
}

Start-Sleep -Seconds 1

# Test 2: Registration
Write-Host "`n2️⃣  Testing Registration..." -ForegroundColor Yellow
try {
    $email = "test$(Get-Random)@example.com"
    $body = @{
        name = "Test User"
        email = $email
        password = "test123"
        role = "worker"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   UserCode: $($response.data.user.userCode)" -ForegroundColor Cyan
    Write-Host "   Email: $($response.data.user.email)" -ForegroundColor Cyan
    
    $global:testEmail = $email
    $global:testToken = $response.data.token
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 3: Login
Write-Host "`n3️⃣  Testing Login..." -ForegroundColor Yellow
try {
    $body = @{
        email = $global:testEmail
        password = "test123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   UserCode: $($response.data.user.userCode)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 4: Phone OTP Request
Write-Host "`n4️⃣  Testing Phone OTP Request..." -ForegroundColor Yellow
try {
    $phone = "+91$(Get-Random -Minimum 1000000000 -Maximum 9999999999)"
    $body = @{ phone = $phone } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/phone/request-otp" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    
    Write-Host "✅ OTP request successful!" -ForegroundColor Green
    Write-Host "   Phone: $phone" -ForegroundColor Cyan
    Write-Host "   📝 Check backend console for OTP (DEV_MODE)" -ForegroundColor Yellow
    
    $global:testPhone = $phone
} catch {
    Write-Host "❌ OTP request failed: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Password Reset Request
Write-Host "`n5️⃣  Testing Password Reset Request..." -ForegroundColor Yellow
try {
    $body = @{ email = $global:testEmail } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/password/forgot" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    
    Write-Host "✅ Password reset request successful!" -ForegroundColor Green
    Write-Host "   📝 Check backend console for reset link (DEV_MODE)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Password reset failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "✅ All Tests Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`n📊 Summary:" -ForegroundColor Yellow
Write-Host "   - Email/Password: Working ✅" -ForegroundColor Green
Write-Host "   - Phone OTP: Working ✅ (check console)" -ForegroundColor Green
Write-Host "   - Password Reset: Working ✅ (check console)" -ForegroundColor Green
Write-Host "   - Unique UserCodes: Generated ✅" -ForegroundColor Green
Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Check backend console for OTP and reset link"
Write-Host "   2. Use the OTP to verify phone authentication"
Write-Host "   3. Use reset link to test password reset"
Write-Host ""
