# 📚 Bookstore API

A simple and secure RESTful API built using **Node.js**, **Express**, and **JWT authentication**. 
It allows users to register, log in, and perform CRUD operations on books. Data is stored in local `.json` files.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/venkateshburra/Bookstore.git
cd Bookstore

2. Install Dependencies
npm install

3. Create .env File
Create a .env file in the root with the following content:
PORT=3000
SECRET_KEY=your_jwt_secret

4. Start the Server
npm start
If you're using nodemon, run: npm run dev

5. Authentication Endpoints
Register -> POST /users/login
Login -> POST /users/login
Body:
{
  "email": "user@example.com",
  "password": "yourPassword"
}

Authorization: Bearer <your_token>
Use token for books routes:
In headers: Key: Authorization, Value: Bearer <your_token>




