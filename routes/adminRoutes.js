const express =require("express");
const router = express.Router();
const adminModel= require('../models/admin-model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {registerAdmin} = require("../controllers/authController");
const {generateToken}= require("../utils/generateToken.js");
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");

router.get("/",(req,res)=>{
    res.send('this is admin page');
})
router.get("/createAdmin",(req,res)=>{
    let success= req.flash("success");
    let error = req.flash("error");
    res.render("createAdmin",{success,error});
})
router.get("/profile",(req,res)=>{
    res.render("adminProfile");
})
router.get("/post",async (req,res)=>{
    let isLogged=true;
    let allPost = await postModel.find();
    let allUsers = await userModel.find();


    
    res.render("adminPost",{allPost,allUsers,isLogged});
})

router.post("/registerAdmin",async (req,res)=>{
    let {username,email,password}=req.body;
    let admin= await adminModel.findOne({email});
    if(admin){
        return res.send("already exist");
    }
    bcrypt.hash(password,10,async function(err,hash){
            admin=await adminModel.create({
            username,
            email,
            password:hash,
        })
        let token = generateToken(admin);
        // console.log(token);
        res.cookie("token",token),
        res.status(200).redirect("/");
    })

    
});

router.post('/login',async (req,res)=>{
    // console.log(req.body);
    let {email,password}=req.body;
    let admin=await adminModel.findOne({email});
    
    if(!admin){
        res.send("admin nahi mila");
    }
    bcrypt.compare(password,admin.password,function(err,result){
        if(!result){
            return res.send("user not exist");
        }
        let token = generateToken(admin);
        res.cookie("token",token);
        return res.send("hello");

    })
})
router.get('/deletepost/:id',async (req,res)=>{
    // console.log(req.params.id);
    let post=await postModel.findOne({_id:req.params.id}).populate("user");
    await postModel.findOneAndDelete({_id:req.params.id});
    // console.log(post.user.posts);
    post.user.posts.splice(post.user.posts.indexOf(post._id,1));
    await post.user.save;
    res.redirect("/admin/post");
    
})

module.exports = router;