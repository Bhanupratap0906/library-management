import React, { useState, useEffect } from 'react';
import { useBookValidation } from './Validator';
import ErrorAlert from './common/ErrorAlert';

const AddBookModal = ({ book = null, isEdit = false, onSave, onClose }) => {
  const initialFormState = {
    title: '',
    author: '',
    ISBN: '',
    publishedDate: '',
    genre: '',
    copiesAvailable: 1
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Get validation utilities from the context
  const { validate, normalizeDate } = useBookValidation();

  // If editing, populate form with book data
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        ISBN: book.ISBN || '',
        publishedDate: normalizeDate(book.publishedDate) || '',
        genre: book.genre || '',
        copiesAvailable: book.copiesAvailable || 1
      });
    }
  }, [book, normalizeDate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
    
    if (submitted) {
      // Re-validate on change after first submission
      validateForm();
    }
  };

  // Validate the form
  const validateForm = () => {
    const result = validate(formData);
    setErrors(result.isValid ? null : result.errorElements);
    return result.isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {isEdit ? 'Edit Book' : 'Add New Book'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {errors && <ErrorAlert messages={errors} />}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Book title"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Author name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700">
                ISBN <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="ISBN"
                  name="ISBN"
                  value={formData.ISBN}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="10 or 13 digit ISBN"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be a valid 10 or 13 digit ISBN
              </p>
            </div>
            
            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
                Published Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  id="publishedDate"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-fiction">Non-fiction</option>
                  <option value="Academic">Academic</option>
                  <option value="Children">Children's Books</option>
                  <option value="Reference">Reference</option>
                  <option value="Self-help">Self-help</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="copiesAvailable" className="block text-sm font-medium text-gray-700">
                Copies Available
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <input
                  type="number"
                  id="copiesAvailable"
                  name="copiesAvailable"
                  value={formData.copiesAvailable}
                  onChange={handleChange}
                  min="0"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {formData.genre === "Academic" && (
                <p className="mt-1 text-xs text-red-500 bg-red-50 p-1 rounded-md">
                  ⚠️ Academic books require at least 5 copies
                </p>
              )}
            </div>
            
            <div className="pt-4 flex justify-end space-x-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEdit ? 'Save Changes' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;