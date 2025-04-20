const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isloggedIn = require("../middlewares/isloggedIn");
const userModel = require("../models/user-model");
const {createProduct,addtoCart,addtoWishlist,showShop} = require("../controllers/productController");

router.get("/create",isloggedIn,async(req,res)=>{
    let isLogged=true;
    let error = req.flash("error");
    let user=await userModel.findOne({email:req.user.email});
    res.render("createProduct",{error,isLogged,user});
})

router.post("/create",isloggedIn,upload.single("image"),createProduct);

router.get("/",isloggedIn,showShop);

router.post("/cart/:id",isloggedIn, addtoCart);

router.get("/wishlist/:id",isloggedIn, addtoWishlist);

router.get("/details/:id",isloggedIn, async (req,res)=>{
    let isLogged=true;
    let product = await productModel.findOne({_id:req.params.id}).populate("owner");
    let user=await userModel.findOne({email:req.user.email});
    res.render("productDetails",{product,isLogged,user});
})

module.exports = router;