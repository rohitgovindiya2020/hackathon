# Service Marketplace - React Frontend

Modern React.js frontend for the Service Marketplace platform with authentication, role-based dashboards, and API integration.

## Features Implemented

### ✅ Authentication System
- User registration with role selection (Customer/Provider)
- Provider area selection during registration
- Login with JWT token authentication
- Logout functionality
- Protected routes with role-based access control

### ✅ Dashboards
- **Provider Dashboard** - Manage services, discounts, bookings, certifications
- **Customer Dashboard** - Browse services, track interests, view promo codes

### ✅ Core Infrastructure
- React Router for navigation
- Axios for API calls with interceptors
- Authentication context for global state
- Modern gradient UI design
- Responsive layout

## Tech Stack

- **React** 18.x
- **React Router** 6.x
- **Axios** for HTTP requests
- **Context API** for state management

## Project Structure

```
src/
├── components/
│   └── Auth/
│       ├── Login.js              # Login component
│       ├── Register.js           # Registration component
│       ├── ProtectedRoute.js     # Route protection
│       └── Auth.css              # Auth styling
├── contexts/
│   └── AuthContext.js            # Authentication state
├── pages/
│   ├── Provider/
│   │   └── Dashboard.js          # Provider dashboard
│   ├── Customer/
│   │   └── Dashboard.js          # Customer dashboard
│   └── Dashboard.css             # Dashboard styling
├── services/
│   └── api.js                    # Axios configuration
├── App.js                        # Main app with routing
└── App.css                       # Global styles
```

## Setup & Installation

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:8000`

### Install Dependencies

```bash
cd /var/www/html/hakathorn/service-marketplace-frontend
npm install
```

### Environment Configuration

The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes
- `/provider/dashboard` - Provider dashboard (providers only)
- `/customer/dashboard` - Customer dashboard (customers only)

## Usage

### 1. Register a New Account

1. Go to `http://localhost:3000/register`
2. Fill in your details
3. Select role (Customer or Provider)
4. If Provider, select service areas
5. Click Register

### 2. Login

1. Go to `http://localhost:3000/login`
2. Enter email and password
3. Click Login
4. You'll be redirected to your role-specific dashboard

### 3. Dashboards

**Provider Dashboard:**
- Manage Services
- Create Discounts
- Set Availability
- Upload Certifications
- View Bookings
- Check Performance

**Customer Dashboard:**
- Search Services
- Track Interests (Max 3)
- View Promo Codes
- Manage Bookings
- View Service History
- Edit Preferences

## API Integration

The frontend connects to the Laravel backend via Axios:

```javascript
// Example API call
import api from './services/api';

// Get services
const response = await api.get('/services');

// Create interest
const response = await api.post('/interests', { discount_id: 1 });
```

All API calls automatically include the authentication token from localStorage.

## Authentication Flow

1. **Register/Login** → Receives JWT token from backend
2. **Token Storage** → Stored in localStorage
3. **API Requests** → Token automatically added to headers
4. **Protected Routes** → Checks authentication before rendering
5. **Logout** → Clears token and redirects to login

## Styling

The app uses modern CSS with:
- Gradient backgrounds
- Card-based layouts
- Hover effects
- Responsive design
- Mobile-friendly

## Next Steps

### To Be Implemented:

1. **Service Management** (Provider)
   - Create/edit services
   - Service listing
   - Service details

2. **Discount System** (Provider)
   - Create discounts
   - Track interest count
   - View interested customers

3. **Interest Management** (Customer)
   - Browse services with discounts
   - Express interest (3-limit UI)
   - Remove interests

4. **Promo Codes** (Customer)
   - View activated codes
   - Code validity display

5. **Booking System**
   - Create bookings
   - Status tracking
   - Chat integration

6. **Additional Features**
   - Availability calendar
   - Certification upload
   - Service comparison
   - Preferences management
   - Service history

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Fix security vulnerabilities
npm audit fix
```

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure the Laravel backend has CORS enabled:

```bash
# In Laravel backend
php artisan config:clear
```

### API Connection Failed
- Check backend is running: `http://localhost:8000`
- Verify `.env` has correct API URL
- Check browser console for errors

### Login Not Working
- Ensure backend database is migrated
- Check backend API is accessible
- Verify credentials are correct

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved
