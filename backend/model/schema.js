const mongoose=require("mongoose");
const { type } = require("os");
require("dotenv").config()

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
});

const issueSchema=mongoose.Schema({
    name:{type:String,required:true} ,
 mob: {type:String,required:true},
 type: {type:String,required:true},
 issuedetails: {type:String,required:true},
 "preferredTime": {type:String,required:true},
 "preferredDate": {type:String,required:true},
 "address": {type:String,required:true},
 "area": {type:String,required:true},
 "by": {type:String,required:true},
 "others": {type:String,required:true},
})

module.exports={userSchema,issueSchema}