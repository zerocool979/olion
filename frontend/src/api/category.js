// frontend/src/api/category.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/categories';

/**
 * Ambil semua kategori
 */
export async function getCategories(token) {
  const res = await fetch(BASE_URL, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch categories');
  }

  return res.json();
}

/**
 * Ambil detail kategori tertentu
 * @param {string} categoryId
 * @param {string} token
 */
export async function getCategoryById(categoryId, token) {
  const res = await fetch(`${BASE_URL}/${categoryId}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch category');
  }

  return res.json();
}

/**
 * Buat kategori baru (ADMIN)
 * @param {object} data - { name, description }
 * @param {string} token
 */
export async function createCategory(data, token) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create category');
  }

  return res.json();
}

/**
 * Update kategori (ADMIN)
 * @param {string} categoryId
 * @param {object} data - { name?, description? }
 * @param {string} token
 */
export async function updateCategory(categoryId, data, token) {
  const res = await fetch(`${BASE_URL}/${categoryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update category');
  }

  return res.json();
}

/**
 * Hapus kategori (ADMIN)
 * @param {string} categoryId
 * @param {string} token
 */
export async function deleteCategory(categoryId, token) {
  const res = await fetch(`${BASE_URL}/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete category');
  }

  return res.json();
}
