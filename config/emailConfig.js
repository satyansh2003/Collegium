const { response } = require('express');
const nodemailer=require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
  service:"gmail",
  secure:true,
  port: 465,
  auth:{
    user:"satyansh1951@gmail.com",
    pass:"efjp cunh vtkv fxnu"
  }
});