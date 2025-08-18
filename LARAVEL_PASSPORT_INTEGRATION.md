# Laravel Passport Integration Guide

This Vue.js application has been configured to work with Laravel Passport authentication at `localhost:8000`.

## Configuration Changes Made

### 1. Environment Configuration
- Disabled mock authentication (`VITE_USE_MOCK=false`)
- Set API base path to `http://localhost:8000/api/v1`
- Created `.env.local` file for local development

### 2. API Endpoints Updated
The following endpoints are now configured for Laravel Passport:

- **Login**: `POST /api/v1/auth/login`
  - Request body: `{ email: string, password: string }`
  - Response: `{ access_token, token_type, expires_in, user }`

- **Logout**: `POST /api/v1/auth/logout`
  - Requires Bearer token in Authorization header

- **Get User Profile**: `GET /api/v1/user/profile`
  - Requires Bearer token in Authorization header
  - Returns current user information

### 3. Authentication Flow
1. User enters email and password on login form
2. App sends credentials to Laravel Passport login endpoint
3. Laravel returns access token and user data
4. Token is stored in Pinia store and automatically added to all API requests
5. User info is fetched from `/api/v1/user/profile` when needed

### 4. Updated Files
- `/src/api/login/index.ts` - API endpoints for authentication
- `/src/api/login/types.ts` - TypeScript interfaces for Laravel responses
- `/src/axios/config.ts` - Axios interceptors for Bearer token
- `/src/store/modules/user.ts` - User store with token management
- `/src/views/Login/components/LoginForm.vue` - Login form with email field
- `/src/permission.ts` - Route guards with token checking
- `.env.local` and `.env.dev` - Environment configuration

## Running the Application

### Prerequisites
1. Laravel backend running at `http://localhost:8000`
2. Laravel Passport configured with the following endpoints:
   - `/api/v1/auth/login`
   - `/api/v1/auth/logout`
   - `/api/v1/user/profile`

### Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run development server with local configuration:
```bash
pnpm dev:local
```

The application will start at `http://localhost:4000`

### Laravel Backend Requirements

Your Laravel backend should have:

1. **Passport installed and configured**
```php
composer require laravel/passport
php artisan passport:install
```

2. **API routes configured** (routes/api.php):
```php
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/user/profile', [UserController::class, 'profile']);
    });
});
```

3. **CORS configured** to allow requests from `http://localhost:4000`

### Testing the Integration

1. Start your Laravel backend at `http://localhost:8000`
2. Start the Vue frontend with `pnpm dev:local`
3. Navigate to `http://localhost:4000`
4. Try logging in with your Laravel user credentials

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your Laravel backend has proper CORS configuration:
- Install `fruitcake/laravel-cors` package
- Configure allowed origins to include `http://localhost:4000`

### Token Not Being Sent
- Check browser DevTools Network tab to verify Authorization header
- Ensure token is properly stored in localStorage/sessionStorage
- Check Pinia persist plugin configuration

### 401 Unauthorized Errors
- Verify token is valid and not expired
- Check Laravel Passport token expiration settings
- Ensure middleware is properly configured in Laravel

## Additional Notes

- The application uses Pinia for state management with persistence
- Tokens are automatically included in all API requests via Axios interceptors
- User information is fetched on app load if a valid token exists
- Logout clears the token and redirects to login page