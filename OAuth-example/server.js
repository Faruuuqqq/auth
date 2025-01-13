const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// passport configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            // save or verify user in database
            const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
            return done(null, user);
        }
    )
);

// Serialize and deserialize user 
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware
app.use(passport.initialize());

//Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email']})
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login'}),
    (req, res) => {
        res.json({ message: 'Login successful', user: req.user})
    }
);

app.get('/protected', (req, res) => {
    // simulation protected route (recommend use session/token)
    res.send('This is a protected route. Only logged-in users can access it');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});

