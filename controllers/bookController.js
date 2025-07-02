import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';
import path from 'path';

const booksFile = path.resolve('data/books.json');

// Helpers
const readBooks = async () => JSON.parse(await fs.readFile(booksFile, 'utf-8'));
const writeBooks = async (data) => await fs.writeFile(booksFile, JSON.stringify(data, null, 2));

// GET /books
export const getAllBooks = async (req, res) => {
  try {
    const books = await readBooks();
    res.json({
      success: true,
      message: 'Books fetched successfully',
      data: books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not read books.' });
  }
};

// GET /books/:id
export const getBookById = async (req, res) => {
  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: 'Book not found' });

    res.json({
      success: true,
      message: 'Book fetched successfully',
      data: book,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching book.' });
  }
};

// POST /books
export const createBook = async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;
  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({
      success: false,
      message: 'All fields (title, author, genre, publishedYear) are required',
    });
  }

  try {
    const books = await readBooks();
    const newBook = {
      id: uuid(),
      title,
      author,
      genre,
      publishedYear,
      userId: req.user.id,
      created_by: req.user.email,
    };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not create book.' });
  }
};

// PUT /books/:id
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publishedYear } = req.body;

  try {
    const books = await readBooks();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (books[index].userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this book' });
    }

    books[index] = {
      ...books[index],
      title: title || books[index].title,
      author: author || books[index].author,
      genre: genre || books[index].genre,
      publishedYear: publishedYear || books[index].publishedYear,
    };

    await writeBooks(books);
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: books[index],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update book.' });
  }
};

// DELETE /books/:id
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
    }

    const updatedBooks = books.filter((b) => b.id !== id);
    await writeBooks(updatedBooks);

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete book.' });
  }
};
