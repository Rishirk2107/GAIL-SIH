const {userSchema,issueSchema}=require("./schema");
const mongoose=require("mongoose");

const User=mongoose.model("User",userSchema);
const Issue=mongoose.model("Issue",issueSchema);

module.exports={User};