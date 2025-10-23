# app_marcus

效仿 Marcus Aurelius 在戰爭與權力中反思自身傲慢，深懊悔過去對權勢與榮耀的執著，轉而修煉內在理性與道德。

## Project Structure

This is a modern fullstack application with the following architecture:

```
app_marcus/
├── backend/          # NestJS backend application
├── frontend/         # Frontend application (to be implemented)
├── .github/
│   └── workflows/    # GitHub Actions CI/CD pipelines
└── README.md
```

## Technology Stack

- **Backend**: NestJS v10.x (Node.js v20.x)
- **CI/CD**: GitHub Actions
- **Frontend**: To be determined

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Backend Development

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm test

# Build for production
npm run build
```

### Root Level Commands

```bash
# Backend development
npm run backend:dev

# Backend build
npm run backend:build

# Backend tests
npm run backend:test

# Backend lint
npm run backend:lint
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- Runs on push to `main` and `develop` branches
- Runs on pull requests to `main` and `develop` branches
- Tests and builds backend automatically
- Frontend pipeline ready to be enabled when implemented

## License

ISC
