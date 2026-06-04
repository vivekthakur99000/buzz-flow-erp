# Buzz Flow ERP

Full-stack ERP application (server + client) for small businesses. This repository contains a TypeScript Node/Express server and a Vite + React + TypeScript client.

## Table of Contents
- Project Overview
- Features
- Tech Stack
- Repo Structure
- Prerequisites
- Installation
  - Server
  - Client
- Environment Variables
- Running Locally
- API Overview
- Database
- Contributing
- License & Contact

## Project Overview

Buzz Flow ERP is an enterprise resource planning application that includes modules for authentication, employees, HR, inventory, payroll, sales, and more. The server exposes REST endpoints and uses MongoDB as its data store. The client is built with React + TypeScript and communicates with the server API.

## Features

- Authentication (JWT)
- Employee management and profiles
- HR portal and leave requests
- Inventory and product management
- Payroll processing
- Dashboard and analytics

## Tech Stack

- Server: Node.js, TypeScript, Express, Mongoose
- Client: React, TypeScript, Vite
- Database: MongoDB (mongoose)
- Auth: JSON Web Tokens (JWT)

## Repo Structure

- `server/` — Express API written in TypeScript
- `client/` — React + Vite frontend

Example notable server folders:

- `server/src/controller/` — controllers for resources
- `server/src/models/` — Mongoose models
- `server/src/routes/` — API route definitions
- `server/src/config/db.ts` — DB connection

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB connection (Atlas or self-hosted)

## Installation

Clone the repo and install dependencies for both server and client:

```bash
git clone <repo-url>
cd buzz-flow-erp

# Server
cd server
npm install

# In another terminal: Client
cd ../client
npm install
```

## Environment Variables

Create a `.env` file in the `server/` folder with the following variables (values from your environment):

- `PORT` — HTTP port the server listens on (e.g. `5000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key used to sign JWT tokens

Example (do NOT commit secrets):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
```

Note: This repository's current `server/.env` contains `PORT`, `MONGO_URI`, and `JWT_SECRET` entries used by `server/src/config/db.ts` to connect to MongoDB.

## Running Locally

Server (development):

```bash
cd server
npm run dev
```

Client (development):

```bash
cd client
npm run dev
```

Build for production:

```bash
# Client
cd client
npm run build

# Serve built client with your preferred static server or integrate into server
```

## API Overview

The server exposes RESTful endpoints organized under `server/src/routes/`. Major routes include:

- `user.routes.ts` — auth and user endpoints
- `employeeProfile.routes.ts` — employee profile operations
- `product.routes.ts` — inventory/product endpoints
- `order.routes.ts` — order-related endpoints

To explore endpoints quickly, open the route files under `server/src/routes/`.

## Database

This project uses MongoDB via Mongoose. Connection is initialized in `server/src/config/db.ts` using `process.env.MONGO_URI`.

If you need to seed the database or run migrations, add scripts or utility scripts under `server/src/jobs/` or a `scripts/` folder and document them here.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes and push: `git push origin feature/your-feature`
4. Open a pull request describing your changes

Please follow the existing code style and add tests for new features where possible.

## License & Contact

Specify a license for the project (e.g., MIT). Add contact information or a link to an issue tracker for questions.

---

If you'd like, I can also:

- Add example `.env.example` files for both server and client
- Add scripts for database seeding or a Postman/Insomnia collection for API testing
- Create a short CONTRIBUTING.md and CODE_OF_CONDUCT.md

Please tell me which additions you want next.
