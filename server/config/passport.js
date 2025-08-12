const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = db.prepare('SELECT * FROM users WHERE googleId = ?').get(profile.id);

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUserStmt = db.prepare(
          'INSERT INTO users (googleId, name, email) VALUES (?, ?, ?)'
        );
        const newUserInfo = newUserStmt.run(
          profile.id,
          profile.displayName,
          profile.emails[0].value
        );
        const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(newUserInfo.lastInsertRowid);
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
