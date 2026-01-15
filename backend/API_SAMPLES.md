# API Sample Requests - FabriContract Backend

This document contains sample JSON request bodies for testing the API endpoints.

## Authentication

### Register as Worker
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh.worker@example.com",
  "phone": "+91 9876543210",
  "password": "worker123",
  "role": "worker"
}
```

### Register as Company
```json
{
  "name": "BuildTech Solutions",
  "email": "contact@buildtech.com",
  "phone": "+91 8765432109",
  "password": "company123",
  "role": "company"
}
```

### Login
```json
{
  "email": "rajesh.worker@example.com",
  "password": "worker123"
}
```

## Worker Profile

### Create Worker Profile
**Requires**: Worker role authentication

```json
{
  "photoUrl": "https://example.com/photos/rajesh.jpg",
  "city": "Mumbai",
  "state": "Maharashtra",
  "radiusKm": 50,
  "availability": "full-time",
  "experienceYears": 8,
  "skills": [
    "Welding",
    "Structural Steel Fabrication",
    "Blueprint Reading",
    "Metal Cutting",
    "Quality Control"
  ],
  "expertisePrimary": ["welding", "structural"],
  "expertiseSecondary": ["piping", "maintenance", "ss"],
  "expertiseLevel": "Expert",
  "portfolioImages": [
    "https://example.com/portfolio/project1.jpg",
    "https://example.com/portfolio/project2.jpg"
  ],
  "documents": [
    "https://example.com/certs/aws-d1-1.pdf",
    "https://example.com/certs/experience-letter.pdf"
  ]
}
```

### Minimal Worker Profile
```json
{
  "city": "Delhi",
  "state": "Delhi",
  "availability": "part-time",
  "experienceYears": 3,
  "expertisePrimary": ["fitter"],
  "expertiseLevel": "Intermediate"
}
```

## Contracts

### Create Contract
**Requires**: Company role authentication

```json
{
  "title": "Steel Frame Fabrication for Commercial Building",
  "description": "We need experienced fabricators for steel frame construction of a 5-story commercial building. The project includes cutting, welding, and assembling structural steel components according to architectural drawings. Must have experience with H-beams, I-beams, and column fabrication.",
  "category": "structural",
  "locationCity": "Mumbai",
  "locationState": "Maharashtra",
  "budgetMin": 500000,
  "budgetMax": 750000,
  "deadlineDate": "2026-06-15",
  "attachments": [
    "https://example.com/blueprints/floor-plan.pdf",
    "https://example.com/drawings/steel-specs.dwg"
  ]
}
```

### Stainless Steel Project
```json
{
  "title": "SS Kitchen Equipment Fabrication",
  "description": "Manufacturing complete stainless steel kitchen setup for restaurant chain. Includes work tables, sinks, shelving units, and custom equipment. Grade 304 SS required.",
  "category": "ss",
  "locationCity": "Bangalore",
  "locationState": "Karnataka",
  "budgetMin": 200000,
  "budgetMax": 350000,
  "deadlineDate": "2026-04-30",
  "attachments": []
}
```

### Welding Project
```json
{
  "title": "Industrial Piping Welding - Chemical Plant",
  "description": "Welding of industrial pipes for chemical processing plant. TIG and MIG welding expertise required. Safety certifications mandatory.",
  "category": "welding",
  "locationCity": "Pune",
  "locationState": "Maharashtra",
  "budgetMin": 300000,
  "budgetMax": 500000,
  "deadlineDate": "2026-05-20",
  "attachments": [
    "https://example.com/specs/piping-layout.pdf"
  ]
}
```

### Update Contract Status
**Requires**: Company role authentication (owner only)

```json
{
  "status": "closed"
}
```

### Update Contract Budget
```json
{
  "budgetMin": 600000,
  "budgetMax": 900000
}
```

## Applications

### Apply to Contract
**Requires**: Worker role authentication

```json
{
  "bidAmount": 650000,
  "proposedDays": 45,
  "message": "I have 8 years of experience in structural steel fabrication. I've successfully completed similar projects for commercial buildings including a 7-story office complex last year. I have AWS D1.1 certification and my team consists of 4 skilled welders. We use modern equipment and follow strict quality control procedures. I'm confident we can deliver this project within the timeline and budget."
}
```

### Competitive Bid
```json
{
  "bidAmount": 520000,
  "proposedDays": 38,
  "message": "Our company specializes in commercial steel fabrication with 12 years of experience. We have completed 15+ similar projects. Attached portfolio shows our recent work. Competitive pricing without compromising quality. Team of 6 certified fabricators ready to start immediately."
}
```

### Quick Apply
```json
{
  "bidAmount": 750000,
  "proposedDays": 60,
  "message": "Available for this project. Have all required expertise and equipment."
}
```

## Query Parameters Examples

### Search Workers
```
GET /api/workers?city=Mumbai&skill=Welding&experienceYears=5&expertisePrimary=structural&page=1&limit=10
```

### Filter Contracts
```
GET /api/contracts?keyword=steel&city=Mumbai&category=structural&budgetMin=500000&budgetMax=1000000&status=open&page=1&limit=20
```

### Get Contract Applications (Paginated)
```
GET /api/contracts/507f1f77bcf86cd799439011/applications?page=1&limit=10
```

## Response Examples

### Successful Registration
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Rajesh Kumar",
      "email": "rajesh.worker@example.com",
      "phone": "+91 9876543210",
      "role": "worker"
    }
  }
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Access denied. This route requires one of the following roles: company"
}
```
