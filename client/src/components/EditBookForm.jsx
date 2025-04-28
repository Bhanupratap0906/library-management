import React from 'react';
import { useBookValidation } from './Validator';
import ErrorAlert from './common/ErrorAlert';

// This is a specialized version of the form that can be embedded directly in a page
// It reuses the same validation logic as the modal but is designed for inline use
const EditBookForm = ({ book, onSave, onCancel }) => {
  // This component reuses the same logic from AddBookModal but with a different UI layout
  // It's a good example of how the validation can be reused across different components
  
  // We could reimplement the same form logic here, but since it's so similar to AddBookModal
  // we'll import that component and render it with slightly different styling
  // This shows how the validation logic can be reused across different UIs
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Book Details</h3>
      
      {/* We're importing and reusing the same AddBookModal component internally */}
      {/* This demonstrates how BookValidator can be shared across different UI components */}
      <div className="BookValidator-wrapped-component">
        {/* The BookValidator context provides validation to all child components */}
        <BookFormContent
          book={book}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

// Internal component that uses the validation context
const BookFormContent = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    title: book?.title || '',
    author: book?.author || '',
    ISBN: book?.ISBN || '',
    publishedDate: book?.publishedDate || '',
    genre: book?.genre || '',
    copiesAvailable: book?.copiesAvailable || 1
  });
  
  const [errors, setErrors] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  
  // Get validation from context
  const { validate } = useBookValidation();
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
    
    if (submitted) {
      validateForm();
    }
  };
  
  const validateForm = () => {
    const result = validate(formData);
    setErrors(result.isValid ? null : result.errorElements);
    return result.isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      onSave({...formData, id: book?.id});
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors && <ErrorAlert messages={errors} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title-inline" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title-inline"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="author-inline" className="block text-sm font-medium text-gray-700">
            Author *
          </label>
          <input
            type="text"
            id="author-inline"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="ISBN-inline" className="block text-sm font-medium text-gray-700">
            ISBN *
          </label>
          <input
            type="text"
            id="ISBN-inline"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="publishedDate-inline" className="block text-sm font-medium text-gray-700">
            Published Date *
          </label>
          <input
            type="date"
            id="publishedDate-inline"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="genre-inline" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="genre-inline"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
        
        <div>
          <label htmlFor="copiesAvailable-inline" className="block text-sm font-medium text-gray-700">
            Copies Available
          </label>
          <input
            type="number"
            id="copiesAvailable-inline"
            name="copiesAvailable"
            value={formData.copiesAvailable}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditBookForm; 