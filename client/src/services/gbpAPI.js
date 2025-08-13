export const generateGbpReply = async (reviewId, reviewData) => {
  const response = await fetch(`/api/gbp/reviews/${reviewId}/generate-response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate AI reply');
  }
  return response.json();
};

export const postGbpReply = async (reviewId, replyText) => {
  const response = await fetch(`/api/gbp/reviews/${reviewId}/post-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ replyText }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to post reply');
  }
  return response.json();
};
