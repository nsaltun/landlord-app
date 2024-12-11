// api.js
export const calculateData = async (formData) => {
    try {
      const response = await fetch('http://localhost:8080/land/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':'*/*',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // Adjust according to your API response model
    } catch (error) {
      throw new Error(error.message || 'Something went wrong');
    }
  };
  