const jwt=require("jsonwebtoken")

require("dotenv").config()


//auth

exports.auth=async(req,res,next)=>{
    try{

        const token= req?.cookies?.token || req?.body?.token || req?.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(500).json({
                success: false,
                message: "token is missing"
            });

        }
        console.log("first")
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decode
        }
        
        catch(error){
            console.log("Error : ", error);
            return res.status(500).json({
                success: false,
                message: "Error jwt verification",
            });

        }

        next();
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Error in auth",
			error: error.message,
		});
    }

}

exports.isStudent=async(req,res,next)=>{
    try{

        
        if(req.user.role!=="Student"){
            return res.status(500).json({
                success: false,
                message: "this is protected rout for students",
                error: error.message,
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Error in isStudent auth",
			error: error.message,
		});
    }
}

exports.isInstructor=async(req,res,next)=>{
    try{        
        if(req.user.role!=="Instructor"){
            return res.status(500).json({
                success: false,
                message: "this is protected rout for Instructor",
                error: error.message,
            });
        }

        next();

    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Error in isInstructor auth",
			error: error.message,
		});
    }
}

exports.isAdmin=async(req,res,next)=>{
    try{    
        if(req.user.role!=="Admin"){
            return res.status(500).json({
                success: false,
                message: "this is protected route for admin",
                error: error.message,
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Error in isAdmin auth",
			error: error.message,
		});
    }
}