const Profile=require("../models/Profile");
const User = require("../models/User");
const{uploadImageToCloudinary}=require("../utils/imageUploader");
const CourseProgress=require("../models/CourseProgress");
const mongoose=require("mongoose");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const Course = require('../models/Course')
const jwt = require("jsonwebtoken")

exports.updateProfile=async(req,res)=>{
    try{

        const userid=req.user.id;

        const{gender,dateOfBirth="",about="",contactNumber,firstName,lastName}=req.body
        
        const userDetails=await User.findById(userid)
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        profileDetails.dateOfBirth=dateOfBirth,
        profileDetails.about=about,
        profileDetails.gender=gender,
        profileDetails.contactNumber=contactNumber;
        userDetails.firstName = firstName,
        userDetails.lastName = lastName,
        await profileDetails.save()
        await userDetails.save();


      return res.status(200).json({
			success: true,
			message: "updatated profile",
          userDetails,
            profileDetails,
		});

    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "error in updating profile",
		});
    }
}


exports.deleteAccount=async(req,res)=>{
    try{
        const userid=req.user.id;

        if(!userid){
            return res.status(400).json({
                success: false,
                message: "user id profile",
            });
        }
        const userDetails=await User.findOne({userid});
        console.log("this is :",userDetails);
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails._id });
        

        // await CourseProgress.deleteMany({ _id:new mongoose.Types.ObjectId(userDetails.courseProgress) ,});
        await User.findByIdAndDelete({_id:userid});


    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "error in deleting acc",
      error:error.message,
		});
    }
}



exports.getAllUserDetails=async(req,res)=>{
    try{

        const userid=req.user.id;

        const userDetails=await User.findById(userid).populate("additionalDetails").exec();

        return res.status(200).json({
			success: true,
			message: "user details got ",
            data:userDetails,
		});



    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "error in get all users profile",
		});
    }
}
require('dotenv').config();
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;
      const image = await uploadImageToCloudinary(displayPicture,  process.env.FOLDER_NAME,  1000,  1000 )
         
      const updatedProfile = await User.findByIdAndUpdate({ _id: userId }, { image: image.secure_url },  { new: true })
       
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  
  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({ _id: userId, })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec() 
      userDetails = userDetails.toObject()




      var SubsectionLength = 0
    for(var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for(var j = 0; j < userDetails.courses[i].courseContent.length; j++){
          totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
          SubsectionLength +=  userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({courseID: userDetails.courses[i]._id,  userId: userId,})
      courseProgressCount = courseProgressCount?.completedVideos.length
      if(SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } 
      else {                                             // To make it up to 2 decimal point 
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =  Math.round( (courseProgressCount / SubsectionLength) * 100 * multiplier ) / multiplier
      }
    }




      
  
      if(!userDetails) {
         return res.status(400).json({success: false,  message: `Could not find user with id: ${userDetails}`,})
      }
  
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  
  exports.instructorDashboard = async (req, res) => {
    try {
      
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course?.studentsEnrolled?.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          totalStudentsEnrolled,                               // Include other course properties as needed
          totalAmountGenerated,
        }
        return courseDataWithStats
      })
  
       res.status(200).json({
          courses: courseData,
        })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }


  exports.getUserDetails=async(req,res)=>{
    try{


        const{userId}=req.user.id;

        const UserDetails=await User.findOne({userId}).populate("additionalDetails")

        return res.status(200).json({
            success:true,
            message:"user details found",
            UserDetails,

        })

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in get user details",

        })
    }
  }

