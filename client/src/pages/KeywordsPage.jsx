import React, { useState, useEffect } from 'react';
import { getKeywords, addKeyword, deleteKeyword } from '../services/keywordAPI';

const KeywordsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const data = await getKeywords();
        setKeywords(data);
      } catch (err) {
        setError('Failed to fetch keywords. Please log in.');
      }
    };
    fetchKeywords();
  }, []);

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    try {
      const addedKeyword = await addKeyword(newKeyword);
      setKeywords([...keywords, addedKeyword]);
      setNewKeyword('');
    } catch (err) {
      setError('Failed to add keyword.');
    }
  };

  const handleDeleteKeyword = async (id) => {
    try {
      await deleteKeyword(id);
      setKeywords(keywords.filter((k) => k.id !== id));
    } catch (err) {
      setError('Failed to delete keyword.');
    }
  };

  return (
    <div>
      <h1>Keywords</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddKeyword}>
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Enter a new keyword"
        />
        <button type="submit">Add Keyword</button>
      </form>
      <ul>
        {keywords.map((keyword) => (
          <li key={keyword.id}>
            {keyword.text}
            <button onClick={() => handleDeleteKeyword(keyword.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordsPage;
