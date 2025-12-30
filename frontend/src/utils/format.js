/**
 * =====================================================
 * Format Utilities
 * -----------------------------------------------------
 * Helper kecil, reusable, aman
 * =====================================================
 */

export const formatDateTime = (date) => {
  if (!date) return 'Unknown time';

  try {
    return new Date(date).toLocaleString();
  } catch {
    return 'Invalid date';
  }
};

export const truncateText = (text, limit = 200) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '…';
};
