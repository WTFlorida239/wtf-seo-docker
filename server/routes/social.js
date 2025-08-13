const express = require('express');
const router = express.Router();
const { addSocialAccount, getSocialAccounts, schedulePost } = require('../services/socialService');
const requirePermission = require('../middleware/requirePermission');

// All routes in this file are protected by the requireLogin middleware in server/index.js

router.get('/accounts', (req, res) => {
  try {
    const accounts = getSocialAccounts(req.user.id);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve social accounts.' });
  }
});

router.post('/accounts', requirePermission('edit_social'), (req, res) => {
  const { platform, username, accessToken, refreshToken } = req.body;
  if (!platform || !username || !accessToken) {
    return res.status(400).json({ error: 'Platform, username, and accessToken are required.' });
  }

  try {
    const newAccount = addSocialAccount({
      userId: req.user.id,
      platform,
      username,
      accessToken,
      refreshToken,
    });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add social account.' });
  }
});

router.post('/posts', requirePermission('edit_social'), (req, res) => {
  const { socialAccountId, content, mediaUrls, scheduledAt } = req.body;
  if (!socialAccountId || !content || !scheduledAt) {
    return res.status(400).json({ error: 'socialAccountId, content, and scheduledAt are required.' });
  }

  try {
    const newPost = schedulePost({
      userId: req.user.id,
      socialAccountId,
      content,
      mediaUrls: mediaUrls || [],
      scheduledAt,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule post.' });
  }
});

module.exports = router;
