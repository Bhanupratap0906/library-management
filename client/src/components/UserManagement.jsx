import React, { useState } from 'react';
import Spinner from './common/Spinner';
import ErrorAlert from './common/ErrorAlert';

// BorrowReturnButton component that handles borrowing/returning a book
const BorrowReturnButton = ({ bookId, isBorrowed, onBorrow, onReturn, disabled }) => {
  const [loading, setLoading] = useState(false);
  
  const handleAction = async () => {
    setLoading(true);
    try {
      if (isBorrowed) {
        await onReturn(bookId);
      } else {
        await onBorrow(bookId);
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleAction}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow ${
        isBorrowed
          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white'
          : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white'
      } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Spinner size="sm" />
          <span className="ml-2">Processing...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center">
          {isBorrowed ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
              Return Book
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Borrow Book
            </>
          )}
        </span>
      )}
    </button>
  );
};

// Main UserManagement component
const UserManagement = ({ 
  books = [],
  userBooks = [],
  isLoading = false,
  error = null,
  onBorrowBook,
  onReturnBook
}) => {
  // For this demo, we'll just show a list of books that can be borrowed/returned
  // In a real application, this would likely be a more complex component with user authentication
  
  // Helper function to check if a book is borrowed by current user
  const isBookBorrowed = (bookId) => {
    return userBooks.some(book => book.id === bookId);
  };
  
  // Handle book borrowing
  const handleBorrow = async (bookId) => {
    try {
      await onBorrowBook(bookId);
      return true;
    } catch (error) {
      console.error('Failed to borrow book:', error);
      return false;
    }
  };
  
  // Handle book return
  const handleReturn = async (bookId) => {
    try {
      await onReturnBook(bookId);
      return true;
    } catch (error) {
      console.error('Failed to return book:', error);
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading your books...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return <ErrorAlert messages={error} />;
  }
  
  return (
    <div>
      {/* User stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Books</h3>
              <p className="text-3xl font-bold text-gray-700">{books.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Available Books</h3>
              <p className="text-3xl font-bold text-gray-700">
                {books.filter(book => book.copiesAvailable > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Your Books</h3>
              <p className="text-3xl font-bold text-gray-700">{userBooks.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Books Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Available Books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Borrow books from our collection.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {books.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No books available for borrowing.</p>
              </div>
            ) : (
              books.map((book, index) => (
                <div 
                  key={book.id} 
                  className="p-4 hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-base font-medium text-gray-900">{book.title}</h5>
                      <p className="text-sm text-gray-500">by {book.author}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          book.copiesAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.copiesAvailable} {book.copiesAvailable === 1 ? 'copy' : 'copies'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          ISBN: {book.ISBN}
                        </span>
                      </div>
                    </div>
                    <BorrowReturnButton
                      bookId={book.id}
                      isBorrowed={isBookBorrowed(book.id)}
                      onBorrow={handleBorrow}
                      onReturn={handleReturn}
                      disabled={book.copiesAvailable === 0 && !isBookBorrowed(book.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Borrowed Books Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Your Borrowed Books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Books you've currently borrowed from the library.
            </p>
          </div>
          
          {userBooks.length === 0 ? (
            <div className="p-8 text-center bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="mt-4 text-gray-700 text-lg font-medium">No borrowed books</h3>
              <p className="mt-2 text-gray-500">You haven't borrowed any books yet.</p>
              <p className="mt-1 text-sm text-gray-400">Browse the available books and borrow some!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {userBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-base font-medium text-gray-900">{book.title}</h5>
                      <p className="text-sm text-gray-500">by {book.author}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Borrowed on {new Date(book.borrowedDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <BorrowReturnButton
                      bookId={book.id}
                      isBorrowed={true}
                      onBorrow={handleBorrow}
                      onReturn={handleReturn}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
export { BorrowReturnButton };