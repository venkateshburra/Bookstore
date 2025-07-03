# 📚 Bookstore API

A secure RESTful API built using **Node.js**, **Express**, and **JWT authentication**.  
It allows users to register, log in, and perform CRUD operations on books.  
Data is stored locally in `.json` files.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/venkateshburra/Bookstore.git
cd Bookstore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory with the following content:

```
PORT=3000
SECRET_KEY=your_jwt_secret
```

### 4. Start the Server

```bash
npm start
# or, if using nodemon
npm run dev
```

---

## Authentication Endpoints

### Register

Send a `POST` request to:

```
/users/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

### Login

Send a `POST` request to:

```
/users/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

**Response:**  
Returns a JWT token.

---

## Using the Token

For all book routes, include the JWT token in the request headers:

```
Authorization: Bearer <your_token>
```

Example in Postman:

- **Key:** `Authorization`  
- **Value:** `Bearer <your_token>`

---

## Book Routes (Protected)

All routes below require a valid JWT token.

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | /books        | Fetch all books                      |
| GET    | /books/:id    | Fetch a specific book                |
| POST   | /books        | Add a new book                       |
| PUT    | /books/:id    | Update a book (only by the creator) |
| DELETE | /books/:id    | Delete a book (only by the creator) |

---

## Project Structure & Key Concepts

The project follows a clean and modular structure:

- **Controllers** – Handle request logic  
- **Routes** – Define endpoint paths  
- **Middleware** – Authenticate and protect routes  

### Key Concepts Covered

-  JWT Authentication & Authorization  
-  Protected Routes  
-  File-Based Data Handling

---

## Testing

Use **Postman** or any REST client:

1. Register a user  
2. Log in to get the JWT token  
3. Add the token to the headers  
4. Make authorized requests to `/books` endpoints
