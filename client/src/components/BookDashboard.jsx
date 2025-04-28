import React, { useState, useEffect, useReducer } from 'react';
import BookList from './BookList';
import UserManagement from './UserManagement';
import { BookValidator } from './Validator';
// Removing unused imports to fix ESLint warnings
// import ErrorAlert from './common/ErrorAlert';
// import Spinner from './common/Spinner';

// Initial state for our reducer
const initialState = {
  books: [],
  userBooks: [],
  isLoading: false,
  error: null,
};

// Action types
const ACTIONS = {
  FETCH_BOOKS_START: 'FETCH_BOOKS_START',
  FETCH_BOOKS_SUCCESS: 'FETCH_BOOKS_SUCCESS',
  FETCH_BOOKS_ERROR: 'FETCH_BOOKS_ERROR',
  ADD_BOOK_SUCCESS: 'ADD_BOOK_SUCCESS',
  UPDATE_BOOK_SUCCESS: 'UPDATE_BOOK_SUCCESS',
  DELETE_BOOK_SUCCESS: 'DELETE_BOOK_SUCCESS',
  BORROW_BOOK_SUCCESS: 'BORROW_BOOK_SUCCESS',
  RETURN_BOOK_SUCCESS: 'RETURN_BOOK_SUCCESS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const booksReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_BOOKS_START:
      return { ...state, isLoading: true, error: null };

    case ACTIONS.FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        books: action.payload.books,
        userBooks: action.payload.userBooks || state.userBooks,
        isLoading: false,
        error: null,
      };

    case ACTIONS.FETCH_BOOKS_ERROR:
      return { ...state, isLoading: false, error: action.payload };

    case ACTIONS.ADD_BOOK_SUCCESS:
      return {
        ...state,
        books: [...state.books, action.payload],
        error: null,
      };

    case ACTIONS.UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        ),
        userBooks: state.userBooks.map(book => 
          book.id === action.payload.id ? { ...book, ...action.payload } : book
        ),
        error: null,
      };

    case ACTIONS.DELETE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
        userBooks: state.userBooks.filter(book => book.id !== action.payload),
        error: null,
      };

    case ACTIONS.BORROW_BOOK_SUCCESS:
      const borrowedBook = state.books.find(book => book.id === action.payload);
      const updatedBookAfterBorrow = {
        ...borrowedBook,
        copiesAvailable: borrowedBook.copiesAvailable - 1,
      };
      
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload ? updatedBookAfterBorrow : book
        ),
        userBooks: [...state.userBooks, {
          ...borrowedBook,
          borrowedDate: new Date().toISOString()
        }],
        error: null,
      };

    case ACTIONS.RETURN_BOOK_SUCCESS:
      const bookToReturn = state.books.find(book => book.id === action.payload);
      const updatedBookAfterReturn = {
        ...bookToReturn,
        copiesAvailable: bookToReturn.copiesAvailable + 1,
      };
      
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload ? updatedBookAfterReturn : book
        ),
        userBooks: state.userBooks.filter(book => book.id !== action.payload),
        error: null,
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Book Dashboard component
const BookDashboard = () => {
  const [state, dispatch] = useReducer(booksReducer, initialState);
  const [activeTab, setActiveTab] = useState('collection');
  const [systemMessage, setSystemMessage] = useState(null);

  // For demo purposes, we'll use some sample books if no API is available
  useEffect(() => {
    const loadSampleBooks = () => {
      dispatch({ type: ACTIONS.FETCH_BOOKS_START });
      
      // Simulate API delay
      setTimeout(() => {
        const sampleBooks = [
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
          },
          {
            id: '4',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            ISBN: '9780743273565',
            publishedDate: '1925-04-10',
            genre: 'Fiction',
            copiesAvailable: 4
          },
          {
            id: '5',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen',
            ISBN: '9780262033848',
            publishedDate: '2009-07-31',
            genre: 'Academic',
            copiesAvailable: 6
          }
        ];
        
        dispatch({
          type: ACTIONS.FETCH_BOOKS_SUCCESS,
          payload: { books: sampleBooks, userBooks: [] }
        });
      }, 1000);
    };
    
    loadSampleBooks();
  }, []);

  // Book management handlers
  const handleAddBook = (bookData) => {
    // Generate a unique ID for the book (in a real app, this would come from the API)
    const newBook = {
      ...bookData,
      id: Date.now().toString()
    };
    
    dispatch({ type: ACTIONS.ADD_BOOK_SUCCESS, payload: newBook });
    showSystemMessage('Book added successfully!');
  };

  const handleEditBook = (bookData) => {
    dispatch({ type: ACTIONS.UPDATE_BOOK_SUCCESS, payload: bookData });
    showSystemMessage('Book updated successfully!');
  };

  const handleDeleteBook = (bookId) => {
    dispatch({ type: ACTIONS.DELETE_BOOK_SUCCESS, payload: bookId });
    showSystemMessage('Book deleted successfully!');
  };

  // User book management handlers
  const handleBorrowBook = async (bookId) => {
    // In a real app, we would call an API here
    dispatch({ type: ACTIONS.BORROW_BOOK_SUCCESS, payload: bookId });
    showSystemMessage('Book borrowed successfully!');
    return Promise.resolve();
  };

  const handleReturnBook = async (bookId) => {
    // In a real app, we would call an API here
    dispatch({ type: ACTIONS.RETURN_BOOK_SUCCESS, payload: bookId });
    showSystemMessage('Book returned successfully!');
    return Promise.resolve();
  };

  // Show temporary system message
  const showSystemMessage = (message) => {
    setSystemMessage(message);
    setTimeout(() => {
      setSystemMessage(null);
    }, 3000);
  };

  return (
    <BookValidator>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-3xl font-bold">Book Management System</h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* System message for notifications */}
          {systemMessage && (
            <div className="mb-6 animate-fade-in-down">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{systemMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab navigation */}
          <div className="bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('collection')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'collection'
                    ? 'text-indigo-600 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Book Collection
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'management'
                    ? 'text-indigo-600 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Management
              </button>
            </nav>
          </div>
          
          {/* Main content based on active tab */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {activeTab === 'collection' ? (
              <BookList
                books={state.books}
                isLoading={state.isLoading}
                error={state.error}
                onAddBook={handleAddBook}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
              />
            ) : (
              <UserManagement
                books={state.books}
                userBooks={state.userBooks}
                isLoading={state.isLoading}
                error={state.error}
                onBorrowBook={handleBorrowBook}
                onReturnBook={handleReturnBook}
              />
            )}
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm">Book Management System</p>
              </div>
              <p className="text-sm text-gray-400 mt-4 md:mt-0">
                &copy; {new Date().getFullYear()} Library Management. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BookValidator>
  );
};

export default BookDashboard; 