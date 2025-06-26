

const { getUser } = require('../service/auth');

async function restrictToLoggedinUserOnly(req, res, next) {
    const token = req.cookies?.uid;

    if (!token) {
        return res.redirect("/login"); // No token means user is not logged in
    }

    try {
        const user = getUser(token); // Decode and verify token
        req.user = user;
        next();
    } catch (err) {
        console.error("Invalid or expired token:", err.message);
        return res.redirect("/login");
    }
}

async function checkAuth(req, res, next) {
    const token = req.cookies?.uid;

    try {
        const user = getUser(token);
        req.user = user;
    } catch (err) {
        req.user = null; // Just skip attaching if invalid
    }

    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};
