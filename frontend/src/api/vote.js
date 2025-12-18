import api from './base';

/**
 * =====================================================
 * Vote API
 * -----------------------------------------------------
 * Upvote / Downvote logic
 * =====================================================
 */

/**
 * Vote item (discussion / answer)
 * @param {Object} payload
 * @param {'discussion'|'answer'} payload.type
 * @param {number} payload.targetId
 * @param {'up'|'down'} payload.value
 */
export const vote = async ({ type, targetId, value }) => {
  if (!type || !targetId || !value) {
    throw new Error('type, targetId, and value are required');
  }

  try {
    const res = await api.post('/votes', {
      type,
      targetId,
      value,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Batalkan vote
 */
export const revokeVote = async ({ type, targetId }) => {
  if (!type || !targetId) {
    throw new Error('type and targetId are required');
  }

  try {
    const res = await api.delete('/votes', {
      data: { type, targetId },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
