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

  db.exec(createUserTable);
  db.exec(createKeywordsTable);
  db.exec(createCompetitorsTable);
  db.exec(createWebhooksTable);
};

createTables();

module.exports = db;
