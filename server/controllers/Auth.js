const User=require("../models/User");
const OTP=require('../models/OTP');
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mailSender=require("../utils/mailSender");
const Profile=require("../models/Profile");
const {passwordUpdated}=require("../mail/templates/passwordUpdate");

exports.sendOTP=async(req,res)=>{
    try{
        const {email}=req.body;
        const userexist = await User.findOne({email});
    if(userexist){
        return res.status(401).json({
            success:false,
            message:"user already exists"
        })
    }

    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    })
    console.log("otp generated success fully",otp)
    let result=await OTP.findOne({otp:otp});
    while(result){
         otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        

    }


    const otpPayload={email,otp};

    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);

    return res.status(200).json({
        success:true,
        message:" otp sent successfully"
    })

    }
    catch(err){
        return res.status(403).json({
            success:false,
            message:"error in sendotp"
        })
    }

}
//signup

exports.signUp=async(req,res)=>{
    try{
        const {firstName,lastName,accountType,email,password,confirmpassword,contactNumber,otp}=req.body;
    if(!firstName||!lastName||!accountType||!email||!password||!confirmpassword||!confirmpassword||!otp){
        return res.status(401).json({
            success:false,
            message:"all details required"
        })
    }
    const checkmail=await User.findOne({email});
    if(checkmail){
        return res.status(400).json({
            success:false,
            message:"user already exists"
        })

    }
    if(password!=confirmpassword){
        return res.status(401).json({
            success:false,
            message:"password is not equals to confirm password"
        })
    }
    const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOTP);
    let a=recentOTP[0].otp;
    console.log("recent otp",a);

    //validate
    if((a).length==0){
        return res.status(401).json({
            success:false,
            message:"error in recent otp length"
        })
    }
    if(otp!=a){
        return res.status(401).json({
            success:false,
            message:"error in otp not equals to recent otp"
        })
    }
    

    const hashedPassword=await bcrypt.hash(password,10);
    let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

    const ProfileDetails=await Profile.create({
        gender:null,
        dataOfBirth:null,
        about:null,
        contactNumber:contactNumber
    })
    
    console.log(ProfileDetails)
    const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        contactNumber,
        accountType:accountType,
        approved:approved,
        additionalDetails:ProfileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

    })
    console.log(user)
    return res.status(200).json({
        success:true,
        message:"sign up success fully"
    })
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"error in sign up"
        })
        
    }

}
require("dotenv").config()
//login

exports.login=async(req,res)=>{
    try{

        const {email,password}=req.body
        if(!email||!password){
            return res.send(401).json({
                success:false,
                message:"details in login requiired"
            })
        }
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"error in  login in"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                role:user.accountType

            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"20h"
            });
            user.token=token,
            user.password=undefined;
        
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"cookie created successfully"
        })
    }else{
        return res.status(401).json({
            success:false,
            message:"error in bcrypt comapre"
        })
    }
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"error in login"
        })

    }
}

//change pass


exports.changePassword = async (req, res) => {
	try {
		const userDetails = await User.findById(req.user.id);                         // Get user data from req.user
		const { oldPassword, newPassword, confirmNewPassword } = req.body;            // Get old password, new password, and confirm new password from req.body

		const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password );                 // Validate old password
			 
		if(!isPasswordMatch) {                                  // If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ success: false, message: "The password is incorrect" });	 
		}

		if(newPassword !== confirmNewPassword) {                             // Match new password and confirm new password
            return res.status(401).json({ success: false, message: "The password and confirm password does not match" });	 
		}
			 
		const encryptedPassword = await bcrypt.hash(newPassword, 10);             // Update password
		const updatedUserDetails = await User.findByIdAndUpdate(req.user.id , { password: encryptedPassword } , { new: true });
                    
		 
		try {                                                          // Send notification email , here passwordUpdated is template of email which is send to user;
			const emailResponse = await mailSender(updatedUserDetails.email,passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
			console.log("Email sent successfully:", emailResponse.response);
		   } 
        catch(error) {
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		return res.status(200).json({ success: true, message: "Password updated successfully" });         // Return success response 	 
	 } 
    catch(error) {
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
