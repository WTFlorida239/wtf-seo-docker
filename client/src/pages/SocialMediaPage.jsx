import React, { useState, useEffect } from 'react';
import { getSocialAccounts, addSocialAccount, schedulePost } from '../services/socialAPI';

const SocialMediaPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect Account Form state
  const [platform, setPlatform] = useState('facebook');
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');

  // Scheduler Form state
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [content, setContent] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');


  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getSocialAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSocialAccount({ platform, username, accessToken, refreshToken: '' }); // refreshToken is optional
      // Reset form and refetch accounts
      setPlatform('facebook');
      setUsername('');
      setAccessToken('');
      fetchAccounts();
    } catch (err) {
      alert(`Error adding account: ${err.message}`);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccountId) {
      alert('Please select an account to post to.');
      return;
    }
    try {
      await schedulePost({
        socialAccountId: selectedAccountId,
        content,
        scheduledAt,
      });
      alert('Post scheduled successfully!');
      // Reset form
      setContent('');
      setScheduledAt('');
    } catch (err) {
      alert(`Error scheduling post: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Social Media Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Scheduler</h2>
          <p>Compose and schedule a new post.</p>
          <form onSubmit={handleScheduleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Post to Account: </label>
              <select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)} required>
                <option value="">Select an account...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.username} ({acc.platform})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Content: </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ width: '95%', minHeight: '100px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Schedule for (YYYY-MM-DD HH:MM): </label>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
            </div>
            <button type="submit">Schedule Post</button>
          </form>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Connect New Account</h2>
        <p>This is a simplified form for demo purposes. A real implementation would involve an OAuth flow for each platform.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Platform: </label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Username: </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Access Token: </label>
            <input type="text" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} required />
          </div>
          <button type="submit">Connect Account</button>
        </form>
      </div>
      </div>

      <div style={{ marginTop: '40px', gridColumn: '1 / -1' }}>
        <h2>Connected Accounts</h2>
        {isLoading && <p>Loading accounts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {accounts.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {accounts.map(acc => (
              <li key={acc.id} style={{ background: '#f5f5f5', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <strong>{acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)}:</strong> {acc.username}
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p>No social accounts connected yet.</p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPage;
