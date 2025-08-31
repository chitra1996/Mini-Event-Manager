# Mini Event Manager

A full-stack event management application built with NestJS (backend) and Next.js (frontend).

## Features

- **Event Management**: Create, View & Edit events
- **Attendee Management**: Register and manage attendees for events
- **Real-time Updates**: Add & Remove attendees from events with live updates
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Toast Notifications**: User-friendly notifications instead of alerts

## Prerequisites

- Node.js 18+ 
- Yarn package manager
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mini-Event-Manager
```

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Start development server**:
   ```bash
   yarn start:dev
   ```

The backend will be available at http://localhost:3001

### 3. Frontend Setup

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Start development server**:
   ```bash
   yarn dev
   ```

The frontend will be available at http://localhost:3000/events

## API Endpoints

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Attendees
- `GET /attendees` - Get all attendees
- `GET /attendees/:id` - Get attendee by ID
- `POST /attendees` - Create new attendee
- `PUT /attendees/:id` - Update attendee
- `DELETE /attendees/:id` - Delete attendee

## Project Structure

```
Mini-Event-Manager/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── events/         # Event-related modules
│   │   ├── attendees/      # Attendee-related modules
│   │   └── main.ts         # Application entry point
│   ├── package.json
│   └── yarn.lock
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── pages/         # Next.js pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript type definitions
│   ├── package.json
│   └── yarn.lock
└── README.md
```

## Technologies Used

### Backend
- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe JavaScript
- **Cache Manager**: In-memory caching
- **CORS**: Cross-origin resource sharing

### Frontend
- **Next.js**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Moment.js**: Date manipulation
- **UUID**: Unique identifier generation

## Development Scripts

### Backend Scripts
```bash
cd backend
yarn start:dev    # Start development server with hot reload
yarn build        # Build for production
yarn start:prod   # Start production server
yarn lint         # Run ESLint
```

### Frontend Scripts
```bash
cd frontend
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Stop any existing services on ports 3000 and 3001
   - Check for running Node.js processes: `ps aux | grep node`

2. **Dependencies not found**:
   - Delete `node_modules` and `yarn.lock`
   - Run `yarn install` again

3. **Frontend can't connect to backend**:
   - Ensure backend is running on port 3001
   - Check CORS configuration in backend
   - Verify network connectivity

4. **Build errors**:
   - Clear cache: `yarn cache clean`
   - Delete `node_modules` and reinstall dependencies
   - Check TypeScript errors: `yarn tsc --noEmit`

### Getting Help

1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure both servers are running simultaneously
4. Check that ports 3000 and 3001 are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.