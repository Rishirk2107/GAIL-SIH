const express=require("express");
const bodyParser=require("body-parser");
const authRoutes=require("./routes/authRoutes");
const issueRoute=require("./routes/issueRoute")
const cors=require("cors");
const PORT=3001;

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/auth",authRoutes);
app.use("/issue",issueRoute);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});