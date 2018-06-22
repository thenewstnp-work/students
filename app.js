const express = require('express');

const bodyParser = require('body-parser');

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');

const session = require('express-session');

const flash = require('connect-flash');

const methodOverride = require('method-override');

const app = express();

// ideas路由
const ideas = require("./routes/ideas");

// users路由
const users = require("./routes/users");


// 连接数据库
mongoose.connect("mongodb://localhost/studentDB").then(() => {
    console.log("数据库连接成功");
}).catch(err => {
    console.log(err);
})


//静态文件托管
app.use('/public', express.static(__dirname + '/public'));

// methodOverride中间件
app.use(methodOverride('_method'));

//配置模板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// session中间件
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// flash中间件
app.use(flash());

//配置全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
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

//ideas 路由
app.use("/ideas",ideas);
//users 路由
app.use("/users", users);


const port = 8085;
app.listen(port, err => {
    if (err) {
        throw err;
    }
    console.log(`服务器启动成功，地址：http://localhost:${port}`);
});