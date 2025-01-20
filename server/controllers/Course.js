const Course=require("../models/Course");
const Category=require("../models/Category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Section=require("../models/Section");
const SubSection=require("../models/SubSection");

const CourseProgress = require("../models/CourseProgress")
const {convertSecondsToDuration}  = require("../utils/secToDuration")

//create
exports.createCourse=async(req,res)=>{
    try{
        let {courseName,courseDescription,whatYouWillLearn,tag,instructions,price,category,status=undefined}=req.body;

        //get thumbnail

        const thumbnail=req.files.thumbnailImage;
        console.log("INSTRUCTIONS:",instructions);
        tag = JSON.parse(tag);               
        instructions = JSON.parse(instructions);

        //validation

        if(!courseName||!courseDescription||!price||!whatYouWillLearn||!category){
            return res.status(400).json({
                success:false,
                message:"all details required"
            })
        }
        const userId=req.user.id;

        const instructoeDetails=await User.findById(userId,{accountType:"Instructor"});

        console.log("instrictor Details",instructoeDetails);
        if(!instructoeDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor details not found"
            });
        }

        if(instructoeDetails.accountType!=="Instructor"){
            return res.status(400).json({
                success:false,
                message:"you are not an instructor"
            });
        }
        const categoryDetails=await Category.findById(category);
        console.log(categoryDetails);
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"tag details not found in createCourse"
            });
        };

        //upload image toi clouddinary

        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructoeDetails._id,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            tag,
            instructions,
            status,

        });


        //add the new course to the user

        await User.findByIdAndUpdate(
            {_id:instructoeDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true},
        );
        await Category.findByIdAndUpdate( { _id: category },  {$push: {course: newCourse._id,},}, { new: true } )

        return res.status(200).json({
            success:true,
            message:" createCourse completed",
            data:newCourse
        });


        //tagschema update
    }
    catch(error){
        console.log("Error : ",error);
        return res.status(400).json({
            success:false,
            message:"error in createCourse",
            error:error.message,
        });
    }
}


exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if(!course){
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if(req.files){
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary( thumbnail,  process.env.FOLDER_NAME )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for(const key in updates) {
        if(updates.hasOwnProperty(key)) {
          if(key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()                                     // save the course;
  
      const updatedCourse = await Course.findOne({ _id: courseId,})
                            .populate({
                              path: "instructor",
                              populate: {
                                path: "additionalDetails",
                              },
                            })
                            .populate("category")
                            .populate("ratingAndreviews")
                            .populate({
                              path: "courseContent",
                              populate: {
                                path: "subSection",
                              },
                            })
                            .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

exports.getAllCourses=async(req,res)=>{
    try{

      

      console.log()

        const getallCourses=await Course.find({})
        .populate("instructor").exec();
        

                                return res.status(200).json({
                                                 success:true,
                                                  message:"getted all courses",
                                                  data:getallCourses,
                                  });

        


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in getting all courses"
        });
    }
}



exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({ _id: courseId, })
                          .populate({
                            path: "instructor",
                            populate: {
                              path: "additionalDetails",
                            },
                          })
                          .populate("category")
                          .populate("ratingAndreviews")
                          .populate({
                            path: "courseContent",
                            populate: {
                              path: "subSection",
                            },
                          })
                          .exec()
  
      let courseProgressCount = await CourseProgress.findOne({courseID: courseId,  userId: userId,})
  
      if(!courseDetails){
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        message:"get full details of course",
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [], 
        },
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }

}




// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      
      const instructorId = req.user.id                      // Get the instructor ID from the authenticated user or request body
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })
        
      res.status(200).json({                     // Return the instructor's courses
        success: true,
        data: instructorCourses,
      })
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  
  
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      
      const course = await Course.findById(courseId)                     // Find the course
      if(!course){
        return res.status(404).json({ message: "Course not found" })
      }
  
      const studentsEnrolled = course.studentsEnrolled                   // Unenroll students from the course
      for(const studentId of studentsEnrolled){
        await User.findByIdAndUpdate(studentId, {$pull: { courses: courseId },})
      }
  
      const courseSections = course.courseContent                   // Delete sections and sub-sections
      for(const sectionId of courseSections) {
        const section = await Section.findById(sectionId)             // Delete sub-sections of the section
        if(section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
        await Section.findByIdAndDelete(sectionId)           // Delete the section
      }
  
      await Course.findByIdAndDelete(courseId)                  // Delete the course
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    }
     catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }


  
  exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({ _id: courseId, })
                            .populate({
                              path: "instructor",
                              populate: {
                                path: "additionalDetails",
                              },
                            })
                            .populate("category")
                            .populate("ratingAndreviews")
                            .populate({
                              path: "courseContent",
                              populate: {
                                path: "subSection",
                                select: "-videoUrl",
                              },
                            })
                            .exec()
  
      if(!courseDetails){
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {courseDetails,totalDuration},
      })
    }
     catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  