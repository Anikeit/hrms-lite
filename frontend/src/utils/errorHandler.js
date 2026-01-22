/**
 * Extracts user-friendly error messages from API error responses
 * Backend should send user-friendly error messages in the 'error' field
 * @param {Error} error - The error object from axios
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  if (!error?.response?.data) {
    return error?.message || 'An unexpected error occurred'
  }

  const errorData = error.response.data

  // Backend sends user-friendly messages in the 'error' field
  if (errorData.error) {
    // If error is a string, return it directly
    if (typeof errorData.error === 'string') {
      return errorData.error
    }
    
    // If error is an object, try to extract meaningful message
    if (typeof errorData.error === 'object') {
      // Handle non_field_errors
      if (errorData.error.non_field_errors && Array.isArray(errorData.error.non_field_errors)) {
        return errorData.error.non_field_errors[0]
      }
      
      // Handle field-specific errors (take first error from first field)
      const fieldKeys = Object.keys(errorData.error)
      for (const key of fieldKeys) {
        if (Array.isArray(errorData.error[key]) && errorData.error[key].length > 0) {
          return errorData.error[key][0]
        }
        if (typeof errorData.error[key] === 'string') {
          return errorData.error[key]
        }
      }
    }
  }

  // Handle non_field_errors at root level
  if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
    return errorData.non_field_errors[0]
  }

  // Handle field-specific errors at root level
  if (typeof errorData === 'object') {
    const fieldKeys = Object.keys(errorData)
    for (const key of fieldKeys) {
      if (key === 'error') continue // Already handled above
      if (Array.isArray(errorData[key]) && errorData[key].length > 0) {
        return errorData[key][0]
      }
      if (typeof errorData[key] === 'string') {
        return errorData[key]
      }
    }
  }

  // Fallback
  return 'An error occurred. Please try again.'
}
