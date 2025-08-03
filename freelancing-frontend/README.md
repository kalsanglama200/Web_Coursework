# Freelancing Platform Frontend

A React-based frontend for a freelancing platform with JWT authentication and API integration.

## Features

- **JWT Authentication**: Secure login/register with token-based authentication
- **Role-Based Registration**: Register as Client, Freelancer, or Admin
- **Protected Routes**: Role-based access control
- **API Integration**: Full integration with Node.js backend
- **Axios HTTP Client**: Configured with interceptors for automatic token handling
- **Error Handling**: Comprehensive error handling for API requests
- **Loading States**: User-friendly loading indicators

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- Backend server running on `http://localhost:5000`

### Database Setup

1. **Set up MySQL database**:
   ```bash
   # Connect to MySQL
   mysql -u your_username -p
   
   # Run the setup script
   source backend/setup-database.sql
   ```

2. **Configure environment variables** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=freelancing_platform
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd freelancing-frontend
   npm install
   ```

3. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

4. Start the frontend development server:
   ```bash
   cd freelancing-frontend
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Role-Based Registration

Users can register with three different roles:

- **🧑‍💻 Freelancer**: Find work and projects
- **💼 Client**: Post jobs and hire talent  
- **🛡️ Admin**: Manage the platform

Each role has different access levels and dashboard views.

## API Integration

### Authentication Flow

1. **Registration**: Users register with name, email, password, and role
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT tokens are automatically stored in localStorage
4. **Protected Requests**: All authenticated requests include the token in headers
5. **Role-Based Redirects**: Users are redirected to appropriate dashboards based on their role

### API Service Structure

The API service (`src/services/api.js`) provides:

- **Axios Configuration**: Base URL and default headers
- **Request Interceptors**: Automatic token injection
- **Response Interceptors**: Token expiration handling
- **API Endpoints**: Organized by feature (auth, users, jobs)

### Key Components

#### AuthContext (`src/context/AuthContext.jsx`)
- Manages authentication state
- Handles login/logout operations
- Stores user data and tokens
- Provides authentication status and user role

#### API Service (`src/services/api.js`)
- Centralized API configuration
- Automatic token management
- Error handling and interceptors

#### Protected Routes
- Role-based access control
- Automatic redirect to login
- Token validation

## Usage Examples

### Making Authenticated Requests

```javascript
import { userAPI } from '../services/api';

// Get user profile (automatically includes token)
const response = await userAPI.getProfile();

// Update user profile
const response = await userAPI.updateProfile({ name: 'New Name', email: 'new@email.com' });
```

### Using Authentication Context

```javascript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated, getUserRole } = useAuth();

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}

// Get user role
const role = getUserRole(); // Returns 'Client', 'Freelancer', or 'Admin'

// Login
const result = await login({ email: 'user@example.com', password: 'password' });

// Logout
logout();
```

## Backend Requirements

The backend should provide these endpoints:

### Authentication
- `POST /api/auth/register` - User registration (with role)
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### CORS Configuration

The backend should include CORS configuration:

```javascript
app.use(cors({
  origin: ['http://localhost:5173'],
  optionsSuccessStatus: 200
}));
```

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Automatic retry and user feedback
- **Authentication Errors**: Automatic logout on token expiration
- **Validation Errors**: Form-level error display
- **API Errors**: Centralized error handling in interceptors

## Security Features

- **JWT Token Management**: Secure token storage and automatic injection
- **Protected Routes**: Role-based access control
- **Input Validation**: Client-side and server-side validation
- **CORS Protection**: Proper CORS configuration
- **XSS Protection**: Input sanitization and validation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable components
├── context/            # React contexts (Auth, etc.)
├── pages/              # Page components
├── router/             # Routing configuration
├── services/           # API services
└── main.jsx           # Application entry point
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for `http://localhost:5173`
2. **Token Issues**: Check localStorage for token storage
3. **API Errors**: Verify backend server is running on port 5000
4. **Authentication Failures**: Check JWT_SECRET in backend environment
5. **Database Connection**: Ensure MySQL is running and credentials are correct
6. **Role Registration**: Make sure database has the role column in users table

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

### Sample Admin Account

After running the database setup script, you can login with:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin
