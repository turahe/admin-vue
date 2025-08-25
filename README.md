# Vue Element Plus Admin

[![Vue](https://img.shields.io/badge/Vue-3.5.19-brightgreen.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11.1-blue.svg)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, comprehensive admin dashboard solution built with **Vue 3**, **Element Plus**, **TypeScript**, and **Vite**. This project provides a complete backend management system with rich features, comprehensive documentation, and production-ready code.

## ✨ Features

### 🎨 UI & Layout
- **Multiple Layouts**: Classic, top navigation, and responsive layouts
- **Theme System**: Light/dark modes with customizable color schemes
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Component Library**: Built on Element Plus with custom components
- **Animations**: Smooth transitions with Animate.css
- **Icons**: Comprehensive icon system with Iconify integration

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Laravel Integration**: Ready for Laravel Passport authentication
- **Role-based Access Control**: Dynamic route permissions
- **Login Security**: Password strength validation with zxcvbn
- **Session Management**: Persistent user sessions with automatic logout

### 🌍 Internationalization
- **Multi-language Support**: English, Chinese (Simplified), Indonesian
- **Dynamic Language Switching**: Real-time language changes
- **RTL Support**: Right-to-left text direction support
- **Locale Persistence**: Remembers user language preferences

### 📊 Data Management
- **Advanced Tables**: Sortable, filterable, and paginated data tables
- **Form Builder**: Dynamic form generation with validation
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Visualization**: Charts and graphs with ECharts integration
- **Export Features**: Excel and PDF export capabilities

### 🛠️ Development Experience
- **TypeScript**: Full type safety and IntelliSense support
- **Hot Module Replacement**: Fast development with Vite
- **Code Quality**: ESLint, Prettier, and Stylelint configuration
- **Git Hooks**: Pre-commit hooks with Husky for code quality
- **Component Generation**: Plop.js templates for rapid development

### 🎯 Advanced Features
- **PWA Ready**: Progressive Web App capabilities
- **Code Splitting**: Optimized bundle splitting for performance
- **Error Handling**: Comprehensive error boundary and 404 pages
- **Print Support**: Built-in printing functionality
- **Watermark**: Dynamic watermark system
- **Lock Screen**: Security lock screen feature

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.1.0 (recommended package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/turahe/admin-vue.git
cd admin-vue

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
# Build for production
pnpm build:pro

# Build for development environment
pnpm build:dev

# Build for testing environment
pnpm build:test

# Preview production build
pnpm serve:pro
```

## 📁 Project Structure

```
admin-vue/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service modules
│   ├── assets/            # Static resources (images, icons)
│   ├── axios/             # HTTP client configuration
│   ├── components/        # Reusable Vue components
│   ├── constants/         # Application constants
│   ├── directives/        # Vue custom directives
│   ├── hooks/             # Vue composition functions
│   ├── layout/            # Layout components
│   ├── locales/           # Internationalization files
│   ├── plugins/           # Vue plugins configuration
│   ├── router/            # Vue Router configuration
│   ├── store/             # Pinia state management
│   ├── styles/            # Global styles (Less/CSS)
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   ├── App.vue            # Root component
│   └── main.ts            # Application entry point
├── types/                 # TypeScript type definitions
├── scripts/               # Build and utility scripts
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create environment files for different modes:

```bash
# .env.base (development)
VITE_APP_TITLE=Vue Element Plus Admin
VITE_API_BASE_PATH=/api
VITE_DROP_CONSOLE=false
VITE_DROP_DEBUGGER=false

# .env.pro (production)
VITE_APP_TITLE=Vue Element Plus Admin
VITE_API_BASE_PATH=/api
VITE_DROP_CONSOLE=true
VITE_DROP_DEBUGGER=true
```

### API Configuration

Configure your backend API in `src/axios/service.ts`:

```typescript
// Update the base URL for your API
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

// Configure proxy for development in vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-server:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 🎨 Customization

### Theme Configuration

Customize the application theme in `src/store/modules/app.ts`:

```typescript
theme: {
  elColorPrimary: '#409eff',        // Primary color
  leftMenuBgColor: '#001529',       // Sidebar background
  topHeaderBgColor: '#fff',         // Header background
  // ... more theme options
}
```

### Adding New Components

Use the built-in component generator:

```bash
# Generate a new component
pnpm p
# Select "component" and follow the prompts
```

### Icons

Generate icon sets from Iconify collections:

```bash
# Run the icon generator
pnpm icon
# Select an icon set and generate TypeScript definitions
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build:pro` | Build for production |
| `pnpm build:dev` | Build for development |
| `pnpm build:test` | Build for testing |
| `pnpm serve:pro` | Preview production build |
| `pnpm lint:eslint` | Run ESLint |
| `pnpm lint:format` | Format code with Prettier |
| `pnpm lint:style` | Lint styles with Stylelint |
| `pnpm ts:check` | Type check with TypeScript |
| `pnpm icon` | Generate icon definitions |
| `pnpm p` | Generate components with Plop |

## 🧩 Key Components

### Layout System
- **Classic Layout**: Traditional sidebar + header layout
- **Top Layout**: Horizontal navigation layout
- **Mobile Layout**: Responsive mobile-optimized layout

### Form Components
- **Dynamic Forms**: JSON-driven form generation
- **Validation**: Comprehensive form validation
- **Custom Components**: Enhanced form controls

### Table Components
- **Data Tables**: Advanced data grid with sorting, filtering
- **Virtual Scrolling**: Performance optimization for large datasets
- **Export Functions**: Built-in data export capabilities

### Chart Components
- **ECharts Integration**: Professional data visualization
- **Responsive Charts**: Adaptive chart sizing
- **Custom Themes**: Chart theming system

## 🔒 Authentication Flow

The application implements a comprehensive authentication system:

1. **Login Process**: JWT token-based authentication
2. **Route Guards**: Protected routes with permission checking
3. **Token Management**: Automatic token refresh and storage
4. **Role Permissions**: Dynamic route generation based on user roles
5. **Logout Handling**: Secure logout with token cleanup

## 🌐 API Integration

### HTTP Client Features
- **Axios Configuration**: Pre-configured HTTP client
- **Request Interceptors**: Automatic authentication headers
- **Response Interceptors**: Error handling and data transformation
- **Request Cancellation**: Automatic cleanup of pending requests
- **Laravel Compatibility**: Optimized for Laravel backend APIs

### Error Handling
- **Global Error Handling**: Centralized error management
- **User Feedback**: Toast notifications for API responses
- **Retry Logic**: Automatic retry for failed requests
- **Offline Detection**: Network status monitoring

## 🎯 Performance Optimizations

- **Code Splitting**: Route-based and vendor code splitting
- **Tree Shaking**: Unused code elimination
- **Lazy Loading**: Dynamic import for routes and components
- **Asset Optimization**: Image compression and CDN support
- **Bundle Analysis**: Built-in bundle size analysis

## 🧪 Testing & Quality

### Code Quality Tools
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Stylelint**: CSS/Less linting
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Conventional commit message validation

### Type Safety
- **TypeScript**: Full type coverage
- **API Types**: Generated type definitions for API responses
- **Component Props**: Strict prop type checking
- **Store Typing**: Typed Pinia stores

## 📖 Documentation

- **Code Documentation**: Comprehensive JSDoc comments
- **Component Storybook**: Interactive component documentation
- **API Documentation**: OpenAPI/Swagger integration
- **Development Guide**: Step-by-step development instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://element-plus-admin-doc.cn/](https://element-plus-admin-doc.cn/)
- **Issues**: [GitHub Issues](https://github.com/turahe/admin-vue/issues)
- **Discussions**: [GitHub Discussions](https://github.com/turahe/admin-vue/discussions)

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Element Plus](https://element-plus.org/) - Vue 3 UI Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with Syntax for Types
- [Iconify](https://iconify.design/) - Universal Icon Framework

---

**Built with ❤️ by developers, for developers.**
