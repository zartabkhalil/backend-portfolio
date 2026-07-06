# Shop API — E-Commerce Backend

A production-ready e-commerce REST API built with **Express 5**, **TypeScript**, and **Prisma 6** (PostgreSQL). Features JWT authentication, role-based access, Stripe payments, Cloudinary image uploads, and rate limiting.

---

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Runtime          | Node.js (TypeScript)                             |
| Framework        | Express 5                                        |
| ORM              | Prisma 6                                         |
| Database         | PostgreSQL                                       |
| Auth             | JWT (access + refresh tokens)                    |
| Payments         | Stripe (Payment Intents + Webhooks)              |
| File Uploads     | Multer + Cloudinary                              |
| Validation       | express-validator                                |
| Security         | Helmet, express-rate-limit, bcryptjs             |
| Architecture     | Controller → Service → Repository (layered)      |

---

## Features

- User registration & login (Customer / Admin roles)
- Product CRUD with category association
- Category CRUD
- Cart management (add, update, remove items)
- Order placement with cart-to-order conversion
- Stripe payment integration (intent + webhook)
- Product reviews & ratings (verified-purchase only)
- Admin dashboard stats (revenue, orders, top products)
- Rate limiting (general, auth, refresh-token)
- Cloudinary image uploads
- Helmet security headers

---

## Local Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL running locally
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd shopapi

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Then fill in your .env values (see Environment Variables below)

# 4. Create the database
createdb shopapi

# 5. Run migrations
npx prisma migrate dev

# 6. Generate Prisma client
npx prisma generate

# 7. Start dev server (hot reload)
npm run dev
```

The server starts at `http://localhost:8088` (or `PORT` from `.env`).

### Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start dev server with hot reload |
| `npm run build`   | Compile TypeScript              |
| `npm start`       | Run compiled output             |

---

## Environment Variables

| Variable                   | Description                     | Required |
| -------------------------- | ------------------------------- | -------- |
| `PORT`                     | Server port (default: `8088`)   | No       |
| `NODE_ENV`                 | Environment mode                | No       |
| `DATABASE_URL`             | PostgreSQL connection string    | **Yes**  |
| `JWT_ACCESS_SECRET`        | Secret for access tokens        | **Yes**  |
| `JWT_REFRESH_SECRET`       | Secret for refresh tokens       | **Yes**  |
| `ADMIN_SECRET`             | Secret to register as admin     | **Yes**  |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name           | **Yes**  |
| `CLOUDINARY_API_KEY`       | Cloudinary API key              | **Yes**  |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret           | **Yes**  |
| `STRIPE_SECRET_KEY`        | Stripe secret key               | **Yes**  |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signing secret   | **Yes**  |
| `CLIENT_URL`               | Frontend URL for CORS           | No       |

---

## API Endpoints

All responses follow the shape:

```json
{
  "success": true | false,
  "message": "string",
  "data": { }
}
```

Error responses include `stack` when `NODE_ENV=development`.

---

### Authentication

Base path: `/api/user`

#### Register

```
POST /api/user/register
Access: Public (rate-limited: 10 req/15min)
```

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "adminSecret": "supersecretkey"
}
```

`adminSecret` is optional — omitting it creates a `CUSTOMER` account.

**Response (201):**

```json
{
  "success": true,
  "message": "User registered",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "createdAt": "2026-07-06T10:00:00.000Z",
    "updatedAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Login

```
POST /api/user/login
Access: Public (rate-limited: 10 req/15min)
```

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN"
    }
  }
}
```

---

### Categories

Base path: `/api/categories`

#### List all categories

```
GET /api/categories
Access: Public
```

**Response (200):**

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "createdAt": "2026-07-06T10:00:00.000Z"
    }
  ]
}
```

#### Get category by ID

```
GET /api/categories/:id
Access: Public
```

**Response (200):**

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {
    "id": 1,
    "name": "Electronics",
    "products": [],
    "createdAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Create category

```
POST /api/categories
Access: Admin
```

**Request body:**

```json
{
  "name": "Electronics"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Category Created",
  "data": {
    "id": 1,
    "name": "Electronics",
    "createdAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Update category

```
PUT /api/categories/:id
Access: Admin
```

**Request body:**

```json
{
  "name": "Home Appliances"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Record Updated",
  "data": {
    "id": 1,
    "name": "Home Appliances",
    "createdAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Delete category

```
DELETE /api/categories/:id
Access: Admin
```

**Response (200):**

```json
{
  "success": true,
  "message": "Record Deleted",
  "data": {
    "id": 1,
    "name": "Home Appliances"
  }
}
```

> Category cannot be deleted if it has associated products.

---

### Products

Base path: `/api/product`

#### List all products

```
GET /api/product?page=1&limit=10
Access: Public
```

| Query | Type   | Default | Description        |
| ----- | ------ | ------- | ------------------ |
| page  | number | 1       | Page number        |
| limit | number | 10      | Items per page     |

**Response (200):**

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Wireless Headphones",
        "price": 99.99,
        "categoryId": 1,
        "image": "https://res.cloudinary.com/...",
        "description": "High-quality wireless headphones",
        "stock": 50,
        "discount": 10,
        "isActive": true,
        "createdAt": "2026-07-06T10:00:00.000Z",
        "updatedAt": "2026-07-06T10:00:00.000Z",
        "category": { "id": 1, "name": "Electronics" }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

#### Get product by ID

```
GET /api/product/:id
Access: Public
```

**Response (200):**

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {
    "id": 1,
    "title": "Wireless Headphones",
    "price": 99.99,
    "categoryId": 1,
    "image": "https://res.cloudinary.com/...",
    "description": "High-quality wireless headphones",
    "stock": 50,
    "discount": 10,
    "isActive": true,
    "createdAt": "2026-07-06T10:00:00.000Z",
    "category": { "id": 1, "name": "Electronics" }
  }
}
```

#### Create product

```
POST /api/product
Access: Admin
Content-Type: multipart/form-data
```

**Form fields:**

| Field       | Type   | Required | Description    |
| ----------- | ------ | -------- | -------------- |
| title       | string | Yes      | Product name   |
| price       | number | Yes      | Product price  |
| categoryId  | number | Yes      | Category ID    |
| description | string | Yes      | Description    |
| stock       | number | Yes      | Stock quantity |
| discount    | number | Yes      | Discount amount |
| image       | file   | Yes      | Product image  |

**Response (201):**

```json
{
  "success": true,
  "message": "Product Created",
  "data": {
    "id": 1,
    "title": "Wireless Headphones",
    "price": 99.99,
    "categoryId": 1,
    "image": "https://res.cloudinary.com/...",
    "description": "High-quality wireless headphones",
    "stock": 50,
    "discount": 10,
    "isActive": true,
    "createdAt": "2026-07-06T10:00:00.000Z",
    "updatedAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Update product

```
PUT /api/product/:id
Access: Admin
Content-Type: multipart/form-data
```

All fields are optional. Only provided fields will be updated.

**Response (200):**

```json
{
  "success": true,
  "message": "Record Updated",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "price": 79.99,
    "stock": 40,
    ...
  }
}
```

#### Delete product (soft)

```
DELETE /api/product/:id
Access: Admin
```

**Response (200):**

```json
{
  "success": true,
  "message": "Record Deleted",
  "data": {
    "id": 1,
    "isActive": false,
    ...
  }
}
```

Products are soft-deleted (`isActive = false`).

---

### Cart

Base path: `/api/cart`

All cart endpoints require `Authorization: Bearer <token>` and `CUSTOMER` role.

#### Get cart items

```
GET /api/cart
Access: Customer (authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {
    "cartTotal": 199.98,
    "afterDiscount": 179.98,
    "items": [
      {
        "id": 1,
        "userId": 1,
        "productId": 1,
        "quantity": 2,
        "createdAt": "2026-07-06T10:00:00.000Z",
        "products": {
          "id": 1,
          "title": "Wireless Headphones",
          "price": 99.99,
          "discount": 10,
          "stock": 50,
          "image": "..."
        }
      }
    ]
  }
}
```

#### Add item to cart

```
POST /api/cart
Access: Customer (authenticated)
```

**Request body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

If the product is already in the cart, the quantity is incremented.

**Response (201):**

```json
{
  "success": true,
  "message": "Items Added to Cart",
  "data": {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "createdAt": "2026-07-06T10:00:00.000Z",
    "updatedAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Update cart item

```
PUT /api/cart/:id
Access: Customer (authenticated)
```

**Request body:**

```json
{
  "quantity": 3
}
```

Setting `quantity` to `0` removes the item from cart.

**Response (200):**

```json
{
  "success": true,
  "message": "Cart Updated",
  "data": {
    "id": 1,
    "quantity": 3,
    ...
  }
}
```

#### Remove cart item

```
DELETE /api/cart/:id
Access: Customer (authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Record Deleted",
  "data": {
    "id": 1,
    ...
  }
}
```

---

### Orders

Base path: `/api/order`

#### Create order (from cart)

```
POST /api/order
Access: Customer (authenticated)
```

**Request body:**

```json
{
  "address": "123 Main St, New York, NY 10001"
}
```

Converts the user's cart into an order — clears cart, reduces stock, and creates order items.

**Response (200):**

```json
{
  "success": true,
  "message": "Order Place Successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "address": "123 Main St, New York, NY 10001",
    "amount": 179.98,
    "status": "PENDING",
    "createdAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Get my orders

```
GET /api/order/getMyOrders
Access: Customer (authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Orders of User",
  "data": [
    {
      "id": 1,
      "amount": 179.98,
      "status": "PENDING",
      "address": "123 Main St",
      "createdAt": "2026-07-06T10:00:00.000Z",
      "orderItems": [
        {
          "id": 1,
          "productId": 1,
          "quantity": 2,
          "price": 89.99,
          "product": {
            "id": 1,
            "title": "Wireless Headphones",
            "price": 99.99,
            "discount": 10,
            "image": "..."
          }
        }
      ]
    }
  ]
}
```

#### Get order by ID

```
GET /api/order/:id
Access: Customer (authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Orders Detail",
  "data": {
    "id": 1,
    "userId": 1,
    "amount": 179.98,
    "status": "PENDING",
    "address": "123 Main St",
    "createdAt": "2026-07-06T10:00:00.000Z",
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": 89.99,
        "product": {
          "title": "Wireless Headphones",
          "price": 99.99,
          "discount": 10,
          "image": "..."
        }
      }
    ]
  }
}
```

#### Update order status

```
PATCH /api/order/:id/status
Access: Admin
```

**Request body:**

```json
{
  "status": "PROCESSING"
}
```

Valid statuses: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

**Response (200):**

```json
{
  "success": true,
  "message": "Order Updated",
  "data": {
    "id": 1,
    "status": "PROCESSING",
    ...
  }
}
```

---

### Payments (Stripe)

Base path: `/api/payment`

#### Create payment intent

```
POST /api/payment/create-intent
Access: Customer (authenticated)
```

**Request body:**

```json
{
  "orderId": 1
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Payment Intent",
  "data": {
    "id": "pi_3Q5qVKRtujmH0rcT1abcdef",
    "amount": 17998,
    "currency": "usd",
    "client_secret": "pi_3Q5qVKRt..._secret_abc123",
    "status": "requires_payment_method"
  }
}
```

#### Stripe Webhook

```
POST /api/payment/webhook
Access: Public (Stripe-signed)
Content-Type: application/json (raw)
```

Handles `payment_intent.succeeded`, `charge.updated`, and `payment_intent.payment_failed` events. On success, updates order status to `PROCESSING` and creates a transaction record.

---

### Reviews

Base path: `/api/reviews`

#### Create review

```
POST /api/reviews
Access: Customer (authenticated)
```

**Request body:**

```json
{
  "productId": 1,
  "reviews": "Great product, excellent sound quality!",
  "ratings": 4.5
}
```

Rating must be between 1 and 5. User must have purchased (delivered order) the product. One review per product per user.

**Response (200):**

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "userId": 1,
    "reviews": "Great product, excellent sound quality!",
    "ratings": 4.5,
    "createdAt": "2026-07-06T10:00:00.000Z"
  }
}
```

#### Get reviews for a product

```
POST /api/reviews/product/:productId
Access: Public
```

**Response (200):**

```json
{
  "success": true,
  "message": "Review fetched successfully",
  "data": {
    "averageRating": 4.25,
    "totalRatings": 4,
    "reviews": [
      {
        "id": 1,
        "productId": 1,
        "userId": 1,
        "reviews": "Great product!",
        "ratings": 4.5,
        "createdAt": "2026-07-06T10:00:00.000Z",
        "user": { "name": "John Doe" }
      }
    ]
  }
}
```

#### Delete review

```
DELETE /api/reviews/:id
Access: Customer (authenticated — owner only)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Review Deleted successfully",
  "data": {
    "id": 1,
    ...
  }
}
```

---

### Dashboard (Admin)

Base path: `/api/admin/dashboard`

#### Get dashboard stats

```
GET /api/admin/dashboard
Access: Admin (authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard stats",
  "data": {
    "totalCustomers": 42,
    "totalProducts": 120,
    "totalRevenue": 15999.99,
    "totalOrders": 85,
    "ordersByStatus": {
      "PENDING": 12,
      "PROCESSING": 8,
      "SHIPPED": 5,
      "DELIVERED": 55,
      "CANCELLED": 5
    },
    "recentOrders": [
      {
        "id": 85,
        "amount": 89.99,
        "createdAt": "2026-07-06T09:30:00.000Z",
        "user": { "name": "Jane Doe" }
      }
    ],
    "topProducts": [
      {
        "productId": 1,
        "totalOrders": 34,
        "product": {
          "id": 1,
          "title": "Wireless Headphones",
          "price": 99.99,
          "image": "..."
        }
      }
    ]
  }
}
```

---

## Authentication Header

Protected endpoints require:

```
Authorization: Bearer <access_token>
```

The access token is a JWT returned from the login endpoint. It expires in 15 minutes.

---

## Database Schema

### Models

- **User** — id, name, email, password, role (CUSTOMER/ADMIN)
- **Category** — id, name
- **Product** — id, title, price, categoryId, image, description, stock, discount, isActive
- **Cart** — id, userId, productId, quantity
- **Order** — id, userId, address, amount, status
- **OrderItem** — id, orderId, productId, quantity, price
- **Rating** — id, productId, userId, reviews, ratings
- **Transaction** — id, orderId, userId, amount, status, paymentMethod, stripePaymentId

---

## Project Structure

```
src/
├── config/           # DB, Stripe, Cloudinary, constants
├── controllers/      # Request handlers
├── lib/              # Utilities (AppError, JWT)
├── middlewares/       # Auth, role, rate-limit, upload, validation
├── repositories/     # Database queries
├── routes/           # Express routers
├── services/         # Business logic
├── types/            # TypeScript interfaces
└── generated/prisma/ # Auto-generated Prisma client
```
