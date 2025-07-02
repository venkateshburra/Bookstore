import express from 'express';
import dotenv from 'dotenv';
import logger from './middleware/logger.js';
import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger);

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token has expired. Please log in again.',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
