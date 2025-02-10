const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Access denied" });
    try { 
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).json({ success: false, message: "Token is not valid" });
    }
}

exports.authorizeRoles= (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "User is not authorized" });
        }
        next();
    }
}