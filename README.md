# Emporium Rewards – Frontend

This is the frontend for **Emporium Rewards**, a full-stack customer loyalty program built for Smoke Emporium in Gainesville, Florida. It allows customers to view their reward points and info, and provides a secure admin dashboard for managing customer records in real time.

---

## Tech Stack

- **React** – Frontend framework  
- **TypeScript** – Safer JS with strong typing  
- **Vite** – Fast dev/build tooling  
- **Zustand** – Lightweight state management  
- **Supabase Auth** – For admin login  
- **Tailwind CSS** (removed, in favor of manual CSS)  
- **Vercel** – Deployed frontend

---

## Features

### Public View (Customers)
- Customer point lookup via name, email, or phone

### Admin Dashboard
- Secure login via Supabase JWT  
- View and search customer records  
- Edit customer name, phone, email, and notes  
- Add or subtract points  
- View and filter admin logs  
- Download customer data as CSV  
- Add and delete customers

---

## Security

- Token-based access control for admin-only features  
- JWT validated via backend `/is-admin` endpoint  
- Frontend securely stores and attaches auth tokens  
- Future support for admin role management and 2FA planned

---

## Setup & Usage

### 1. Clone the Repo
- git clone https://github.com/henryharborne/Emporium-Rewards--frontend.git
- cd Emporium-Rewards--frontend

### 2. Install Dependencies
 - npm install

### 3. Environment Variables
 - Create a .env file in the root directory with the following: VITE_API_BASE_URL=http://localhost:4000 (replace with deployed backend URL if using Render).

### 4. Run the Development Server
 - npm run dev (app runs on http://localhost:5173 by default)

## Live Demo
 - Check it out at: https://emporium-rewards.vercel.app

## Project Structure
/src
  /components      → Reusable UI components
  /pages           → Home, Dashboard, etc.
  /store           → Zustand state management
  /utils           → Helpers and API calls
  App.tsx          → Routing
  main.tsx         → Entry point

## Author
 - Henry Harborne
 - Senior CS Major @ University of Florida
 - Focused on full-stack development, cybersecurity, and DevOps
