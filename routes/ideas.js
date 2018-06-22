const express = require('express');
const router = express.Router();


// 添加用户
router.get('/add', (req, res) => {
    res.render("ideas/add", {
        script: "/public/js/addUser.js",
        title: "添加用户"
    });
});

// 所有用户
router.get("/", (req, res) => {
    res.render("ideas/index", {
        script: "/public/js/ideasUser.js",
        title: "所有用户"
    });
});

module.exports = router;