const userModel = require("../models/user-model");
const adminModel=require("../models/admin-model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {generateToken}= require("../utils/generateToken.js");
const { SendVerificationCode, WelcomeEmail, ForgetPassword} = require("../middlewares/mail");


module.exports.registerUser= async function(req,res){
    try{
        let{username,email,password}=req.body;

        if(username=='' || email=='' || password==''){
            req.flash("error","all feilds are mandotary");
            return res.redirect("/login");
        }

        let passwordLength= password.length;
        if(passwordLength>15){
            req.flash("error","password tooo long");
            return res.redirect("/login");
        }
        else if(passwordLength<4){
            req.flash("error","password tooo short");
            return res.redirect("/login");
        }
        

        let user = await userModel.findOne({email});
        if(user){
            req.flash("error","you already have an account, please login.");
            return res.status(401).redirect("/login");
        } 

        bcrypt.hash(password, 10, async function(err, hash) {
            // Store hash in your password DB.
            const verificationCode=Math.floor(100000+Math.random()*900000).toString();
            let user= await userModel.create({
                username,
                email,
                password:hash,
                verificationCode
            })
    
            let token = generateToken(user);
            // console.log(token);
            res.cookie("token",token),
            SendVerificationCode(user.email,user.verificationCode);
            res.redirect("/verifyEmail");
            // req.flash("success","your account has been created");
            // res.redirect("/users/profile");
        });
    }
    catch(err){
        res.flash("error","something unexpected happens");
        res.status(504).redirect("/login");
    }
}

module.exports.verifyEmail=async(req,res)=>{
    try{
        const {code}=req.body;
        const user= await userModel.findOne({
            verificationCode:code
        })
        if(!user){
            console.log("user nahi mial");
            return res.status(400).json({sucess:false,message:"Invalid or Expired Code"});
        }
        user.isVerified=true;
        user.verificationCode=undefined;
        await user.save();
        await WelcomeEmail(user.email,user.username);
        req.flash("success","your account has been created");
        res.redirect("/users/profile");
        // return res.status(200).json({sucess:true,message:"Successfully verified"});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({sucess:false,message:"Internal error"});
    }
}

module.exports.forgetPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            console.log("user nahi mial");
            return res.status(400).json({sucess:false,message:"wrong email"});
        }
        if(!user.isVerified){
            return res.status(400).json({sucess:false,message:"wrong email"});
        }
        await ForgetPassword(user.email,user.username);
        req.flash("success","reset link has been sent to your email");
        res.redirect("/");
    }
    catch(error){
        console.log(error);
        return res.status(500).json({sucess:false,message:"Internal error"});
    }
}

module.exports.resetPassword=async(req,res)=>{
    let id=req.params.id;
    let {password,confirm_password}=req.body;
    // console.log(password,confirm_password,id);
    if(password!=confirm_password){
        return res.status(400).json({success:false,message:"password and confirm password do not match"});
    }
    let user=await userModel.findOne({_id:id});
    let isOldPassword=bcrypt.compareSync(password, user.password);
    if(isOldPassword){
        return res.status(400).json({success:false,message:"enter different password than previous one"});
    }
    var hash = bcrypt.hashSync(password, 10);
    user.password=hash;
    await user.save();
    req.flash("success","Password reset");
    res.status(200).redirect("/login");
}

module.exports.loginUsers= async function(req,res){
    try{
        let {email,password}= req.body;
        let user= await userModel.findOne({email});
        if(!user){
            req.flash("error","something went wrong");
            return res.status(401).redirect("/login");
        }

        bcrypt.compare(password, user.password, function(err, result) {
            // result == true
            if(!result){
                req.flash("error","something went wrong");
               return res.status(401).redirect("/login");
            } 
            else{
                let token = generateToken(user);
                res.cookie("token",token);
                req.flash("success","loggedIn successfully");
                res.status(200).redirect("/users/profile");
            }
        });

    }
    catch(err){
        res.status(504).send("something unexpected happens");
    }
}

module.exports.logOut = function(req,res){
    if(req.cookies.token){
        res.cookie("token","");
        req.flash("success","logout successfully");
        res.redirect("/");
    }
    else{
        req.flash("error","already loggout");
        res.redirect("/");
    }
}