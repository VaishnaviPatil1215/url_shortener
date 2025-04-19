const express = require("express");

const router = express.Router();

router.get('/', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home");
});

module.exports = router;