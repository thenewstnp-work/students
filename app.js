const express = require('express');

const bodyParser = require('body-parser')

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');

const session = require('express-session');

const flash = require('connect-flash');

const methodOverride = require('method-override');

const app = express();

mongoose.connect("mongodb://localhost/studentDB").then(() => {
    console.log("数据库连接成功");
}).catch(err => {
    console.log(err);
})

require("./models/Idea");

const Idea = mongoose.model("student");

//静态文件托管
app.use('/public', express.static(__dirname + '/public'));

app.use(methodOverride('_method'));

//配置模板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//配置全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

var resJson;

app.use((req, res, next) => {
    resJson = {
        code: 0,
        message: "",
        item: [],
        id: []
    }
    next();
});

//首页路由
app.get('/', (req, res) => {
    res.render("index", {
        title: "学生用户端信息管理系统",
    });
});

app.get('/about', (req, res) => {
    res.render("about", {
        title: "关于"
    });
});

app.get('/ideas/add', (req, res) => {
    res.render("ideas/add", {
        script: "/public/js/addUser.js",
        title: "添加用户"
    });
});

app.get("/ideas", (req, res) => {
    res.render("ideas/index", {
        script: "/public/js/ideasUser.js",
        title: "所有用户"
    });
});

//查询
app.get("/users/list", (req, res) => {
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
        return;
    });
});

//添加
app.get('/users/add', (req, res) => {
    // console.log(req.query);
    if (!req.query.username) {
        resJson.code = 500;
        resJson.msg = "请输入姓名";
        res.json(resJson);
        return;
    }
    if (!req.query.userage) {
        resJson.code = 500;
        resJson.msg = "请输入年龄";
        res.json(resJson);
        return;
    }
    if (!req.query.usersex) {
        resJson.code = 500;
        resJson.msg = "请输入性别";
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
            req.flash("success_msg","添加成功");
            resJson.code = 200;
            resJson.msg = "操作成功";
            resJson.item.push({
                name: req.query.username,
                age: req.query.userage,
                sex: req.query.usersex,
                class: req.query.userclass
            });
            res.json(resJson);
            return;
        });
    };
});

app.get("/users/edit/:uId", (req, res) => {
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
app.put("/users/edit/:id", (req, res) => {
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
            req.flash("success_msg","编辑成功");
            res.redirect("/ideas");
        });
    });
});

//删除
app.post("/users/delete", (req, res) => {
    // console.log(req.body);
    if (!req.body.id) {
        resJson.code = 500;
        resJson.msg = "用户ID没有传";
        res.json(resJson);
        return;
    }
    const id = {
        _id: req.body.id,
    }
    Idea.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg","操作成功");
        resJson.code = 200;
        resJson.msg = "操作成功";
        res.json(resJson);
        return;
    });
});

app.get("/users/login", (req, res) => {
    res.send("Login");
});

app.get("/users/login", (req, res) => {
    res.send("register");
});





const port = 8081;
app.listen(port, err => {
    if (err) {
        throw err;
    }
    console.log(`服务器启动成功，地址：http://localhost:${port}`);
});