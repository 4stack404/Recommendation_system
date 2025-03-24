import jwt from 'jsonwebtoken';

export const generateAuthToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const sendLoginResponse = (res, user) => {
    if (!user || !user._id) {
        throw new Error('Invalid user data');
    }

    try {
        // Generate JWT token
        const token = generateAuthToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // For OAuth callback, we need to check if headers have been sent
        if (!res.headersSent) {
            return res.json({
                success: true,
                message: 'Login successful',
                user: {
                    name: user.name,
                    email: user.email,
                    isAccountVerified: user.isAccountVerified
                }
            });
        }
    } catch (error) {
        console.error('Error in sendLoginResponse:', error);
        throw error;
    }
};
