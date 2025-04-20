const express =require("express");
const isloggedIn = require("../middlewares/isloggedIn");
const { verifyEmail, forgetPassword, resetPassword } = require("../controllers/authController");
const userModel = require("../models/user-model");
const router = express.Router();


router.get("/",(req,res)=>{
    let success= req.flash("success");
    let error = req.flash("error");
    let isLogged=false;
    if(!req.cookies.token){
        return res.render("index",{success,error,isLogged});
    }
    isLogged=true;
    const findEle=(id)=>{
        let ob= document.querySelector('#id');
        console.log(ob);
    }
    res.render("index",{success,error,findEle,isLogged});
})

router.get("/learnMore",(req,res)=>{
    let isLogged=false;
    res.render("learnMore",{isLogged});
})

router.get("/confirmUser",(req,res)=>{
    let isLogged=false;
    let success= req.flash("success");
    let error = req.flash("error");
    res.render("confirmUser",{success,error,isLogged});
})

router.get("/login",(req,res)=>{
    let isLogged=false;
    let success= req.flash("success");
    let error = req.flash("error");
    res.render("login",{success,error,isLogged});
})

router.get("/verifyEmail",(req,res)=>{
    res.render("verifyEmail");
})

router.post("/verifyEmail",verifyEmail);

router.get("/loginAdmin",(req,res)=>{
    let isLogged=false;
    let success= req.flash("success");
    let error = req.flash("error");
    res.render("loginAdmin",{success,error,isLogged});
})

router.get("/forgetPassword",(req,res)=>{
    res.render("forgetPassword");
})
router.post("/forgetPassword",forgetPassword);

router.get("/resetPassword/:id",async (req,res)=>{
    const id=req.params.id;
    // console.log(id);
    const user=await userModel.findOne({_id:id})
    // console.log(user);
    res.render("resetPassword",{user});
})
router.post("/resetPassword/:id",resetPassword);

module.exports= router;