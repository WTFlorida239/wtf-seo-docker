const Database = require('better-sqlite3');
const path = require('path');

const db = new Database('db.sqlite3', { fileMustExist: false });

const createTables = () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      googleId TEXT UNIQUE,
      name TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createKeywordsTable = `
    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      text TEXT NOT NULL,
      tracked BOOLEAN DEFAULT true,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `;

  const createCompetitorsTable = `
    CREATE TABLE IF NOT EXISTS competitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      domain TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `;

  const createWebhooksTable = `
    CREATE TABLE IF NOT EXISTS webhooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      payload TEXT NOT NULL,
      receivedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createSocialAccountsTable = `
    CREATE TABLE IF NOT EXISTS social_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      platform TEXT NOT NULL, -- e.g., 'facebook', 'instagram'
      username TEXT NOT NULL,
      access_token TEXT NOT NULL, -- Encrypted
      refresh_token TEXT, -- Encrypted
      iv TEXT NOT NULL, -- Initialization Vector for encryption
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `;

  const createSocialPostsTable = `
    CREATE TABLE IF NOT EXISTS social_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      socialAccountId INTEGER,
      content TEXT NOT NULL,
      media_urls TEXT, -- JSON array of strings
      status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, published, failed
      scheduled_at TEXT NOT NULL,
      published_at TEXT,
      error_message TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (socialAccountId) REFERENCES social_accounts (id)
    );
  `;

  db.exec(createUserTable);
  db.exec(createKeywordsTable);
  db.exec(createCompetitorsTable);
  db.exec(createWebhooksTable);
  db.exec(createSocialAccountsTable);
  db.exec(createSocialPostsTable);
};

createTables();

module.exports = db;
