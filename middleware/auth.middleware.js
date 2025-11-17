const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false, 
            message: "Access denied. No token provided." 
        });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = decoded;
        
        // Continue to next middleware/route handler
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Token has expired. Please login again." 
            });
        }
        
        return res.status(403).json({ 
            success: false, 
            message: "Invalid token." 
        });
    }
};

module.exports = { verifyToken };
