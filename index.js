const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const URL = require("./models/url");
const path = require("path");
const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));



app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRoute);


// Route to handle redirection from short URL
// app.get('/test', async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     });
// });

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    console.log("Short ID requested:", shortId);

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    console.log("Entry found:", entry);

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
});

// Route to handle creation of short URLs
app.use("/url", urlRoute);

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
