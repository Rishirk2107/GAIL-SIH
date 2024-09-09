const mongoose=require("mongoose");
const {User}=require("../model/collection");

mongoose.connect(process.env.MONGO_URI);

const loginUser =async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if (!user){
            return res.status(400).json({"error":2});
        }
        const isMatch=(user.password==password);
        if (!isMatch){
            return res.status(406).json({"error":1});
        }
        return res.status(200).json({"error":0,"username":user.name,"useremail":email});
    }
    catch(err){
        console.log("Error at logging in:",error);
        return res.status(400).json({"error":3});
    }
}

const registerUser = async (req, res) => {
    try{
    const {fullname,password,email}=req.body;
    console.log(req.body);
    const user=await User.findOne({email});
    if (user){
        return res.status(409).json({"error":1});
    }
    const newUser=new User({
        name:fullname,
        password:password,
        email:email,
    });
        await newUser.save();
        return res.status(200).json({"error":0});
    }
    catch(error){
        console.log("Error at signing up",error);
        return res.status(400).json({"error":2});
    }
};

module.exports={loginUser,registerUser};