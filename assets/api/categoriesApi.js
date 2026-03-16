import { API_URL } from '../utils/constants.js';

//
export const getCategories = async () => {
  try {
    const res = fetch(`${API_URL}/categories`);

    if (!res.ok) throw new Error('');

    const categories = await res.json();

    return { type: null, data: categories };

    //
  } catch (err) {}
};
