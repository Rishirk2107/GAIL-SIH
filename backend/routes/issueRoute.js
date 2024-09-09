const express = require('express');
const router = express.Router();
const {registerIssue}=require("../controller/issue")

router.post('/submit', registerIssue);

module.exports=router;