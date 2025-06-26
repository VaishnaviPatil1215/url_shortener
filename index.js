// const express = require("express");
// const cookieParser = require('cookie-parser');
// const { connectToMongoDB } = require("./connect");
// const { restrictToLoggedinUserOnly } = require('./middlewares/auth');


// const URL = require("./models/url");
// const path = require("path");
// const app = express();
// const PORT = 8001;

// const urlRoute = require('./routes/url');
// const staticRoute = require('./routes/staticRouter');
// const userRoute = require('./routes/user')

// // Connect to MongoDB
// connectToMongoDB("mongodb://localhost:27017/short-url")
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));


// app.use(cookieParser());
// app.set("view engine", "ejs");
// app.set('views', path.resolve("./views"));

// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));



// app.use("/url", restrictToLoggedinUserOnly, urlRoute);
// app.use("/", staticRoute);
// app.use("/user", userRoute);

// // Route to handle redirection from short URL
// // app.get('/test', async (req, res) => {
// //     const allUrls = await URL.find({});
// //     return res.render("home", {
// //         urls: allUrls,
// //     });
// // });

// app.get("/:shortId", async (req, res) => {
//     const shortId = req.params.shortId;
//     console.log("Short ID requested:", shortId);

//     const entry = await URL.findOneAndUpdate(
//         { shortId },
//         {
//             $push: {
//                 visitHistory: {
//                     timestamp: Date.now(),
//                 },
//             },
//         }
//     );

//     console.log("Entry found:", entry);

//     if (!entry) {
//         return res.status(404).json({ error: "Short URL not found" });
//     }

//     res.redirect(entry.redirectURL);
// });

// // Route to handle creation of short URLs
// app.use("/url", urlRoute);

// // Start the server
// app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));


const express = require("express");
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');
const URL = require("./models/url");
const path = require("path");
const app = express();
const PORT = 8001;

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

// Create an in-memory session store (Map)
const sessionIdToUserMap = new Map();

// Set up middleware
app.use(cookieParser());
app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to handle session using Map
function setUser(sessionId, user) {
    sessionIdToUserMap.set(sessionId, user);
}

function getUser(sessionId) {
    return sessionIdToUserMap.get(sessionId);
}

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);

// Route to handle redirection from short URL
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    console.log("Short ID requested:", shortId);

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: { visitHistory: { timestamp: Date.now() } }
        }
    );

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
