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
      subject:"SEVA MITRA-GAIL",
      html:`
      
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
            text-align: center;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: left;
        }
        .banner-image {
            width: 100%;
            max-width: 200px; /* Adjust as needed */
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 0 auto 20px auto;
        }
        .custom-heading {
            color: #2c3e50;
            font-size: 28px;
            margin: 20px 0;
            font-weight: bold;
            line-height: 1.3;
        }
        .event-details {
            color: #555;
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
        }
        .otp-code {
            color: #2e7d32; /* Green color for OTP */
            font-size: 22px;
            font-weight: bold;
            background-color: #e8f5e9;
            padding: 12px;
            border-radius: 5px;
            display: inline-block;
        }
        .note {
            background-color: #fff8e1;
            border-left: 5px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            line-height: 1.5;
        }
        a {
            color: #1e88e5;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .custom-heading {
                font-size: 24px;
            }
            .otp-code {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Banner Image -->
        <img src="https://i.ibb.co/XC4Q5Td/BBQ-Logo.png" alt="AI Logo" class="banner-image">
        
        <h1 class="custom-heading">Welcome to Seva Mitra</h1>
        
        <p class="event-details">
            Your OTP for verification is: <span class="otp-code">${otp}</span>. This OTP is valid for your email: <strong>${email}</strong>.
        </p>
        
        <div class="note">
            <strong>Please Note:</strong><br>
            Seva Mitra is a chatbot for GAIL. This OTP is unique to your account and should not be shared with anyone. Keep it confidential to ensure your account's security.
        </div>
        
        <p class="event-details">
            Thank you for using Seva Mitra! If you have any questions or need assistance, please <a href="mailto:support@yourdomain.com">contact our support team</a>.
        </p>
    </div>
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