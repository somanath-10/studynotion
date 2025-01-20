const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating=async(req,res)=>{
    try{

        const {courseId,review,rating}=req.body;
        const userId=req.user.id;
        

        

        const courseDetails=await Course.find({_id:courseId,
            studentsEnrolled:{$elemMatch:{$eq:userId}},
        })
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"stuent not enrolled yet"
            })
        }

        const alreadyreview=await RatingAndReview.findOne({_id:userId});
        if(alreadyreview){
            return res.status(403).json({
                success:false,
                message:"stuent already reviewed"
            })

        }
        const ratingandreview=await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId       
         })

        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndreviews:ratingandreview
            }
        },{new:true});


        return res.status(200).json({
            success:true,
            message:"rating given successfully"
        })




    }
    catch(error){

    }
}
exports.getAverageRating=async(req,res)=>{
    try{
        const courseId=req.body.courseId;
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            message:"average rating is 0",
            averageRating:0,
        })

        

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in avg rating"
        })
    }
}

exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
                                        .sort({rating:"desc"})
                                        .populate({
                                            path:"user",
                                            select:"firstName lastName email image",

                                        })
                                        .populate({
                                            path:"course",
                                            select:"courseName",
                                        }).exec();
                return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews,
        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in getAllrating"
        })
    }
}