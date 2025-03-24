import passport from 'passport';
import transporter from '../config/nodemailer.js';
import { GOOGLE_WELCOME_EMAIL_TEMPLATE } from '../config/emailTemplates.js';
import userModel from '../models/userModel.js';

// Google OAuth Callback Controller
export const googleCallback = async (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
        }

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
        }

        try {
            // Check if this is a new user
            const existingUser = await userModel.findOne({ email: user.email });
            const isNewUser = !existingUser;

            req.login(user, async (loginErr) => {
                if (loginErr) {
                    return res.redirect(`${process.env.FRONTEND_URL}/login?error=login_failed`);
                }

                // If this is a new user, send welcome email
                if (isNewUser) {
                    try {
                        const mailOptions = {
                            from: process.env.SENDER_EMAIL,
                            to: user.email,
                            subject: "Welcome to MovieMood",
                            html: GOOGLE_WELCOME_EMAIL_TEMPLATE
                                .replace("{{name}}", user.name)
                                .replace("{{email}}", user.email)
                                .replace("{{welcome_link}}", process.env.FRONTEND_URL),
                        };

                        await transporter.sendMail(mailOptions);
                    } catch (emailError) {
                        console.error("Error sending welcome email:", emailError);
                        // Continue with the flow even if email fails
                    }
                }
                
                // Successful authentication, redirect home
                return res.redirect(process.env.FRONTEND_URL);
            });
        } catch (error) {
            console.error("Error in Google callback:", error);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
        }
    })(req, res, next);
};