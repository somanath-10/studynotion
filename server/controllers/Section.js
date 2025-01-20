const Section=require('../models/Section');
const Course=require("../models/Course");
const SubSection=require("../models/SubSection");

exports.createSection=async(req,res)=>{
    try{
        const {sectionName,courseId}=req.body;

        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:'required section nam'
            });
        }
        

        const newSection=await Section.create({sectionName});

        const updateCourse=await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id,
            }
        },{new:true}).populate({path: "courseContent",populate: {path: "subSection",},}).exec(); 
        
        console.log("updated course----->",updateCourse);




        return res.status(200).json({
            success:true,
            message:'created a section successfully',
            updateCourse,
        });



    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:'error in creating a section'
        });
    };
}



exports.updateSection=async(req,res)=>{
    try{

        const{sectionName,sectionId,courseId}=req.body;

        if(!sectionId||!sectionName){
            return res.status(400).json({
                success:false,
                message:"details required"
            });
        }
        const updateSectionName=await Section.findByIdAndUpdate(sectionId,{
            sectionName:sectionName
        },{new:true});
       const updatedCOurse =  await Course.findById(courseId).populate({path:"courseContent" , populate:{path:"subSection"} , }).exec();
    


        return res.status(200).json({
            success:true,
            message:"updated section",
            data:updatedCOurse
        });

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in update section"
        });
    }
}

exports.deleteSection=async(req,res)=>{
    try{

        const {sectionId,courseId}=req.body;

        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:" section is not created"
            });
        }

        try{
            await Course.findByIdAndUpdate(courseId,{
                $pull:{
                    courseContent:sectionId
                }
            })
            const section=await Section.findById(sectionId);
            await SubSection.deleteMany({_id:{$in:section.subSection}})
            await Section.findByIdAndDelete(sectionId);

        }
        
        catch(error){
            return res.status(400).json({
                success:false,
                message:"error update course"
            });
            
        }
        //find the updated course and return 
		const course = await Course.findById(courseId).populate({                               //here there is no use of const course , its only store updated course;
			path:"courseContent",                                                               // if you also write without  "const course = " then it also work;
			populate: {
				path: "subSection"
			}
		})
		.exec();

        return res.status(200).json({
            success:true,
            message:"section deleted",
            data:course,
            
        })
        
        


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in delete section"
        });
    }
}