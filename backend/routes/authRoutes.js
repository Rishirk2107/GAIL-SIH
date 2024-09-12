const express = require('express');
const router = express.Router();
const {loginUser,registerUser,verify2fa} = require('../controller/authenticate');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/verify',verify2fa);

module.exports = router;
