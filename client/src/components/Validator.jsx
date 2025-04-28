import React, { createContext, useContext } from 'react';

// Create a context for book validation
const BookValidationContext = createContext();

// BookValidator component that provides validation logic
export const BookValidator = ({ children }) => {
  // Reusable validation functions
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

  // String sanitization utility
  const sanitizeString = (str) => {
    return str ? str.trim() : '';
  };

  // Date normalization utility
  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toISOString().split('T')[0] : '';
  };

  // Main validation function
  const validate = (bookData) => {
    const errors = [];
    const sanitizedData = {
      ...bookData,
      title: sanitizeString(bookData.title),
      author: sanitizeString(bookData.author),
      ISBN: sanitizeString(bookData.ISBN),
      publishedDate: normalizeDate(bookData.publishedDate),
    };
    
    // Required fields validation
    if (!sanitizedData.title) {
      errors.push(
        <li key="title" className="text-red-500">
          Title is required
        </li>
      );
    }
    
    if (!sanitizedData.author) {
      errors.push(
        <li key="author" className="text-red-500">
          Author is required
        </li>
      );
    }
    
    if (!sanitizedData.ISBN) {
      errors.push(
        <li key="isbn-required" className="text-red-500">
          ISBN is required
        </li>
      );
    } else if (!validateISBN(sanitizedData.ISBN)) {
      errors.push(
        <li key="isbn-format" className="text-red-500">
          Invalid ISBN format (must be 10 or 13 digits)
        </li>
      );
    }
    
    if (!sanitizedData.publishedDate) {
      errors.push(
        <li key="date-required" className="text-red-500">
          Published date is required
        </li>
      );
    } else if (!validatePublishedDate(sanitizedData.publishedDate)) {
      errors.push(
        <li key="date-invalid" className="text-red-500">
          Published date cannot be in the future
        </li>
      );
    }
    
    // Conditional validation for academic books
    if (!validateAcademicCopies(sanitizedData.genre, sanitizedData.copiesAvailable)) {
      errors.push(
        <li key="academic-copies" className="text-red-500">
          Academic books must have at least 5 copies available
        </li>
      );
    }
    
    return {
      isValid: errors.length === 0,
      validatedData: sanitizedData,
      errorElements: errors.length > 0 ? <ul className="list-disc pl-5">{errors}</ul> : null
    };
  };

  // Context value
  const contextValue = {
    validate,
    sanitizeString,
    normalizeDate,
    validateISBN,
    validatePublishedDate,
    validateAcademicCopies
  };

  return (
    <BookValidationContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </BookValidationContext.Provider>
  );
};

// Custom hook for consuming the validation context
export const useBookValidation = () => {
  const context = useContext(BookValidationContext);
  if (context === undefined) {
    throw new Error('useBookValidation must be used within a BookValidator component');
  }
  return context;
};

// Standalone validation function for server-side usage
export const validateBook = (bookData) => {
  // Create a temporary instance to use the validation logic
  const validator = {
    validateISBN: (isbn) => /^(?:\d{9}[\dXx]|\d{13})$/.test(isbn),
    validatePublishedDate: (date) => {
      const publishedDate = new Date(date);
      const today = new Date();
      return !isNaN(publishedDate) && publishedDate <= today;
    },
    validateAcademicCopies: (genre, copies) => {
      return genre !== "Academic" || (genre === "Academic" && copies >= 5);
    },
    sanitizeString: (str) => str ? str.trim() : '',
    normalizeDate: (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    }
  };
  
  const errors = [];
  const sanitizedData = {
    ...bookData,
    title: validator.sanitizeString(bookData.title),
    author: validator.sanitizeString(bookData.author),
    ISBN: validator.sanitizeString(bookData.ISBN),
    publishedDate: validator.normalizeDate(bookData.publishedDate),
  };
  
  // Required fields
  if (!sanitizedData.title) errors.push("Title is required");
  if (!sanitizedData.author) errors.push("Author is required");
  
  if (!sanitizedData.ISBN) {
    errors.push("ISBN is required");
  } else if (!validator.validateISBN(sanitizedData.ISBN)) {
    errors.push("Invalid ISBN format (must be 10 or 13 digits)");
  }
  
  if (!sanitizedData.publishedDate) {
    errors.push("Published date is required");
  } else if (!validator.validatePublishedDate(sanitizedData.publishedDate)) {
    errors.push("Published date cannot be in the future");
  }
  
  if (!validator.validateAcademicCopies(sanitizedData.genre, sanitizedData.copiesAvailable)) {
    errors.push("Academic books must have at least 5 copies available");
  }
  
  return {
    isValid: errors.length === 0,
    validatedData: sanitizedData,
    errors
  };
}; 