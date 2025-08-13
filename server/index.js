const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const db = require('./database');
require('./config/passport'); // Passport configuration

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.SESSION_SECRET],
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/auth');
app.use(authRouter);

const requireLogin = require('./middleware/requireLogin');
const keywordsRouter = require('./routes/keywords');
app.use('/api/keywords', requireLogin, keywordsRouter);

const auditRouter = require('./routes/audit');
app.use('/api/audit', requireLogin, auditRouter);

const shopifyRouter = require('./routes/shopify');
app.use('/api/shopify', requireLogin, shopifyRouter);

const webhooksRouter = require('./routes/webhooks');
app.use('/api/webhooks', webhooksRouter); // Webhooks are not protected by user login

const aiRouter = require('./routes/ai');
app.use('/api/ai', requireLogin, aiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
