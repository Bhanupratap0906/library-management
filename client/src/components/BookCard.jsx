import React from 'react';

const BookCard = ({ book, onEdit, onDelete }) => {
  const {
    title,
    author,
    ISBN,
    publishedDate,
    genre,
    copiesAvailable
  } = book;

  // Function to get a gradient based on the genre
  const getGenreGradient = (genre) => {
    switch(genre) {
      case 'Fiction':
        return 'from-blue-500 to-indigo-600';
      case 'Non-fiction':
        return 'from-green-500 to-teal-600';
      case 'Academic':
        return 'from-yellow-500 to-amber-600';
      case 'Children':
        return 'from-pink-500 to-rose-600';
      case 'Reference':
        return 'from-purple-500 to-violet-600';
      case 'Self-help':
        return 'from-red-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
      {/* Genre header banner */}
      <div className={`p-4 text-white bg-gradient-to-r ${getGenreGradient(genre)}`}>
        <div className="font-medium">{genre || 'Uncategorized'}</div>
      </div>
      
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 italic">by {author}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="font-mono tracking-tight">{ISBN}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div className={`text-sm font-medium ${copiesAvailable > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {copiesAvailable > 0 ? (
                <span className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {copiesAvailable} {copiesAvailable === 1 ? 'copy' : 'copies'} available
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Out of stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 