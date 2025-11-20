# E-Commerce Order Management System

A full-stack order management system built with Node.js, React (Next.js), and PostgreSQL. This application allows users to create, view, edit, and delete orders with multiple product selections.

## Video Demonstration  
- https://drive.google.com/file/d/1JH_iE_lSiNX3IoN-Fj42pCtzkVWiqrwW/view?usp=sharing

## Features

- **Order Management**: Create, read, update, and delete orders
- **Product Selection**: Multi-select products for each order
- **Search Functionality**: Filter orders by ID or description
- **Responsive UI**: Modern, clean interface with Tailwind CSS
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API calls
- **Delete Confirmation**: Modal confirmation before deleting orders
- **REST API**: Well-structured RESTful API endpoints
- **Database Migrations**: Version-controlled database schema
- **UID System**: Unique 13-character alphanumeric identifiers for relationships
- **Comprehensive Tests**: Unit and integration tests with Jest

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **express-validator** - Request validation middleware
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Create React App** - React toolchain
- **Axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **Custom CSS** - Clean, responsive styling

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

## Project Structure

```
order-management-check-ministry/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── orderController.js   # Order business logic
│   │   └── productController.js # Product business logic
│   ├── database/
│   │   ├── schema.sql           # Database schema
│   │   ├── migrate.js           # Migration script
│   │   └── seed.js              # Seed data script
│   ├── models/
│   │   ├── orderModel.js        # Order data access layer
│   │   └── productModel.js      # Product data access layer
│   ├── routes/
│   │   ├── orderRoutes.js       # Order API routes
│   │   └── productRoutes.js     # Product API routes
│   ├── utils/
│   │   ├── errorHandler.js      # Error handling utilities
│   │   ├── responseHandler.js   # Response formatting utilities
│   │   └── uidGenerator.js      # UID generation utility
│   ├── validators/
│   │   └── orderValidator.js    # Request validation rules
│   └── server.js                # Express app entry point
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── OrderList.js     # Orders list page
│   │   │   ├── CreateOrder.js   # Create order page
│   │   │   └── EditOrder.js     # Edit order page
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── SearchBar.js
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance with interceptors
│   │   │   ├── orderService.js  # Order API service
│   │   │   └── productService.js # Product API service
│   │   ├── App.js               # Main app with routing
│   │   ├── App.css              # App styles
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Global styles
│   └── package.json
├── tests/
│   ├── unit/                    # Unit tests
│   │   ├── uidGenerator.test.js
│   │   ├── errorHandler.test.js
│   │   └── responseHandler.test.js
│   └── integration/             # Integration tests
│       ├── orders.test.js
│       └── products.test.js
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

## Database Schema

### orders Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| uid | VARCHAR(13) | UNIQUE, NOT NULL |
| order_description | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### products Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY |
| uid | VARCHAR(13) | UNIQUE, NOT NULL |
| product_name | VARCHAR(100) | NOT NULL |
| product_description | TEXT | - |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### order_product_map Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| order_uid | VARCHAR(13) | FK → orders.uid, NOT NULL |
| product_uid | VARCHAR(13) | FK → products.uid, NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Note**: The `id` column is SERIAL (auto-increment) and serves as the internal database primary key. The `uid` column is a unique 13-character alphanumeric identifier used for all API operations and foreign key relationships. This design:
- Avoids exposing sequential IDs in URLs
- Prevents gaps in user-visible identifiers when records are deleted
- Provides better security by not revealing record counts
- Allows portable identifiers across different environments

### SQL Table Creation Queries

Below are the complete SQL queries to create all tables. These are automatically executed when you run `npm run db:setup`.

#### 1. Create products Table

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment
COMMENT ON TABLE products IS 'Stores product catalog';
COMMENT ON COLUMN products.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
```

#### 2. Create orders Table

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    order_description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add comment
COMMENT ON TABLE orders IS 'Stores customer orders';
COMMENT ON COLUMN orders.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
```

#### 3. Create order_product_map Table (Junction Table)

```sql
CREATE TABLE order_product_map (
    id SERIAL PRIMARY KEY,
    order_uid VARCHAR(13) NOT NULL,
    product_uid VARCHAR(13) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_uid) REFERENCES orders(uid) ON DELETE CASCADE,
    FOREIGN KEY (product_uid) REFERENCES products(uid) ON DELETE CASCADE,
    UNIQUE(order_uid, product_uid)
);

-- Add comment
COMMENT ON TABLE order_product_map IS 'Junction table mapping orders to products (many-to-many relationship)';
```

#### 4. Create Indexes for Performance

```sql
-- Indexes on orders table
CREATE INDEX idx_orders_uid ON orders(uid);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Indexes on products table
CREATE INDEX idx_products_uid ON products(uid);

-- Indexes on order_product_map table
CREATE INDEX idx_order_product_map_order_uid ON order_product_map(order_uid);
CREATE INDEX idx_order_product_map_product_uid ON order_product_map(product_uid);
```

#### 5. Insert Seed Data (4 Products)

```sql
INSERT INTO products (id, uid, product_name, product_description) VALUES
(1, 'P1ABCDEFGHIJK', 'HP laptop', 'This is HP laptop'),
(2, 'P2LMNOPQRSTUV', 'lenovo laptop', 'This is lenovo'),
(3, 'P3WXYZ0123456', 'Car', 'This is Car'),
(4, 'P4789ABCDEFGH', 'Bike', 'This is Bike');
```

**Note**: UIDs shown above are examples. The actual migration script generates random 13-character UIDs automatically.

#### Complete Schema Creation (All-in-One)

```sql
-- Drop existing tables (be careful in production!)
DROP TABLE IF EXISTS order_product_map CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id INT PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    order_description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create order_product_map table
CREATE TABLE order_product_map (
    id SERIAL PRIMARY KEY,
    order_uid VARCHAR(13) NOT NULL,
    product_uid VARCHAR(13) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_uid) REFERENCES orders(uid) ON DELETE CASCADE,
    FOREIGN KEY (product_uid) REFERENCES products(uid) ON DELETE CASCADE,
    UNIQUE(order_uid, product_uid)
);

-- Create indexes
CREATE INDEX idx_orders_uid ON orders(uid);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_products_uid ON products(uid);
CREATE INDEX idx_order_product_map_order_uid ON order_product_map(order_uid);
CREATE INDEX idx_order_product_map_product_uid ON order_product_map(product_uid);

-- Add comments
COMMENT ON TABLE orders IS 'Stores customer orders';
COMMENT ON TABLE products IS 'Stores product catalog';
COMMENT ON TABLE order_product_map IS 'Junction table mapping orders to products (many-to-many relationship)';
COMMENT ON COLUMN orders.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
COMMENT ON COLUMN products.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
```

You can run this in pgAdmin Query Tool or execute `npm run db:setup` which runs the migration and seed scripts automatically.

## API Endpoints

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/order` | Get all orders with products |
| GET | `/api/order/:uid` | Get order by UID with products |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:uid` | Update order by UID |
| DELETE | `/api/orders/:uid` | Delete order by UID |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |

### Request/Response Examples

#### Create Order
```bash
POST /api/orders
Content-Type: application/json

{
  "orderDescription": "Order for Customer 1",
  "productUids": ["P1ABCDEFGHIJK", "P2LMNOPQRSTUV", "P3WXYZ0123456"]
}
```

Response:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "uid": "A1B2C3D4E5F6G",
    "orderDescription": "Order for Customer 1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "products": [
      {
        "id": 1,
        "uid": "P1ABCDEFGHIJK",
        "productName": "HP laptop",
        "productDescription": "This is HP laptop"
      },
      {
        "id": 2,
        "uid": "P2LMNOPQRSTUV",
        "productName": "lenovo laptop",
        "productDescription": "This is lenovo"
      },
      {
        "id": 3,
        "uid": "P3WXYZ0123456",
        "productName": "Car",
        "productDescription": "This is Car"
      }
    ]
  }
}
```

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/order-management-check-ministry.git
cd order-management-check-ministry
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE order_management;

# Exit psql
\q
```

### 3. Backend Setup

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_management
DB_USER=postgres
DB_PASSWORD=your_password

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

#### Run Database Migration and Seed

```bash
# Run migration to create tables
npm run db:migrate

# Seed initial product data
npm run db:seed

# Or run both at once
npm run db:setup
```

### 4. Frontend Setup

#### Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

#### Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
cd ..
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

#### Development Mode (Both Backend and Frontend)

From the root directory:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:3000`

#### Run Backend Only

```bash
npm run server
```

#### Run Frontend Only

```bash
npm run client
```

#### Production Mode

```bash
# Build frontend
npm run build

# Start backend
npm start
```

### 6. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Usage Guide

### Creating an Order

1. Navigate to `http://localhost:3000/orders`
2. Click the **"New Order"** button
3. Enter an order description (3-100 characters)
4. Select products by clicking on them (checkboxes)
5. Click **"Submit"** to create the order
6. You'll be redirected back to the orders list

### Editing an Order

1. On the orders list page, click the **edit icon** (pencil) next to an order
2. Modify the order description or product selection
3. Click **"Submit"** to save changes
4. Click **"Cancel"** to discard changes

### Deleting an Order

1. On the orders list page, click the **delete icon** (trash) next to an order
2. Confirm the deletion in the modal dialog
3. The order will be removed from the list

### Searching Orders

1. Use the search bar at the top of the orders list
2. Type an order ID or order description
3. The table will filter results in real-time
4. Click the X icon to clear the search

## Deployment

This application is designed to be deployed as a full-stack application with separate hosting for backend and frontend.

### Recommended Architecture: Railway (Backend) + Vercel (Frontend)

**Total Cost: FREE**

---

### Step 1: Deploy Backend on Railway

**Prerequisites:**
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Code pushed to GitHub repository

**Deployment Steps:**

1. **Create New Project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your repository

2. **Configure Service Settings**
   - Service Type: `Web Service`
   - Root Directory: `.` (root)
   - Build Command: `npm install && npm run db:setup`
   - Start Command: `npm start`
   - Watch Paths: Leave default

3. **Add PostgreSQL Database** (if not already added)
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create database and set environment variables
   - OR use your existing Railway PostgreSQL instance

4. **Set Environment Variables**

   Click on your service → "Variables" tab → "Raw Editor", then add:
   ```
   DB_HOST=<your-railway-postgres-host>
   DB_PORT=<your-railway-postgres-port>
   DB_NAME=railway
   DB_USER=postgres
   DB_PASSWORD=<your-railway-postgres-password>
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

   **Note**: Railway automatically provides database credentials if you add PostgreSQL from their dashboard. Check the "Variables" tab of your PostgreSQL service.

5. **Deploy**
   - Railway automatically deploys on push to main branch
   - Get your backend URL: `https://your-app-name.up.railway.app`
   - Test your API: `https://your-app-name.up.railway.app/api/products`

6. **Monitor Deployment**
   - Check "Deployments" tab for build logs
   - Check "Metrics" tab for usage
   - View logs in "Logs" tab

---

### Step 2: Deploy Frontend on Vercel

**Prerequisites:**
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Backend deployed and URL obtained from Step 1

**Deployment Steps:**

1. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Authorize Vercel to access GitHub if needed

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set Environment Variables**

   In Vercel dashboard → "Settings" → "Environment Variables":
   ```
   REACT_APP_API_URL=https://your-backend-app.up.railway.app/api
   ```

   **Important**: Replace `your-backend-app.up.railway.app` with your actual Railway backend URL from Step 1.

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Get your frontend URL: `https://your-app-name.vercel.app`

5. **Update Railway Backend CORS**

   **CRITICAL**: Go back to Railway and update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

   This allows your backend to accept requests from your deployed frontend.

6. **Verify Deployment**
   - Visit: `https://your-app-name.vercel.app`
   - Create a test order
   - Verify it appears in the list
   - Check browser console for any errors

---

### Step 3: Verify Full-Stack Deployment

1. **Test Backend API**
   ```bash
   curl https://your-backend-app.up.railway.app/api/products
   ```
   Should return JSON with products.

2. **Test Frontend**
   - Open: `https://your-app-name.vercel.app`
   - Navigate to all pages
   - Create, edit, and delete orders
   - Verify data persists

3. **Test Integration**
   - Create an order from frontend
   - Refresh the page
   - Order should still be there (data persisted to Railway PostgreSQL)


### Post-Deployment Checklist

- [ ] Backend API responds at `/api/products`
- [ ] Frontend loads and displays UI
- [ ] Can create new orders
- [ ] Orders persist after refresh
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Search functionality works
- [ ] No CORS errors in browser console
- [ ] Database tables created successfully
- [ ] Seed data visible in products list

---

### Continuous Deployment

Both Railway and Vercel support **automatic deployments**:

- **Push to GitHub** → Automatically triggers deployment
- **No manual steps needed** after initial setup
- **Preview deployments** for pull requests (Vercel)
- **Rollback** to previous deployments if needed

---

### Environment Variables Reference

**Backend (.env on Railway):**
```bash
DB_HOST=<railway-postgres-host>
DB_PORT=<railway-postgres-port>
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<railway-postgres-password>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (.env on Vercel):**
```bash
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

---

### Troubleshooting Deployment

**Backend not responding:**
- Check Railway deployment logs
- Verify environment variables are set correctly
- Ensure database migration ran successfully (`npm run db:setup`)

**Frontend can't connect to backend:**
- Check CORS configuration in backend
- Verify `FRONTEND_URL` in Railway matches Vercel URL
- Verify `REACT_APP_API_URL` in Vercel points to Railway backend

**Database connection errors:**
- Verify Railway PostgreSQL is running
- Check database credentials in Railway environment variables
- Ensure migration script ran successfully

---

## Assumptions and Design Decisions

### Database Design

1. **UID System**: Each table has both an auto-incrementing `id` (primary key) and a unique `uid` (13-char alphanumeric). The `uid` is used for foreign key relationships to avoid exposing sequential IDs in the API and provide better security.

2. **Many-to-Many Relationship**: Orders and Products have a many-to-many relationship through the `OrderProductMap` junction table, allowing one order to have multiple products and vice versa.

3. **Cascading Deletes**: When an order is deleted, all related entries in `OrderProductMap` are automatically deleted due to `ON DELETE CASCADE` constraint.

4. **Indexes**: Added indexes on frequently queried columns (`uid`, `createdAt`) for better query performance.

### API Design

1. **RESTful Conventions**: Followed REST best practices with proper HTTP methods and status codes.

2. **Consistent Response Format**: All API responses follow a consistent structure with `success`, `statusCode`, `message`, and `data` fields.

3. **Error Handling**: Implemented centralized error handling with custom `ApiError` class and middleware.

4. **Validation**: Both client-side and server-side validation to ensure data integrity.

### Frontend Design

1. **React with Create React App**: Simple, easy-to-understand React setup without additional complexity.

2. **React Router**: Client-side routing for seamless navigation between pages.

3. **Component Reusability**: Created reusable components (LoadingSpinner, DeleteConfirmModal, SearchBar) for better maintainability.

4. **Service Layer**: Separated API calls into service files for better organization and reusability.

5. **Optimistic UI Updates**: Immediate feedback with loading states and toast notifications.

6. **Custom CSS**: Clean, responsive styling without additional dependencies.

### Code Quality

1. **Separation of Concerns**: Clear separation between routes, controllers, models, and utilities.

2. **DRY Principle**: Reusable utility functions for common operations (error handling, response formatting, UID generation).

3. **Error Boundaries**: Comprehensive error handling at every level (model, controller, route).

4. **Input Validation**: Using `express-validator` for robust server-side validation.

## Tradeoffs

### 1. UID vs. UUID

**Decision**: Used custom 13-character alphanumeric UID instead of standard UUID.

**Pros**:
- Shorter length (13 vs 36 characters)
- More readable
- Still provides good uniqueness (36^13 combinations)

**Cons**:
- Custom implementation requires uniqueness checks
- Slightly higher collision probability than UUID (acceptable for this scale)

### 2. Single Repository vs. Microservices

**Decision**: Monorepo with backend and frontend in same repository.

**Pros**:
- Easier development and deployment for small project
- Simpler version control
- Better for assignment demonstration

**Cons**:
- Less scalable for large teams
- Harder to deploy services independently

### 3. Client-Side vs. Server-Side Rendering

**Decision**: Used Next.js with App Router (hybrid approach).

**Pros**:
- Better SEO
- Faster initial page load
- Modern React patterns

**Cons**:
- More complex than pure client-side
- Requires understanding of SSR/CSR concepts

### 4. Direct Database Queries vs. ORM

**Decision**: Used raw SQL queries with pg library instead of ORM (e.g., Sequelize, TypeORM).

**Pros**:
- Better performance
- Full control over queries
- Easier to optimize complex queries
- Less abstraction overhead

**Cons**:
- More boilerplate code
- Manual SQL writing
- No automatic migrations (handled with custom scripts)

### 5. Jest vs. Other Testing Frameworks

**Decision**: Used Jest for testing.

**Pros**:
- Popular and well-documented
- Built-in mocking capabilities
- Good integration with Node.js

**Cons**:
- Can be slower than alternatives like Vitest
- Configuration can be complex

## Troubleshooting

### Common Errors and Solutions

#### 1. Port Already in Use Error

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

This error occurs when another process is already using port 5000. Follow these steps to fix it:

**On Windows:**

```bash
# Step 1: Find the process using port 5000
netstat -ano | findstr :5000

# Step 2: Note the PID (Process ID) from the output (last column)
# Example output: TCP  0.0.0.0:5000  0.0.0.0:0  LISTENING  12345
# PID is 12345

# Step 3: Kill the process using PowerShell
powershell -Command "Stop-Process -Id <PID> -Force"

# Example:
powershell -Command "Stop-Process -Id 12345 -Force"
```

**On macOS/Linux:**

```bash
# Step 1: Find the process using port 5000
lsof -i :5000

# Step 2: Note the PID from the output

# Step 3: Kill the process
kill -9 <PID>

# Example:
kill -9 12345
```

**Alternative Solution - Change the Port:**

Edit your `.env` file and change the PORT:
```env
PORT=5001
```

Then restart the server.

#### 2. Database Connection Error

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

- Ensure PostgreSQL is running:
  - **Windows**: Check Services → PostgreSQL should be running
  - **macOS**: `brew services start postgresql`
  - **Linux**: `sudo systemctl start postgresql`

- Verify database credentials in `.env` file
- Check if database exists: `psql -U postgres -l`

#### 3. Module Not Found Error

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 4. Database Tables Don't Exist

**Error Message:**
```
relation "orders" does not exist
```

**Solution:**

Run the database setup:
```bash
npm run db:setup
```

This will create all tables and seed initial data.

#### 5. Frontend Cannot Connect to Backend

**Error Message:**
```
Network Error / CORS Error
```

**Solution:**

- Ensure backend is running on port 5000: `npm run server`
- Check `frontend/.env` has correct API URL:
  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  ```
- Verify CORS settings in `backend/server.js`

#### 6. Tests Failing

**Solution:**

```bash
# Ensure database is set up
npm run db:setup

# Run tests
npm test
```

If port conflict during tests, make sure no server is running on port 5000.

## Future Enhancements

1. **Authentication & Authorization**: Add user authentication with JWT tokens
2. **Pagination**: Implement pagination for orders list
3. **Sorting**: Add sorting options for table columns
4. **Order Status**: Add order status tracking (pending, completed, cancelled)
5. **Product Images**: Add product images and thumbnails
6. **Export Functionality**: Export orders to CSV/Excel
7. **Analytics Dashboard**: Add charts and statistics
8. **Real-time Updates**: WebSocket integration for live updates
9. **Audit Logs**: Track who created/modified orders
10. **API Documentation**: Swagger/OpenAPI documentation

## Contributing

This is an assignment project. No contributions are expected.

---

**Built with ❤️ for CheckMinistry By Rajesh Sharma**
