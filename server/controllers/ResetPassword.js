const User=require("../models/User");
const mailsender=require("../utils/mailSender")
const bcrypt=require("bcrypt")

exports.resetPasswordToken=async(req,res)=>{
    try{
        const {email}=req.body;
        const checkmail=await User.find({email})
        if(!checkmail){
            return res.status(500).json({
                success: false,
                message: "email doesn't exist",
                
            });
        }
        token= crypto.randomUUID();
        const updateDetails=await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },{new:true});

        const url=`https://localhost:3000/update-password/${token}`;

        await mailsender(email,"click this link to change the password",`password reset link: ${url}`)

        return res.status(200).json({
            success: true,
            message: "success fully chnaged the pass",
            
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "error on resetpasswrod link",
            error: error.message,
        });
    }
}



exports.resetPassword=async(req,res)=>{
    try{
        const {password,confirmpassword,token}=req.body;
        if(!password||!confirmpassword||password!==confirmpassword){
            return res.status(500).json({
                success: false,
                message: "choose the same pass and conform passs",
                error: error.message,
            });
        }
        const userDetails=await User.findOne({token:token})
        if(!userDetails){
            return res.status(500).json({
                success: false,
                message: "token invalid in resetpass",
                error: error.message,
            });
        }
        if(userDetails.resetPasswordExpires>Date.now()){
            return res.status(500).json({
                success: false,
                message: "again send mail because token expired",
                error: error.message,
            });
        }
        const hashedpass=await bcrypt.hash(password,10);

        await User.findOneAndUpdate({token:token},{
            password:hashedpass
        },{new:true});


        return res.status(200).json({
            success: true,
            message: "pass reset success",
            
        });
        

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in reset password",
            error: error.message,
        });
    }
}