import React, { useState } from 'react';
import BookCard from './BookCard';
import Spinner from './common/Spinner';
import ErrorAlert from './common/ErrorAlert';
import AddBookModal from './AddBookModal';

const BookList = ({ 
  books = [], 
  isLoading = false, 
  error = null, 
  onAddBook,
  onEditBook,
  onDeleteBook 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  
  // Get unique genres from books
  const genres = ['', ...new Set(books.map(book => book.genre).filter(Boolean))];

  // Handle edit book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedBook(null);
  };

  // Handle saving a book (new or edited)
  const handleSaveBook = (bookData) => {
    if (selectedBook) {
      onEditBook({ ...bookData, id: selectedBook.id });
    } else {
      onAddBook(bookData);
    }
    handleCloseModal();
  };

  // Filter books by search term and genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.ISBN.includes(searchTerm);
    
    const matchesGenre = filterGenre === '' || book.genre === filterGenre;
    
    return matchesSearch && matchesGenre;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading book collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert messages={error} />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Book Collection</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your library with ease</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Books</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by title, author, or ISBN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-1/4">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Genre</label>
            <select
              id="filter"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre, index) => (
                genre && <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-4 text-gray-700 text-lg font-medium">No books found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || filterGenre 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Add your first book to get started.'}
          </p>
          {(searchTerm || filterGenre) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterGenre('');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Showing {filteredBooks.length} of {books.length} books</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <div 
                key={book.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <BookCard
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={onDeleteBook}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {showAddModal && (
        <AddBookModal
          book={selectedBook}
          isEdit={!!selectedBook}
          onSave={handleSaveBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BookList; 