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

// Route to get the current user
router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
