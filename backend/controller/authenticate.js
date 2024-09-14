const {User}=require("../model/collection");
const {gmailer,generate2FACode} = require("../config/mailer")

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

        //otp generation
        const otp=generate2FACode();
        //console.log(otp);
        req.session.otp=otp;
        req.session.user=user.name;
        req.session.email=user.email;
        req.session.save(err => {
            if (err) {
                console.log('Session save error:', err);
            }
        });
        //console.log(req.session)
        gmailer(user.email,otp,user.name);

        return res.status(200).json({"error":0,"username":user.name,"useremail":email});
    }
    catch(err){
        console.log("Error at logging in:",error);
        return res.status(400).json({"error":3});
    }
}

const registerUser = async (req, res) => {
    try{
        console.log(req.body);   
    const {fullname,password,email}=req.body;
    console.log(req.body);
    const user=await User.findOne({email});
    if (user){
        console.log("Email Already exists")
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

const verify2fa = async (req,res) => {
    try{
        const {otp} = req.body;
        //console.log(req.session)
        if (otp==req.session.otp){
            return res.status(200).json({"error":0})
        }
        return res.status(401).json({"error":1});
    }
    catch(error){
        console.log("Error at OTP Verification",error);
        return res.status(500).json({"error":2});
    }
}


module.exports={loginUser,registerUser,verify2fa};