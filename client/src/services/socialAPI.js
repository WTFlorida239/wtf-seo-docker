export const getSocialAccounts = async () => {
  const response = await fetch('/api/social/accounts');
  if (!response.ok) {
    throw new Error('Failed to fetch social accounts');
  }
  return response.json();
};

export const schedulePost = async (postData) => {
  const response = await fetch('/api/social/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to schedule post');
  }
  return response.json();
};

export const addSocialAccount = async (accountData) => {
  const response = await fetch('/api/social/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add social account');
  }
  return response.json();
};
