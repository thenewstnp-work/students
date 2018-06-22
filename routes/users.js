const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();


// 引入mongoDB模型
require("../models/Idea");

const Idea = mongoose.model("student");

var resJson;

// 初始化 resJson
router.use((req, res, next) => {
    resJson = {
        code: 0,
        message: "",
        item: [],
        id: []
    }
    next();
});

//查询
router.get("/list", (req, res) => {
    // console.info(req.query);
    var index = req.query.page || 0;
    var size = req.query.size || 3;
    // var c = list.slice(index*size,(index-1+2)*size);
    Idea.find({}).sort({ date: "desc" }).then(userinfo => {
        // console.log(userinfo[0]._id);
        var students = userinfo.slice(index * size, (index - 1 + 2) * size);
        // console.log(c);
        for (let i = 0; i < students.length; i++) {
            resJson.item.push({
                stu_name: students[i].stu_name,
                stu_age: students[i].stu_age,
                stu_sex: students[i].stu_sex,
                stu_class: students[i].stu_class,
            });
        };
        for (let a = 0; a < students.length; a++) {
            resJson.id.push({
                id: students[a]._id
            });
        };
        // console.log(resJson.id);
        resJson.code = 200;
        resJson.msg = "操作成功";
        res.json(resJson);
    });
});

//添加
router.get('/add', (req, res) => {
    const reg_username = /^[\u4E00-\u9FA5A-Za-z]+$/;
    const reg_age = /^(?:[1-9]?\d|100)$/;
    const reg_sex = /^['男'|'女']$/;
    // console.log(req.query);
    if (!req.query.username) {
        resJson.code = 500;
        resJson.msg = "请输入姓名";
        res.json(resJson);
        return;
    }
    if (reg_username.test(req.query.username) == false) {
        resJson.code = 500;
        resJson.msg = "只能输入中文和英文，请重新输入";
        res.json(resJson);
        return;
    }
    if (!req.query.userage) {
        resJson.code = 500;
        resJson.msg = "请输入年龄";
        res.json(resJson);
        return;
    }

    if (reg_age.test(req.query.userage) == false) {
        resJson.code = 500;
        resJson.msg = "年龄输入错误，请重新输入";
        res.json(resJson);
        return;
    }
    if (!req.query.usersex) {
        resJson.code = 500;
        resJson.msg = "请输入性别";
        res.json(resJson);
        return;
    }
    if (reg_sex.test(req.query.usersex) == false) {
        resJson.code = 500;
        resJson.msg = "性别输入错误，请重新输入";
        res.json(resJson);
        return;
    }
    if (!req.query.userclass) {
        resJson.code = 500;
        resJson.msg = "请输入班级";
        res.json(resJson);
        return;
    } else {
        const newUser = {
            stu_name: req.query.username,
            stu_age: req.query.userage,
            stu_sex: req.query.usersex,
            stu_class: req.query.userclass
        }
        new Idea(newUser).save().then(idda => {
            req.flash("success_msg", "添加成功");
            resJson.code = 200;
            resJson.msg = "操作成功";
            resJson.item.push({
                stu_name: req.query.username,
                stu_age: req.query.userage,
                stu_sex: req.query.usersex,
                stu_class: req.query.userclass
            });
            res.json(resJson);
        });
    };
});

router.get("/edit/:uId", (req, res) => {
    // console.log(req.params.uId);
    Idea.findOne({
        _id: req.params.uId
    }).then(idea => {
        // console.log(idea);
        res.render("users/edit", {
            title: "编辑用户",
            script: "/public/js/editUsers.js",
            idea: idea
        });
    });
});

//编辑
router.put("/edit/:id", (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        // console.log(idea);
        idea.stu_name = req.body.username;
        idea.stu_age = req.body.userage;
        idea.stu_sex = req.body.usersex;
        idea.stu_class = req.body.userclass;

        idea.save().then(idea => {
            req.flash("success_msg", "编辑成功");
            res.redirect("/ideas");
        });
    });
});

//删除
router.post("/delete", (req, res) => {
    // console.log(req.body);
    if (!req.body.id) {
        resJson.code = 500;
        resJson.msg = "用户ID没有传";
        res.json(resJson);
        return;
    }

    Idea.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "操作成功");
        resJson.code = 200;
        resJson.msg = "操作成功";
        res.json(resJson);
    });
});

router.get("/login", (req, res) => {
    res.render("users/login" ,{
        title:"登录"
    });
});

router.get("/register", (req, res) => {
    res.render("users/register" , {
        title:"注册"
    });
});

router.post("/register", (req,res) => {
    // console.log(req.body);
    // res.send("REG");
    let errors = [];
    if(req.body.password != req.body.password2) {
        errors.push({
            msg: "两次的密码不一致"
        })
        return;
    }

    if(req.body.password.length < 8) {
        errors.push({
            msg: "密码的长度不能小于四位"
        })
        return;
    }
    if(errors.length > 0) {
        res.render("users/register", {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }
});

module.exports = router;