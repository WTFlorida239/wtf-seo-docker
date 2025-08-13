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
      roleId INTEGER DEFAULT 2, -- Default to 'Editor' role
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (roleId) REFERENCES roles (id)
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

  const createRolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );
  `;

  const createPermissionsTable = `
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT UNIQUE NOT NULL -- e.g., 'manage_users', 'edit_seo', 'view_analytics'
    );
  `;

  const createRolePermissionsTable = `
    CREATE TABLE IF NOT EXISTS role_permissions (
      roleId INTEGER,
      permissionId INTEGER,
      PRIMARY KEY (roleId, permissionId),
      FOREIGN KEY (roleId) REFERENCES roles (id),
      FOREIGN KEY (permissionId) REFERENCES permissions (id)
    );
  `;

  db.exec(createRolesTable);
  db.exec(createPermissionsTable);
  db.exec(createRolePermissionsTable);
  db.exec(createUserTable);
  db.exec(createKeywordsTable);
  db.exec(createCompetitorsTable);
  db.exec(createWebhooksTable);
  db.exec(createSocialAccountsTable);
  db.exec(createSocialPostsTable);
};

const seedDatabase = () => {
  const insertRole = db.prepare('INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)');
  const insertPermission = db.prepare('INSERT OR IGNORE INTO permissions (id, action) VALUES (?, ?)');
  const insertRolePermission = db.prepare('INSERT OR IGNORE INTO role_permissions (roleId, permissionId) VALUES (?, ?)');

  const roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'editor' },
    { id: 3, name: 'viewer' },
  ];

  const permissions = [
    { id: 1, action: 'manage_users' },
    { id: 2, action: 'manage_billing' },
    { id: 3, action: 'edit_seo' },
    { id: 4, action: 'edit_social' },
    { id: 5, action: 'view_analytics' },
  ];

  const rolePermissions = {
    admin: [1, 2, 3, 4, 5], // Can do everything
    editor: [3, 4, 5],      // Can edit content and view analytics
    viewer: [5],            // Can only view analytics
  };

  db.transaction(() => {
    roles.forEach(role => insertRole.run(role.id, role.name));
    permissions.forEach(perm => insertPermission.run(perm.id, perm.action));
    for (const roleName in rolePermissions) {
      const roleId = roles.find(r => r.name === roleName).id;
      rolePermissions[roleName].forEach(permissionId => {
        insertRolePermission.run(roleId, permissionId);
      });
    }
  })();
};


createTables();
seedDatabase();

module.exports = db;
