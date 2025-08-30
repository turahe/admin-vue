# Turahe Admin Vue

A modern, feature-rich admin dashboard built with Vue 3, TypeScript, Element Plus, and Vite. This project provides a comprehensive admin interface with authentication, user management, notifications, and more.

## ✨ Features

### 🔐 Authentication System

- **User Login/Logout**: Secure authentication with Laravel Passport
- **User Registration**: Complete registration flow with validation
- **Password Management**: Forgot password, reset password, and password updates
- **Email Verification**: Email verification system for new accounts
- **Remember Me**: Persistent login sessions
- **JWT Token Management**: Automatic token handling and refresh

### 🔔 Notification System

- **Real-time Notifications**: Dropdown notification menu in header
- **Notification Management**: Mark as read/unread, clear all notifications
- **Notification List Page**: Dedicated page for viewing all notifications
- **Badge Support**: Unread notification count display
- **Type-based Notifications**: Info, success, warning, and error types

### 🎨 Modern UI/UX

- **Element Plus Components**: Rich component library
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Theme switching capability
- **Internationalization**: Multi-language support (English, Chinese, Indonesian)
- **Custom Components**: Reusable component library

### 🚀 Technical Features

- **Vue 3 Composition API**: Modern Vue.js development
- **TypeScript**: Full type safety and IntelliSense
- **Vite Build Tool**: Fast development and build times
- **Pinia State Management**: Modern state management
- **Vue Router**: Client-side routing
- **Axios HTTP Client**: API communication with interceptors

## 🛠️ Installation

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm
- Git

### Get the project code

```bash
git clone https://github.com/your-username/turahe-admin-vue.git
cd turahe-admin-vue
```

### Install dependencies

```bash
pnpm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_PATH=http://localhost:8000

# App Configuration
VITE_APP_TITLE=Turahe Admin
VITE_BASE_PATH=/

# Feature Flags
VITE_USE_ALL_ELEMENT_PLUS_STYLE=true
VITE_HIDE_GLOBAL_SETTING=false
VITE_USE_ONLINE_ICON=false
```

## 🚀 Development

### Start development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build:pro
```

### Type checking

```bash
pnpm ts:check
```

### Linting

```bash
pnpm lint
```

## 📁 Project Structure

```
src/
├── api/                    # API services
│   ├── auth/              # Authentication APIs
│   ├── notification/      # Notification APIs
│   └── ...                # Other API modules
├── components/            # Reusable components
│   ├── Notification/      # Notification components
│   ├── Form/             # Form components
│   └── ...                # Other components
├── store/                 # Pinia stores
│   ├── modules/           # Store modules
│   │   ├── user.ts        # User authentication store
│   │   ├── notification.ts # Notification store
│   │   └── ...            # Other stores
├── views/                 # Page components
│   ├── Login/             # Authentication pages
│   ├── Personal/          # Personal center pages
│   └── ...                # Other pages
├── router/                # Vue Router configuration
├── hooks/                 # Composable functions
└── utils/                 # Utility functions
```

## 🔌 API Integration

### Authentication Endpoints

- `POST /api/v1/login` - User login
- `POST /api/v1/register` - User registration
- `POST /api/v1/logout` - User logout
- `GET /api/v1/user/profile` - Get user profile
- `POST /api/v1/forgot-password` - Forgot password
- `POST /api/v1/reset-password` - Reset password

### Notification Endpoints

- `GET /notifications` - Get all notifications
- `PUT /notifications/{id}/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read
- `DELETE /notifications/clear-all` - Clear all notifications

## 🎯 Key Components

### Authentication Forms

- **LoginForm**: Email/password login with validation
- **RegisterForm**: Complete registration with country, username, email, phone, and password
- **ForgetPasswordForm**: Password recovery flow

### Notification System

- **Notification**: Header dropdown with notification list
- **NotificationList**: Full-page notification management

### User Management

- **UserInfo**: User profile display and actions
- **User Store**: Centralized user state management

## 🔧 Configuration

### API Base URL

Update `VITE_API_BASE_PATH` in your environment file to point to your Laravel backend.

### Authentication

The system uses Laravel Passport for OAuth 2.0 authentication. Ensure your backend is configured with the correct endpoints.

### Notifications

Notifications are managed through a centralized store with API integration.

## 🚀 Deployment

### Build

```bash
pnpm build:pro
```

### Serve

The built files will be in the `dist/` directory, ready to be served by any static file server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/your-username/turahe-admin-vue/issues) page
- Create a new issue with detailed information
- Contact the development team

---

**Built with ❤️ using Vue 3, Element Plus, and modern web technologies**
