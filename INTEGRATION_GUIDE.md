# Frontend-Backend Integration Guide

## What Was Connected

✅ **Authentication System**
- Login/Register pages with JWT tokens
- Protected routes for authenticated users
- User state management with React Context
- Automatic token refresh on page load

✅ **Application Submission**
- CitizenForm now submits to backend API
- Office selection (level + name) included
- Real-time validation and error handling
- Auto-populate user info from auth context

✅ **Application Tracking**
- TrackApplication fetches from backend API
- Public endpoint (no auth required)
- Real-time application status

✅ **Official Dashboard**
- Fetches applications for specific office
- Real office statistics from backend
- Subordinate offices data
- Only accessible to officials

## How to Test the Full System

### 1. Start Backend
```bash
cd backend
venv\Scripts\activate
python main.py
```
Backend runs at: `http://localhost:8000`

### 2. Start Frontend
```bash
# In a new terminal
npm run dev
```
Frontend runs at: `http://localhost:3000` or `http://localhost:5173`

### 3. Test Flow

#### As a Citizen:
1. Go to **Register** (`/register`)
2. Select "Citizen"
3. Fill in details:
   - Email: `citizen@test.com`
   - Password: `password123`
   - Full Name: `Ram Bahadur`
   - Phone: `9841234567`
   - Citizenship: `12-34-56-78901`
4. Click Register → Auto-logged in and redirected to home
5. Go to **Apply for Services**
6. Fill out the form:
   - Select service type (e.g., Passport)
   - Select office: "Local" → "Ward 15 Office"
   - Fill other details
7. Submit → Redirected to tracking page
8. Copy the Application ID (e.g., APP12345678)
9. Can track anytime at `/track`

#### As an Official:
1. Go to **Register** (`/register`)
2. Select "Government Official"
3. Fill in details:
   - Email: `official@test.com`
   - Password: `password123`
   - Full Name: `Hari Sharma`
   - Phone: `9851234567`
   - Office Level: `local`
   - Office Name: `Ward 15 Office`
4. Click Register → Auto-logged in
5. Go to **Official Portal** (`/dashboard`)
6. See all applications for your office
7. View office statistics
8. Monitor subordinate offices

#### Track Application (Public):
1. Go to **Track Application** (`/track`)
2. Enter application ID
3. See real-time status and flowchart
4. No login required!

## API Endpoints Used

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Submit application (auth required)
- `GET /api/applications/{id}` - Track application (public)
- `GET /api/applications` - Get my applications (auth required)

### Official
- `GET /api/office/applications` - Get office applications (officials only)
- `GET /api/office/stats` - Get office stats (officials only)
- `GET /api/hierarchy/subordinates` - Get subordinate offices (officials only)

## Key Features

### Authentication
- JWT tokens stored in localStorage
- Auto-logout on token expiration
- Protected routes redirect to login
- User info in header navigation

### Office Assignment
- Citizens specify target office when applying
- Applications immediately assigned to that office
- Officials only see their office's applications
- Hierarchy can see subordinate data

### Error Handling
- Network errors displayed to user
- Form validation
- Loading states on all async operations
- 401 errors trigger auto-logout

## File Structure

```
src/
├── services/
│   └── api.js                  # API service layer
├── context/
│   └── AuthContext.jsx         # Auth state management
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── CitizenForm.jsx        # Application form (connected to API)
│   ├── TrackApplication.jsx   # Tracking page (connected to API)
│   └── OfficialDashboard.jsx  # Dashboard (connected to API)
├── components/
│   ├── Header.jsx             # Updated with auth buttons
│   ├── Footer.jsx
│   └── ScrollToTop.jsx
└── App.jsx                    # Routes + Protected routes
```

## Data Flow

### Citizen Submits Application:
1. Citizen logs in → JWT token stored
2. Fills form with target office
3. API call to `/api/applications` with token
4. Backend creates application
5. Application assigned to specified office
6. Returns application ID
7. Frontend redirects to tracking page

### Official Views Dashboard:
1. Official logs in → JWT token stored
2. Navigates to dashboard
3. API fetches:
   - Office applications (filtered by their office)
   - Office statistics
   - Subordinate offices data
4. Dashboard displays real-time data

### Anyone Tracks Application:
1. Enter application ID
2. API call to `/api/applications/{id}` (no auth)
3. Backend returns application data
4. Frontend shows flowchart and progress

## Security

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Protected routes on frontend
- ✅ Backend validates user permissions
- ✅ Officials can only access their office data
- ✅ CORS configured for security

## Next Steps

1. Add email notifications when application status changes
2. Implement real ML model for ETA predictions
3. Add file upload for documents
4. Add payment gateway for fees
5. Add reporting system for delays
6. Migrate to real database (MongoDB/PostgreSQL)
7. Deploy to production

## Troubleshooting

### "Network Error"
- Make sure backend is running at port 8000
- Check CORS settings in backend

### "Unauthorized"
- Token expired → Will auto-logout
- Login again

### "Application Not Found"
- Check application ID
- Make sure you're using the exact ID from submission

### Can't See Applications in Dashboard
- Make sure you're registered as "official"
- Office name must match exactly (case-sensitive)
- Applications must be submitted to YOUR office

## Testing Data

Use these for quick testing:

**Citizen Account:**
- Email: `ram@test.com`
- Password: `password123`

**Official Account:**
- Email: `official@ward15.gov.np`
- Password: `password123`
- Office: Ward 15 Office (local)

**Test Application:**
- Service: Passport
- Office: Local → Ward 15 Office

---

That's it! The system is fully integrated and working! 🚀

