require('dotenv');
const jwt = require('jsonwebtoken');

const userMiddleware = (req , res , next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }
    const words = token.split(" ");
    const jwtToken = words[1];
    try {
        const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (decodedValue.userId && decodedValue.role) {
            req.user = {
                userId: decodedValue.userId,
                role: decodedValue.role
            };
            next();
        } else {
            res.status(403).json({
                message: "You are not authenticated"
            });
        }
    } catch (e) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
module.exports = {
    userMiddleware
};
