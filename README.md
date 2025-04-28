# Book Management System

A full-stack book management system with React components and JSX validation.

## Project Structure

- **Frontend**: React with JSX validation, TailwindCSS
- **Backend**: Express API with JSX-compatible responses

## Features

- Book management (add, edit, delete)
- Form validation with JSX error elements
- Book borrowing system
- Responsive UI with Tailwind CSS

## Key Components

### Validator (Validator.jsx)

- JSX-powered validation hooks
- ISBN format validation
- Date comparison validation
- Conditional validation for academic books
- Data transformation utilities

### React UI Components

- BookDashboard (main layout)
- BookList with BookCard items
- AddBookModal for new books
- EditBookForm for modifying books
- UserManagement for borrowing/returning

### API

- Express routes with JSX-style error responses
- Shared validation between frontend and backend

## Running the Project

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
cd client
npm install
```

### Development

Run both backend and frontend:

```
npm run dev:all
```

Or separately:

- Backend: `npm run dev`
- Frontend: `cd client && npm start`

### Production Build

```
cd client
npm run build
cd ..
npm start
```

## Implementation Details

### Validation System

The validation system is built to work in both React and Node.js environments:

- In React: Returns JSX elements for error display
- In Node.js: Returns error messages to render on client-side

### State Management

- Uses useReducer and useContext hooks
- Centralized state for books and borrowed items
- Form state validation with error displays

### Responsive Design

- Tailwind CSS utility classes
- Mobile-first approach with responsive breakpoints 