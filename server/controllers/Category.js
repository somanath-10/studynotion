const Category=require('../models/Category')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;

        if(!name){
            return res.status(400).json({
                success: false,
                message: "details of name and description needed",
                error: error.message,
            });
        }
        const CategoryDetails=await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            message: "tag created successfully",
            data:CategoryDetails
        });





    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in createTag",
            error: error.message,
        });
    }
}


exports.showAllCategories=async(req,res)=>{
    try{
        const getalltags=await Category.find({},{name:true,description:true});
        if(!getalltags){
        return res.status(400).json({
            success: false,
            message: "no tags are created",
            error: error.message,
        });
    }
    
        return res.status(200).json({
            success: true,
            message: "all tags are created",
            data:getalltags,
         
        });
    

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in getting all tags",
            error: error.message,
        });
    }
    

}


//categoryPageDetails 
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
     
        // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)             
              .populate({
                path: "course",
                populate: {
                  path: "instructor",
              }
              
                // populate: "ratingAndreviews",
              })
              .exec()
  
      // Handle the case when the category is not found
      if(!selectedCategory) {
               return res.status(404).json({ success: false, message: "Category not found" })
      }

       // Handle the case when there are no courses
      if(selectedCategory.course.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId }, })
        
      let differentCategory = await Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
                .populate({
                  path: "course",
                  populate: {
                    path: "instructor",
                },
                })
                .exec()
        
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "course",
          populate: {
            path: "instructor",
        },})
        .exec()
        console.log("caregory data",allCategories)

      const allCourses = allCategories.flatMap((category) => category.course)
      const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)
          console.log("categiru",mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {selectedCategory, differentCategory, mostSellingCourses,}, 
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }