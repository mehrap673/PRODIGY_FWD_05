# 🌟 SocialHub - Modern Social Media Platform

Full-stack social media application with real-time messaging, stories, and analytics.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 📱 Posts with image/video uploads (Cloudinary)
- 💬 Real-time messaging with Socket.io
- 📸 24-hour Stories
- 👥 Follow system & User profiles
- 🔔 Real-time notifications
- 📊 Analytics dashboard with charts
- 🌓 Dark/Light mode
- 📱 Fully responsive design
- 🔍 Search & Explore with trending posts

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Socket.io Client  
**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, Cloudinary  
**Tools:** Mongoose, Multer, Bcrypt, Recharts, Axios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

### Installation

**1. Clone & Install**
git clone https://github.com/yourusername/socialhub.git
cd socialhub

Backend
cd backend
npm install

Frontend (new terminal)
cd frontend
npm install

text

**2. Environment Variables**

Create `backend/.env`:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialhub
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

text

**3. Run Application**
Backend (from backend folder)
npm run dev

Frontend (from frontend folder)
npm run dev

text

Visit `http://localhost:5173`

## 📁 Project Structure

socialhub/
├── backend/
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & uploads
│ ├── socket/ # Socket.io handlers
│ └── server.js # Entry point
│
└── frontend/
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Route pages
│ ├── context/ # React context
│ └── utils/ # Helper functions
└── tailwind.config.js

text

## 📸 Screenshots
# 🌟 SocialHub - Modern Social Media Platform

Full-stack social media application with real-time messaging, stories, and analytics.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 📱 Posts with image/video uploads (Cloudinary)
- 💬 Real-time messaging with Socket.io
- 📸 24-hour Stories
- 👥 Follow system & User profiles
- 🔔 Real-time notifications
- 📊 Analytics dashboard with charts
- 🌓 Dark/Light mode
- 📱 Fully responsive design
- 🔍 Search & Explore with trending posts

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Socket.io Client  
**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, Cloudinary  
**Tools:** Mongoose, Multer, Bcrypt, Recharts, Axios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

### Installation

**1. Clone & Install**
git clone https://github.com/yourusername/socialhub.git
cd socialhub

Backend
cd backend
npm install

Frontend (new terminal)
cd frontend
npm install

text

**2. Environment Variables**

Create `backend/.env`:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialhub
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

text

**3. Run Application**
Backend (from backend folder)
npm run dev

Frontend (from frontend folder)
npm run dev

text

Visit `http://localhost:5173`

## 📁 Project Structure

socialhub/
├── backend/
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & uploads
│ ├── socket/ # Socket.io handlers
│ └── server.js # Entry point
│
└── frontend/
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Route pages
│ ├── context/ # React context
│ └── utils/ # Helper functions
└── tailwind.config.js

text

## 📸 Screenshots

![Home Feed](./screenshots/Home.png)
![Profile](./screenshots/Profile.png)
![Messages](./screenshots/Messages.png)

## 🚢 Deployment

**Backend (Render/Heroku):**
Set environment variables on platform
Deploy via Git push
text

**Frontend (Vercel/Netlify):**
npm run build

Deploy build folder



---

⭐ Star this repo if you found it helpful!

## 🚢 Deployment

**Backend (Render/Heroku):**
Set environment variables on platform
Deploy via Git push
text

**Frontend (Vercel/Netlify):**
npm run build

Deploy build folder




## 👨‍💻 Author

**Your Name**  
Pankaj Mehra

---

⭐ Star this repo if you found it helpful