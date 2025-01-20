const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Course = require("../models/Course");


exports.createSubSection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body;


        // Check if required fields are present
        if (!sectionId || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "All details (title, description, sectionId) are required in sub-section",
            });
        }

        // Check if video is provided
        const videoFile = req.files?.video;
        if (!videoFile) {
            return res.status(400).json({
                success: false,
                message: "Video file is required",
            });
        }

        console.log("first")

        // Validate video MIME type
        const validVideoMimeTypes = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
        if (!validVideoMimeTypes.includes(videoFile.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video format. Accepted formats are MP4, MKV, AVI, MOV",
            });
        }
        console.log("Second")
        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
        console.log("third")
        // Create subsection
        const subsectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update section with new subsection
        const sectionUpdate = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: subsectionDetails._id,
                },
            },
            { new: true }
        ).populate("subSection").exec();

        // Return success response
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: sectionUpdate,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: "Error while creating SubSection",
            error: error.message,
        });
    }
};



exports.updateSubSection=async(req,res)=>{
    try{

        const{subsectionId,sectionId,title,description}=req.body;
        if(!subsectionId||!title||!description){
            res.status(400).json({
                success: false,
                message: "details required in sub section",
            });
        }
        
        
        // await Section.findByIdAndUpdate()
        const subSection = await SubSection.findById(subsectionId)
        if(title!==undefined){
            subSection.title=title
        }
        if(description!==undefined){
            subSection.description=description
        }
        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary( video, process.env.FOLDER_NAME )
            subSection.videoUrl = uploadDetails.secure_url
          }

          await subSection.save();
          const updatedSection = await Section.findById(sectionId).populate("subSection");
        console.log("updated sub section----->",updatedSection)


        res.status(200).json({
			success: true,
            data:updatedSection,
			message: "updated success fully",

		});

        




    }
    catch(error){
        res.status(500).json({
			success: false,
			message: "error in updating SubSection",
            error:error.message,
		});
    }
}

exports.deleteSubSection=async(req,res)=>{
    try{
        

        const {subsectionId,sectionId}=req.body;
        if(!subsectionId||!sectionId){
            res.status(400).json({
                success: false,
                message: "details required in deletion SubSection",
            });
        }
        await Section.findByIdAndUpdate({_id:sectionId},{
            $pull:{
                subSection:subsectionId
            },
        })
        await SubSection.findByIdAndDelete({_id:subsectionId});

        
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            data:updatedSection,
            message: "SubSection deleted successfully",
          })


    }
    catch(error){
        res.status(500).json({
			success: false,
			message: "error in deleting SubSection",
		});
    }
}