# YouApp Backend – Technical Challenge

Backend service for **YouApp Technical Test**, built with **NestJS**, **MongoDB**, **JWT Authentication**, and **RabbitMQ**

---

## 🚀 Tech Stack

- **Node.js**
- **NestJS**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **RabbitMQ (Message Queue)**
- **Socket.IO (Real-time Chat)**
- **Docker & Docker Compose**
- **Jest (Unit Testing)**
- **Swagger (API Documentation)**

---

## 🧩 Features

### Authentication
- Register (email, username, password, confirm password)
- Login using **username or email**
- JWT-based authentication

### Profile
- Create / Get / Update profile

### Chat System
- 1-to-1 text chat
- View messages
- Send messages
- Real-time notification using **RabbitMQ**
- Socket-ready architecture

---

## 📦 Installation

### Clone Repository
```bash
git clone https://github.com/adimasistiawan/youapp-backend.git
cd youapp-backend
```

### Environment Variables
Create .env file:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/youapp
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1d
RABBITMQ_URL=amqp://localhost:5672
```

### Run with Docker
```bash
docker-compose up --build
```

### Run Locally (Without Docker)
```bash
npm install
npm run start:dev
```
