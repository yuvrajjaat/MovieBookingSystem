# MovieBook - Cinema Booking System

A modern, real-time movie booking platform that allows users to browse cinemas, select showtimes, and book seats with live seat availability updates. Built with Next.js and Socket.io for seamless user experience.

---

## 📑 Table of Contents
- About
- Features
- Tech Stack
- Screenshots
- Installation
- Usage
- API Endpoints

---

## 📖 About

MovieBook is a full-stack cinema booking application designed to solve the common problems faced when booking movie tickets online:

- **Real-time seat blocking**: Prevents double bookings with temporary seat reservations
- **Live updates**: See seat availability changes in real-time as other users book
- **Simple interface**: Clean, intuitive design for easy navigation
- **Multi-cinema support**: Browse multiple cinema locations and their showtimes

**Target Audience**: Cinema operators, movie enthusiasts, and anyone looking for a hassle-free movie booking experience.

---

## ✨ Features

- 🎭 **Cinema Management**: Browse multiple cinema locations
- 🎬 **Movie Listings**: View movies with descriptions and showtimes  
- 💺 **Interactive Seat Selection**: Visual seat map with real-time availability
- 🔒 **Seat Blocking**: Temporary seat reservations prevent conflicts
- ⚡ **Real-time Updates**: Live seat status using WebSocket connections
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 📋 **Booking History**: Track all your past movie bookings
- 🎫 **Booking Confirmation**: Instant booking confirmations with details

---

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 - React framework for production
- Socket.io Client - Real-time communication
- CSS3 - Custom styling with CSS variables

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web application framework
- Socket.io - Real-time bidirectional communication
- Sequelize ORM - Database object-relational mapping

**Database:**
- MySQL - Relational database for data persistence

**Development Tools:**
- npm - Package management
- Nodemon - Development server auto-restart

---

## 📸 Screenshots

### 🏠 Home Page - Cinema Selection
<img width="1485" height="751" alt="Screenshot 2025-09-21 134214" src="https://github.com/user-attachments/assets/0d2be299-2a7e-4003-bc65-44b855f81d31" />


*Browse available cinemas in your area*

### 🎬 Cinema Page - Movie Listings
<img width="1468" height="753" alt="Screenshot 2025-09-21 134230" src="https://github.com/user-attachments/assets/49aa63fd-2623-4905-8650-90eb1ffc2232" />


*View movies and showtimes for selected cinema*

### 💺 Seat Selection - Interactive Booking
<img width="1294" height="843" alt="Screenshot 2025-09-21 134414" src="https://github.com/user-attachments/assets/7f98856f-fd1b-4d27-bb44-6311c9c0e11a" />


*Select seats with real-time availability updates*

### 📋 Booking History
<img width="1340" height="855" alt="Screenshot 2025-09-21 134443" src="https://github.com/user-attachments/assets/cb0203a4-99c7-4789-a904-32105c625a52" />


*Track your movie booking history*

---

## ⚙️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm
- PostgreSQL/MySQL database

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/moviebook.git
cd moviebook
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Database Setup:**
```bash
# Create database
createdb moviebook

# Update database configuration in backend/src/models/index.js
```

5. **Environment Variables:**
Create `.env` file in backend directory:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moviebook
DB_USER=your_username
DB_PASS=your_password
```

6. **Seed Database:**
```bash
cd backend
node seed.js
```

---

## ▶️ Usage

### Starting the Application

1. **Start the backend server:**
```bash
cd backend
npm start
```
Server runs on `http://localhost:4000`

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Using the Application

1. **Browse Cinemas**: Visit the home page to see available cinemas
2. **Select Cinema**: Click on a cinema to view movies and showtimes
3. **Choose Showtime**: Select your preferred movie and showtime
4. **Select Seats**: 
   - Click on available (green) seats to select them
   - Selected seats turn blue and are temporarily blocked for others
   - Maximum 6 seats per booking
5. **Confirm Booking**: Click "Confirm Booking" to finalize your reservation
6. **View History**: Check "My Bookings" to see your booking history

### Seat Status Legend
- 🟢 **Available**: Ready to book
- 🔵 **Selected**: Chosen by you
- 🟡 **Blocked**: Temporarily reserved by another user
- 🔴 **Booked**: Already purchased

---

## 🔌 API Endpoints

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id/screens/shows` - Get shows for cinema

### Movies & Shows
- `GET /api/shows/:id` - Get show details
- `GET /api/shows/:id/booked-seats` - Get booked seats for show

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/users/:id/bookings` - Get user bookings

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details

### WebSocket Events
- `joinShow` - Join show room for real-time updates
- `blockSeats` - Temporarily block selected seats
- `unblockSeats` - Release blocked seats
- `seatsBlocked` - Broadcast when seats are blocked
- `seatsUnblocked` - Broadcast when seats are released
- `seatsBooked` - Broadcast when booking is confirmed

---

## 📝 Project Structure

```
moviebook/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express server setup
│   ├── package.json
│   └── seed.js              # Database seeding
├── frontend/
│   ├── pages/               # Next.js pages
│   ├── lib/                 # API utilities
│   ├── styles/              # CSS styles
│   └── package.json
└── README.md
```

---

## 👥 Authors

- **Yuvraj Singh** - *Initial work* - [YourGitHub](https://github.com/yuvrajjaat)

---
