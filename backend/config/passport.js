import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["profile", "email"],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this email or Google ID
        let user = await User.findOne({ 
          $or: [
            { email: profile.emails[0].value },
            { googleId: profile.id }
          ]
        });

        if (user) {
          // Update user if necessary
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authMethod = 'google';
            user.isAccountVerified = true;
            await user.save();
          }
          return done(null, user);
        }

        // If not, create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          isAccountVerified: true,
          googleId: profile.id,
          authMethod: 'google'
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;