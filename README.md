# 🚚 LastMile Delivery Tracker

**Developed by:** Anshika Chaurasia  
**Email:** anshikachaurasia99@gmail.com  
© 2026 All Rights Reserved

## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** React (Vite)
- **Database:** PostgreSQL (Railway)
- **Auth:** JWT (Role-based: customer / agent / admin)

## Setup Guide

### Backend
cd lastmile-backend
npm install
cp .env.example .env
npm run dev

### Frontend
cd lastmile-frontend
npm install
npm run dev

## .env.example
DATABASE_URL=your_railway_postgres_url
JWT_SECRET=your_secret_key
EMAIL=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000

## API Endpoints

### Auth
- POST /auth/register - Register user
- POST /auth/login - Login user

### Orders
- POST /orders/calculate-charge - Preview charge
- POST /orders/create - Create order
- GET /orders/my-orders - Get my orders
- GET /orders/:id/tracking - Get tracking timeline
- POST /orders/:id/reschedule - Reschedule failed order

### Admin
- POST /admin/zones - Create zone
- POST /admin/areas - Create area
- POST /admin/rate-cards - Create rate card
- GET /admin/orders - Get all orders
- PUT /admin/orders/:id/status - Override status
- POST /admin/orders/:id/assign-agent - Manual assign
- POST /admin/orders/:id/auto-assign - Auto assign

### Agent
- GET /agent/orders - Get my deliveries
- PUT /agent/orders/:id/status - Update status
- PUT /agent/location - Update location

## DB Schema
- users - id, name, email, password, role
- zones - id, name
- areas - id, name, zone_id
- rate_cards - id, zone_from, zone_to, order_type, rate_per_kg, cod_surcharge
- agents - id, user_id, zone_id, is_available, lat, lng
- orders - id, customer_id, agent_id, dimensions, weights, charge, status
- tracking_logs - id, order_id, status, changed_by, timestamp

## Rate Calculation Logic
1. Volumetric Weight = L x B x H / 5000
2. Billed Weight = max(actual_weight, volumetric_weight)
3. Charge = Billed Weight x rate_per_kg
4. If COD: Charge += cod_surcharge