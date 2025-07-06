# Finlo - Backend API

A Node.js/Express.js backend API for the React Native Finlo application, providing transaction management and financial data services.

## 🚀 Features

- **Transaction Management**: Create, read, and delete financial transactions
- **User-based Data**: Transactions are organized by user ID (Clerk authentication)
- **Financial Summary**: Calculate income, expenses, and balance per user
- **Rate Limiting**: Upstash Redis-based rate limiting for API protection
- **Database**: PostgreSQL with Neon serverless database
- **Health Monitoring**: Cron job for uptime monitoring
- **Production Ready**: Environment-based configuration and cron job scheduling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)
- Upstash Redis account
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL=postgresql://username:password@host:port/database

   # Upstash Redis Configuration
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

   # API URL for cron health checks (production only)
   API_URL=https://your-deployed-api-url.com/api/health
   ```

4. **Database Setup**
   The database tables will be automatically created when the server starts. The application uses PostgreSQL with the following schema:
   
   ```sql
   CREATE TABLE transactions (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL,
     title VARCHAR(255) NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     category VARCHAR(255) NOT NULL,
     created_at DATE NOT NULL DEFAULT CURRENT_DATE
   );
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
This starts the server in production mode with cron job health monitoring enabled.

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns server status for health monitoring.

**Response:**
```json
{
  "status": "ok"
}
```

#### Get User Transactions
```http
GET /api/transactions/:user_id
```
Retrieve all transactions for a specific user.

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "user_123",
    "title": "Grocery Shopping",
    "amount": -45.50,
    "category": "Food",
    "created_at": "2024-01-15"
  }
]
```

#### Create Transaction
```http
POST /api/transactions
```

**Request Body:**
```json
{
  "user_id": "user_123",
  "title": "Salary",
  "amount": 3000.00,
  "category": "Income"
}
```

**Response:**
```json
{
  "id": 2,
  "user_id": "user_123",
  "title": "Salary",
  "amount": 3000.00,
  "category": "Income",
  "created_at": "2024-01-15"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
```
Delete a specific transaction by ID.

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

#### Get User Financial Summary
```http
GET /api/transactions/summary/:userId
```
Get financial summary (income, expenses, balance) for a specific user.

**Response:**
```json
{
  "balance": 2954.50,
  "income": 3000.00,
  "expenses": 45.50
}
```

## 🛡️ Security Features

### Rate Limiting
The API implements rate limiting using Upstash Redis to prevent abuse:
- Applied to all routes
- Configurable limits per IP address
- Returns 429 status code when limits are exceeded

### Environment Variables
Sensitive data is stored in environment variables:
- Database credentials
- Redis connection details
- API URLs

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Cache/Rate Limiting**: Upstash Redis
- **Environment Management**: dotenv
- **Development**: nodemon
- **Scheduling**: node-cron

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Database connection and initialization
│   │   ├── upstash.js      # Redis configuration for rate limiting
│   │   └── cron.js         # Health check cron job
│   ├── controllers/
│   │   └── transactionsController.js  # Business logic for transactions
│   ├── middleware/
│   │   └── rateLimiter.js  # Rate limiting middleware
│   ├── routes/
│   │   └── transactionsRoutes.js      # API route definitions
│   └── server.js           # Main application entry point
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production
Make sure to set the following environment variables in your production environment:
- `NODE_ENV=production`
- `PORT` (usually provided by hosting platform)
- `DATABASE_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `API_URL` (your deployed API URL for health checks)

### Health Monitoring
In production mode, the application runs a cron job every 14 minutes to ping the health endpoint, helping prevent server sleep on platforms like Render, Heroku, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

Built with ❤️ for the React Native Wallet application.
