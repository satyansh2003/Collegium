const express= require("express");
const router = express.Router();
const isloggedIn = require("../middlewares/isloggedIn");
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");

router.get("/create",isloggedIn,async (req,res)=>{
    let isLogged=true;
    let user = await userModel.findOne({email:req.user.email});
    res.render("createPost",{user,isLogged});
})

router.post("/create",isloggedIn,async (req,res)=>{
    try{
    let {title,content}= req.body;
    let user= await userModel.findOne({email:req.user.email});
    if(title==='' || content===''){
        return res.send("all feilds are mandatory");
    }

    let post = await postModel.create({
        title,
        content,
    })

    post.user= user._id;
    user.posts.push(post._id);
    await user.save();
    await post.save();
    req.flash("success","post created");
    res.redirect("/users/profile")
}
catch(err){
    req.flash("error","something went wrong");
    res.status(501).redirect("/users/profile");
}
})

router.get("/",isloggedIn, async (req,res)=>{
    let isLogged=true;
    let allPost = await postModel.find();
    let allUsers = await userModel.find();


    // console.log(req.user);
    let user = req.user;
    res.render("post",{allPost,allUsers,user,isLogged});
})

router.get("/like/:id",isloggedIn, async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
    let user = await userModel.findOne({email:req.user.email});

    if(post.likes.indexOf(req.user._id)===-1){
        post.likes.push(req.user._id);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user._id),1);
    }
    await post.save();
    res.redirect("/posts");
})

router.get("/deletepost/:id",isloggedIn, async (req,res)=>{
    try{
        let post = await postModel.findOneAndDelete({_id: req.params.id});
    // console.log(typeof req.params.id);
    let user = await userModel.findOne({email:req.user.email});
    user.posts.splice(user.posts.indexOf(post._id),1);
    await user.save();
    req.flash("success","post deleted");
    res.redirect("/users/profile");
    }
    catch(err){
        req.flash("error","something went wrong");
        return res.status(501).redirect("/users/profile");
    }
})

router.post("/edit/:id",isloggedIn,async (req,res)=>{
    let post = await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content},{new:true});
    res.redirect("/users/profile");
})

router.get("/edit/:id",isloggedIn,async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id});
    res.render("editpost",{post});
})

module.exports= router;