import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const oauthRouter = express.Router();

// Initiate Google OAuth login
oauthRouter.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
oauthRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie and redirect
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/oauth/callback`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

export default oauthRouter;