const express = require('express');
const { handleUserSignup, handleUserlogin } = require("../controllers/user");
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserlogin);

module.exports = router;