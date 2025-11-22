# Sarkaha Government Portal - Backend API

FastAPI backend for the Nepal Government Monitoring System.

## Features

- **JWT Authentication** - Secure token-based auth
- **User Registration & Login** - For both citizens and officials
- **Application Management** - Submit, track, and update applications
- **Hierarchy System** - Officials can manage their office applications
- **Office Statistics** - Real-time analytics and performance metrics
- **CORS Enabled** - Works with React frontend

## Tech Stack

- **FastAPI** - Modern Python web framework
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **JSON Files** - Simple file-based storage (easy to migrate to real DB)

## Installation

1. **Create Virtual Environment**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate Virtual Environment**
   
   Windows:
   ```bash
   venv\Scripts\activate
   ```
   
   Mac/Linux:
   ```bash
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup Environment Variables** (Optional)
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and change the SECRET_KEY to something secure.

## Running the API

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user (citizen or official)
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user info (requires auth)

### Applications

- **POST** `/api/applications` - Submit new application (requires auth)
- **GET** `/api/applications/{id}` - Get application by ID (public)
- **GET** `/api/applications` - Get my applications (requires auth)
- **PUT** `/api/applications/{id}` - Update application (officials only)

### Official/Hierarchy

- **GET** `/api/office/applications` - Get office applications (officials only)
- **GET** `/api/office/stats` - Get office statistics (officials only)
- **GET** `/api/hierarchy/subordinates` - Get subordinate office stats (officials only)

### Health

- **GET** `/` - API info
- **GET** `/health` - Health check

## Request Examples

### Register Citizen
```json
POST /api/auth/register
{
  "email": "citizen@example.com",
  "password": "securepassword",
  "full_name": "Ram Bahadur",
  "phone": "9841234567",
  "user_type": "citizen",
  "citizenship_number": "12-34-56-78901"
}
```

### Register Official
```json
POST /api/auth/register
{
  "email": "official@gov.np",
  "password": "securepassword",
  "full_name": "Hari Sharma",
  "phone": "9851234567",
  "user_type": "official",
  "office_level": "local",
  "office_name": "Ward 1 Office"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "citizen@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "email": "citizen@example.com",
    "full_name": "Ram Bahadur",
    "user_type": "citizen",
    ...
  }
}
```

### Submit Application
```json
POST /api/applications
Authorization: Bearer {token}

{
  "full_name": "Ram Bahadur",
  "email": "citizen@example.com",
  "phone": "9841234567",
  "address": "Pokhara-15, Kaski",
  "service_type": "passport",
  "citizenship_number": "12-34-56-78901",
  "description": "Need passport for work abroad",
  "target_office_level": "local",
  "target_office_name": "Ward 15 Office"
}
```

### Track Application
```json
GET /api/applications/APP12345678
```

## Data Storage

Currently using JSON files in `data/` directory:
- `data/users.json` - All users
- `data/applications.json` - All applications

Easy to migrate to:
- MongoDB
- PostgreSQL
- MySQL
- SQLite

## Security

- Passwords are hashed with bcrypt
- JWT tokens expire after 30 minutes
- CORS configured for local development
- Officials can only update applications in their office

## User Types

### Citizen
- Can register and login
- Can submit applications
- Can track their own applications
- Specifies target office when submitting

### Official
- Must specify office_level and office_name during registration
- Can login and access office dashboard
- Can view applications for their office
- Can update application status
- Can view office statistics

## Office Levels

1. `local` - Ward offices
2. `metropolitan` - Metropolitan city level
3. `district` - District level
4. `province` - Provincial level
5. `national` - National level

## Next Steps

- [ ] Implement ML model for ETA prediction
- [ ] Add proper database (MongoDB/PostgreSQL)
- [ ] Add email notifications
- [ ] Add file upload for documents
- [ ] Implement proper hierarchy relationships
- [ ] Add reporting system for delays
- [ ] Add admin panel
- [ ] Add rate limiting
- [ ] Add input sanitization
- [ ] Add comprehensive logging

## Development

Auto-reload is enabled by default. Any changes to Python files will automatically restart the server.

View API documentation at: `http://localhost:8000/docs`

## License

MIT License - Built for Nepal Government Digital Transformation

