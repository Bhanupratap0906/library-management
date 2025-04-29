require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import the validation function (in a real app, we'd handle JSX compilation)
// For this demo, we'll recreate a simplified version of the validation function here
const validateBook = (bookData) => {
  const errors = [];
  
  // Define validation functions
  const sanitizeString = (str) => str ? str.trim() : '';
  
  const validateISBN = (isbn) => {
    return /^(?:\d{9}[\dXx]|\d{13})$/.test(isbn);
  };
  
  const validatePublishedDate = (date) => {
    const publishedDate = new Date(date);
    const today = new Date();
    return !isNaN(publishedDate) && publishedDate <= today;
  };
  
  const validateAcademicCopies = (genre, copies) => {
    return genre !== "Academic" || (genre === "Academic" && copies >= 5);
  };
  
  // Sanitize data
  const sanitizedData = {
    ...bookData,
    title: sanitizeString(bookData.title),
    author: sanitizeString(bookData.author),
    ISBN: sanitizeString(bookData.ISBN),
  };
  
  // Validation
  if (!sanitizedData.title) errors.push("Title is required");
  if (!sanitizedData.author) errors.push("Author is required");
  
  if (!sanitizedData.ISBN) {
    errors.push("ISBN is required");
  } else if (!validateISBN(sanitizedData.ISBN)) {
    errors.push("Invalid ISBN format (must be 10 or 13 digits)");
  }
  
  if (!sanitizedData.publishedDate) {
    errors.push("Published date is required");
  } else if (!validatePublishedDate(sanitizedData.publishedDate)) {
    errors.push("Published date cannot be in the future");
  }
  
  if (!validateAcademicCopies(sanitizedData.genre, sanitizedData.copiesAvailable)) {
    errors.push("Academic books must have at least 5 copies available");
  }
  
  return {
    isValid: errors.length === 0,
    validatedData: sanitizedData,
    errors
  };
};

// Create a mock database
let books = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    ISBN: '9780061120084',
    publishedDate: '1960-07-11',
    genre: 'Fiction',
    copiesAvailable: 3
  },
  {
    id: '2',
    title: 'Principles of Physics',
    author: 'David Halliday',
    ISBN: '9780470524633',
    publishedDate: '2010-06-14',
    genre: 'Academic',
    copiesAvailable: 5
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    ISBN: '9780451524935',
    publishedDate: '1949-06-08',
    genre: 'Fiction',
    copiesAvailable: 2
  }
];

// Create the Express app
const app = express();
const PORT = process.env.PORT || 2002;  // Use environment variable for the port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.get('/api/books', (req, res) => {
  res.json(books);
});

app.post('/api/books', (req, res) => {
  const validation = validateBook(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: validation.errors
        }
      }
    });
  }
  
  const newBook = {
    ...validation.validatedData,
    id: Date.now().toString()
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex(book => book.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: [`Book with ID ${bookId} not found`]
        }
      }
    });
  }
  
  const validation = validateBook(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: validation.errors
        }
      }
    });
  }
  
  const updatedBook = {
    ...books[bookIndex],
    ...validation.validatedData,
    id: bookId // Ensure ID doesn't change
  };
  
  books[bookIndex] = updatedBook;
  res.json(updatedBook);
});

app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const initialLength = books.length;
  
  books = books.filter(book => book.id !== bookId);
  
  if (books.length === initialLength) {
    return res.status(404).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: [`Book with ID ${bookId} not found`]
        }
      }
    });
  }
  
  res.json({ success: true, message: 'Book deleted successfully' });
});

// Borrowing functionality
let userBooks = [];

app.post('/api/books/:id/borrow', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: [`Book with ID ${bookId} not found`]
        }
      }
    });
  }
  
  if (book.copiesAvailable <= 0) {
    return res.status(400).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: ['No copies available for borrowing']
        }
      }
    });
  }
  
  const bookIndex = books.findIndex(b => b.id === bookId);
  books[bookIndex] = {
    ...book,
    copiesAvailable: book.copiesAvailable - 1
  };
  
  const userBook = {
    ...book,
    borrowedDate: new Date().toISOString()
  };
  userBooks.push(userBook);
  
  res.json(userBook);
});

app.post('/api/books/:id/return', (req, res) => {
  const bookId = req.params.id;
  const userBookIndex = userBooks.findIndex(book => book.id === bookId);
  
  if (userBookIndex === -1) {
    return res.status(404).json({
      success: false,
      errorComponent: {
        type: 'ErrorDisplay',
        props: {
          messages: [`You haven't borrowed the book with ID ${bookId}`]
        }
      }
    });
  }
  
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      copiesAvailable: books[bookIndex].copiesAvailable + 1
    };
  }
  
  const returnedBook = userBooks[userBookIndex];
  userBooks = userBooks.filter(book => book.id !== bookId);
  
  res.json({ success: true, message: 'Book returned successfully' });
});

app.get('/api/user/books', (req, res) => {
  res.json(userBooks);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
