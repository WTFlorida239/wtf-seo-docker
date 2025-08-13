const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start Google authentication
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Callback route after Google has authenticated the user
router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // On success, redirect to the client's dashboard
    res.redirect('/dashboard');
  }
);

// Route to log out the user
router.get('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

const db = require('../database');

// Route to get the current user, including their role and permissions
router.get('/api/current_user', (req, res) => {
  if (!req.user) {
    return res.send(null);
  }

  try {
    // Get role name
    const roleStmt = db.prepare('SELECT name FROM roles WHERE id = ?');
    const role = roleStmt.get(req.user.roleId);

    // Get permissions
    const permsStmt = db.prepare(`
      SELECT p.action
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permissionId
      WHERE rp.roleId = ?
    `);
    const permissions = permsStmt.all(req.user.roleId).map(p => p.action);

    const userWithPermissions = {
      ...req.user,
      role: role ? role.name : null,
      permissions: permissions,
    };

    res.send(userWithPermissions);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching user permissions.' });
  }
});

module.exports = router;
