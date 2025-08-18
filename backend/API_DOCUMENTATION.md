# Laravel API with Spatie Permission - Documentation

## Overview
This Laravel application implements role-based access control using Spatie Laravel Permission package. It provides API endpoints to retrieve user information along with their roles and permissions.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Configure database:**
   - Copy `.env.example` to `.env`
   - Update database configuration (SQLite is configured by default)

3. **Run migrations and seeders:**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Start the development server:**
   ```bash
   php artisan serve
   ```

## Default Users

The seeder creates three users with different roles:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@example.com | password | admin | All permissions |
| editor@example.com | password | editor | create post, edit post, view post |
| viewer@example.com | password | viewer | view post |

## API Endpoints

### 1. Login
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "password"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "name": "Nur Wachid",
        "email": "admin@example.com",
        "roles": ["admin"],
        "permissions": ["create post", "edit post", "delete post", "view post", "manage users", "manage roles"]
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 2. Get User Info by ID (Public)
**Endpoint:** `GET /api/userinfo/{id}`

**Example:** `GET /api/userinfo/1`

**Response:**
```json
{
    "id": 1,
    "name": "Nur Wachid",
    "roles": ["admin"],
    "permissions": ["create post", "edit post", "delete post", "view post", "manage users", "manage roles"]
}
```

### 3. Get Authenticated User Info (Protected)
**Endpoint:** `GET /api/userinfo`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Response:**
```json
{
    "id": 1,
    "name": "Nur Wachid",
    "roles": ["admin"],
    "permissions": ["create post", "edit post", "delete post", "view post", "manage users", "manage roles"]
}
```

### 4. Logout (Protected)
**Endpoint:** `POST /api/logout`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Response:**
```json
{
    "message": "Successfully logged out"
}
```

## Testing with cURL

### Login:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

### Get User Info by ID:
```bash
curl http://localhost:8000/api/userinfo/1
```

### Get Authenticated User Info:
```bash
curl -X GET http://localhost:8000/api/userinfo \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## Roles and Permissions

### Available Roles:
- **admin**: Full system access
- **editor**: Can create, edit, and view posts
- **viewer**: Can only view posts

### Available Permissions:
- `create post`
- `edit post`
- `delete post`
- `view post`
- `manage users`
- `manage roles`

## Package Information

- **Laravel Framework:** v12.x
- **Spatie Laravel Permission:** v6.x
- **Laravel Sanctum:** v4.x (for API authentication)

## Additional Notes

- The application uses SQLite database by default
- API routes are prefixed with `/api`
- All responses are in JSON format
- Authentication is handled using Laravel Sanctum tokens