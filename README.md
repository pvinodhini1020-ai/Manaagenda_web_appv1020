# Frontend Setup Guide - Manaagenda Web App

## Prerequisites
- Node.js 18 or higher
- npm or yarn
- Backend API running on `https://vinodhini-software-api.onrender.com/api`

## Quick Start

### 1. Navigate to Frontend Directory
```bash
cd Manaagenda_web_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of `Manaagenda_web_app`:

```env
# API Configuration
VITE_API_BASE_URL=https://vinodhini-software-api.onrender.com/api
```

### 4. Start Development Server
```bash
npm run dev
```

The application will start on `https://software-management-portal-delta.vercel.app/login`

## Verify Installation

Open your browser and navigate to:
```
https://software-management-portal-delta.vercel.app/login
```

You should see the login page.

## Project Structure
```
Manaagenda_web_app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   └── ...
│   ├── services/           # API service functions
│   │   └── api.ts
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS config
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Test Login Credentials

### Admin Account
- **Email**: `admin@vinodhini.com`
- **Password**: `Password@123`
- **Access**: Full system access

### Employee Account
- **Email**: `employee@vinodhini.com`
- **Password**: `Password@123`
- **Access**: Assigned projects, messaging

### Client Account
- **Email**: `client@vinodhini.com`
- **Password**: `Password@123`
- **Access**: Service requests, project viewing

## Key Features by Role

### Admin Dashboard
- User management (employees & clients)
- Project creation and assignment
- Service request approval
- System statistics and analytics

### Employee Dashboard
- View assigned projects
- Project messaging
- Task management
- Profile updates

### Client Dashboard
- Submit service requests
- View project status
- Project communication
- Profile management

## Technology Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `https://vinodhini-software-api.onrender.com/api`
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Port Already in Use
Vite will automatically use the next available port (8082, 8083, etc.)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues
- Clear browser localStorage
- Verify backend JWT configuration
- Check network tab for API responses

## Development Tips

### Hot Module Replacement
Vite provides instant HMR - changes appear immediately without full page reload

### Component Development
- UI components are in `src/components/ui/`
- Use existing shadcn/ui components for consistency
- Follow TypeScript best practices

### API Integration
- All API calls go through `src/services/api.ts`
- Authentication token is automatically included
- Error handling is centralized

## Build for Production

### Create Production Build
```bash
npm run build
```

Output will be in the `dist/` folder

### Deploy to Hosting
Upload the `dist/` folder to:
- Vercel

### Environment Variables for Production
Update `.env` with production API URL:
```env
VITE_API_BASE_URL=https://vinodhini-software-api.onrender.com/api
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization
- Code splitting enabled by default
- Lazy loading for routes
- Optimized bundle size
- Tree shaking enabled
