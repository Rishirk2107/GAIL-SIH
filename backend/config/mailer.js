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

const gmailer=async(email,otp,username)=>{
    transporter.sendMail({
      to:email,
      subject:"Seva Mitra Verification",
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
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
            text-align: center;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            text-align: center; /* Center content */
        }
        .banner-image {
            width: 120px;
            height: 120px;
            border-radius: 50%; /* Circular logo */
            display: block;
            margin: 0 auto 20px auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow for emphasis */
        }
        .custom-heading {
            color: #2c3e50;
            font-size: 26px;
            font-weight: bold;
            margin: 20px 0;
            line-height: 1.4;
        }
        .event-details {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
            padding: 0 20px;
            text-align: left;
        }
        .otp-code {
            color: #2e7d32; /* Green color for OTP */
            font-size: 24px;
            font-weight: bold;
            background-color: #e8f5e9;
            padding: 15px 30px;
            border-radius: 8px;
            display: inline-block;
            margin: 20px auto;
        }
        .note {
            background-color: #fff8e1;
            border-left: 5px solid #ff9800;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
            text-align: left;
        }
        .footer {
            margin-top: 30px;
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
                padding: 20px;
                margin: 20px auto;
            }
            .custom-heading {
                font-size: 22px;
            }
            .otp-code {
                font-size: 20px;
                padding: 10px 25px;
            }
            .event-details, .note {
                padding: 0 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Circular Banner Image -->
        <img src="https://i.ibb.co/XC4Q5Td/BBQ-Logo.png" alt="AI Logo" class="banner-image">
        
        <h1 class="custom-heading">SEVA MITRA - GAIL</h1>
        
        <p class="event-details">
            Dear <strong>${username}</strong>,
            <br><br>
            To protect your account, please use the following One-Time Password (OTP) to complete your sign-in to Seva Mitra.
        </p>

        <p class="otp-code">${otp}</p>

        <p class="event-details">
            This OTP is valid for the next <strong>5 minutes</strong>. If you didn’t request this, please contact our support team.
        </p>

        <div class="note">
            <strong>Important Security Notice:</strong><br>
            Please do not share this code with anyone. Our support team will never ask for your password or OTP.
        </div>

        <p class="event-details">
            Thank you for using Seva Mitra! If you have any questions, please <a href="mailto:support@yourdomain.com">contact support</a>.
        </p>

        <div class="footer">
            Best regards,<br>
            The Seva Mitra Team
        </div>
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