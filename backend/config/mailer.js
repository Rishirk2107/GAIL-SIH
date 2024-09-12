const nodemailer=require("nodemailer");
const crypto=require("crypto");

function generate2FACode() {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit code
}

const transporter=nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:465,
  secure:true,
  auth:{
    user:process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASS
  }
})

const gmailer=async(email,otp)=>{
    transporter.sendMail({
      to:email,
      subject:"test",
      html:`
      
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .banner-image {
            width: 100%;
            max-width: 600px;
            height: auto;
        }
        .custom-heading {
            color: #333;
            font-size: 24px;
            margin: 20px 0;
        }
        .event-details {
            color: #555;
            font-size: 16px;
            margin: 10px 0;
        }
        .left-aligned {
            text-align: left;
            margin: 20px auto;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <!-- Banner Image -->
    <img src="your-banner-url.jpg" alt="Welcome to Seva Mitra" class="banner-image">
    
    <h1 class="custom-heading">Welcome to Seva Mitra</h1>
    
    <p class="event-details">
        Your OTP for verification is: <strong>${otp}</strong>. This OTP is valid for your email: <strong>${email}</strong>.
    </p>
    
    <p class="event-details">
        <strong>Please Note:</strong><br>
        Seva Mitra is a chatbot for GAIL. This OTP is unique to your account and should not be shared with anyone. Keep it confidential to ensure your account's security.
    </p>
    
    <p class="event-details" style="text-align: center;">
        Thank you for using Seva Mitra! If you have any questions or need assistance, please contact our support team.
    </p>
</body>
</html>
      `,
    })
    .then(()=>{
      console.log("Email sent successfully");
    })
    .catch((err)=>{
      console.log(err);
    })
}

module.exports={gmailer,generate2FACode};