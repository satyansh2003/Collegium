const productModel= require("../models/product-model");
const upload = require("../config/multer-config");
const userModel = require("../models/user-model");

module.exports.createProduct= async function(req,res){
    try{
        let user = await userModel.findOne({email:req.user.email});
        let {productname,price,discount,description}=req.body;
        let product = await productModel.create({
            image:req.file.buffer,
            productname,
            price,
            discount,
            description,
            owner:user._id,
        })
    
        user.products.push(product._id);
        await user.save();
        req.flash("success","product is created successfully");

        
    
        res.redirect("/products");
    }
    catch(err){
        req.flash("error","something went wrong");
        res.redirect("/products/create");
    }
}

module.exports.addtoCart = async function(req,res){
    try{
        let user= await userModel.findOne({email:req.user.email});
        let product = await productModel.findOne({_id:req.params.id});
    
        if(user.products.indexOf(product._id)==-1){
            if(user.cart.indexOf(product._id)==-1){
                if(user.wishlist.indexOf(product._id!=-1)){
                    user.wishlist.splice(user.wishlist.indexOf(product._id),1);
                }
                user.cart.push(product._id);
                await user.save();
                req.flash("success","added to cart");
                return res.redirect("/products");
            }
            else{
                req.flash("error","already added");
                return res.redirect("/products");
                
            }
           
        }
        else{
            req.flash("error","this is your product");
            return res.redirect("/products");
        }
    }
    catch(err){
        res.status(501).send("something went wrong");
    }
}

module.exports.addtoWishlist = async function(req,res){
    try{
        let user= await userModel.findOne({email:req.user.email});
        let product = await productModel.findOne({_id:req.params.id});
    
        if(user.products.indexOf(product._id)==-1){
    
            if(user.wishlist.indexOf(product._id)==-1){
                user.wishlist.push(product._id);
                req.flash("success","added to wishlist");
            }
            else{
                user.wishlist.splice(user.wishlist.indexOf(product._id),1);
                req.flash("error","removed from wishlist");
            }
    
            await user.save();
            res.redirect("/products");
        }
        else{
            req.flash("error","this is your product");
            return res.redirect("/products");
        }
    }
    catch(err){
        req.flash("error","something went wrong");
        res.redirect("/products");
    }
}

module.exports.showShop = async function(req,res){
    try{
        let isLogged=true;
        let success = req.flash("success");
        let error = req.flash("error");
        let products= await productModel.find();
        let user = await userModel.findOne({email:req.user.email});
        res.render("shop",{products,user,success,error,isLogged});
    }
    catch(err){
        req.flash("error","something went wrong");
        res.redirect("/products");
    }
}