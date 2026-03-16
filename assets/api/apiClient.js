import { API_URL } from '../utils/constants.js';

/**
 * A helper function for executing API requests and standardizing error handling
 * @param {string} endpoint - the endpoint (eg '/categories')
 * @param {Object} options - fetch options (method, body, headers...)
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, options);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data };

    // Catch error
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err.message);
    return { success: false, error: err.message };
  }
};
