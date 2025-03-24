import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Support both cookies & headers

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.id) {
            req.body.userID = decoded.id;
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default userAuth;
