const {transporter} =require('../config/emailConfig');
const nodemailer=require('nodemailer');
const {Verification_Email_Template, Welcome_Email_Template, Forget_Password}= require('../libs/EmailTemplate');
const userModel = require('../models/user-model');


module.exports.SendVerificationCode=async function(email,verificationCode){
    try{
        const receiver={
            from:"Collegium",
            to:email,
            subject:"Verify your email",
            text:"Verify your email",
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode),
          };

        const response= await transporter.sendMail(receiver,(error,emailResponse)=>{
            if(error)
            throw error;
            console.log("sucess!");
            response.end();
          });
          console.log("email send succefull",response);
    }
    catch(error){
        console.log(error);
    }
}

module.exports.WelcomeEmail=async function(email,name){
    try{
        const receiver={
            from:"tushar2471.be22@chitkara.edu.in",
            to:email,
            subject:"welcome to our website",
            text:"welcome to our website",
            html: Welcome_Email_Template.replace("{name}",name).replace("{link}","http://localhost:3000/users/profile"),
          };

        const response= await transporter.sendMail(receiver,(error,emailResponse)=>{
            if(error)
            throw error;
            console.log("sucess!");
            response.end();
          });
          console.log("email send succefull",response);
    }
    catch(error){
        console.log(error);
    }
}

module.exports.ForgetPassword=async function(email,name){
    try{
        let user=await userModel.findOne({email});
        const receiver={
            from:"tushar2471.be22@chitkara.edu.in",
            to:email,
            subject:"Reset your Password",
            text:"Reset Your Password",
            html: Forget_Password.replace("{name}",name).replace("{link}",`http://localhost:3000/resetPassword/${user._id}`),
          };

        const response= await transporter.sendMail(receiver,(error,emailResponse)=>{
            if(error)
            throw error;
            console.log("sucess!");
            response.end();
          });
          console.log("email send succefull",response);
    }
    catch(error){
        console.log(error);
    }
}



