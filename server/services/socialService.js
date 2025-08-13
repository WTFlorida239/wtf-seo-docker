const crypto = require('crypto');
const db = require('../database');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Key must be 32 bytes

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const addSocialAccount = ({ userId, platform, username, accessToken, refreshToken }) => {
  const { iv, encryptedData: encryptedAccessToken } = encrypt(accessToken);
  let encryptedRefreshToken = null;
  if (refreshToken) {
    encryptedRefreshToken = encrypt(refreshToken).encryptedData;
  }

  const stmt = db.prepare(
    'INSERT INTO social_accounts (userId, platform, username, access_token, refresh_token, iv) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(userId, platform, username, encryptedAccessToken, encryptedRefreshToken, iv);
  return { id: info.lastInsertRowid, platform, username };
};

const getSocialAccounts = (userId) => {
  const stmt = db.prepare('SELECT * FROM social_accounts WHERE userId = ?');
  const accounts = stmt.all(userId);

  return accounts.map(acc => {
    const accessToken = decrypt(acc.access_token, acc.iv);
    const refreshToken = acc.refresh_token ? decrypt(acc.refresh_token, acc.iv) : null;
    return { ...acc, access_token: accessToken, refresh_token: refreshToken };
  });
};

const schedulePost = ({ userId, socialAccountId, content, mediaUrls, scheduledAt }) => {
  const stmt = db.prepare(
    'INSERT INTO social_posts (userId, socialAccountId, content, media_urls, scheduled_at) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(userId, socialAccountId, content, JSON.stringify(mediaUrls), scheduledAt);
  return { id: info.lastInsertRowid };
};

module.exports = { addSocialAccount, getSocialAccounts, schedulePost };
