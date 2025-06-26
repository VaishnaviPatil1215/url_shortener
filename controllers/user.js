// const { v4: uuidv4 } = require('uuid');
// const User = require("../models/user");
// const { setUser } = require('../service/auth');

// async function handleUserSignup(req, res) {
//     const { name, email, password } = req.body;
//     await User.create({
//         name,
//         email,
//         password,
//     });
//     // return res.render("home");
//     return res.redirect("/");
// }

// async function handleUserlogin(req, res) {
//     const { email, password } = req.body;
//     const user = await User.findOne({
//         email, password
//     });
//     if (!user) {
//         return res.render("login", {
//             error: "Invalid Username or Password",
//         });
//     }
//     const sessionId = uuidv4();
//     setUser(sessionId, user);
//     res.cookie("uid", sessionId);
//     return res.redirect("/");
// }

// module.exports = {
//     handleUserSignup,
//     handleUserlogin,
// };

const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const { setUser } = require('../service/auth'); // Using the function to store session in Map

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    return res.redirect("/login"); // Redirect to login after signup
}

async function handleUserlogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.render("login", { error: "Invalid Username or Password" });
    }

    // Generate a session ID using uuid and store the user in the session map
    // const sessionId = uuidv4();

    const token = setUser(user);

    // Set the session ID in the cookie
    res.cookie("uid", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hour
        // secure: true, // ❌ only use this on HTTPS, NOT localhost
    });
    // Cookie expires in 1 hour
    return res.redirect("/"); // Redirect to home page after login
}

module.exports = {
    handleUserSignup,
    handleUserlogin,
};
