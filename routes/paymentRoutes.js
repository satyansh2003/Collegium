const express=require("express");
const router=express();

// const bodyParser=require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:false}));

const paymentController=require('../controllers/paymentController');
const isloggedIn = require("../middlewares/isloggedIn");
// router.get('/',isloggedIn,paymentController.renderProductPage);
router.get('/createOrder',paymentController.createOrder);

module.exports=router;