const express = require("express");
const app = express();
const path = require("path");
const userRouter = require("./routes/usersRoutes");
const productRouter = require("./routes/productsRoutes");
const adminRouter=require("./routes/adminRoutes");
const postRouter = require("./routes/postRoutes");
const paymentRoute=require("./routes/paymentRoutes")
const indexRouter = require("./routes/index");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose-connection");
const dotenv= require("dotenv").config();
const expressSession = require("express-session");
const flash = require("connect-flash");


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views')); 
app.set("view engine","ejs");
app.use(
    expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  }))
app.use(flash());


app.use("/",indexRouter);
app.use("/users",userRouter);
app.use("/products",productRouter);
app.use("/posts",postRouter);
app.use("/admin",adminRouter);
app.use("/payment",paymentRoute);

app.listen(3000);
