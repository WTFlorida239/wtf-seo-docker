export const getKeywords = async () => {
  const response = await fetch('/api/keywords');
  if (!response.ok) {
    throw new Error('Failed to fetch keywords');
  }
  return response.json();
};

export const addKeyword = async (text) => {
  const response = await fetch('/api/keywords', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error('Failed to add keyword');
  }
  return response.json();
};

export const deleteKeyword = async (id) => {
  const response = await fetch(`/api/keywords/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete keyword');
  }
  return response.json();
};
