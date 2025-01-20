const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const { error } = require("console");


exports.capturePayment = async(req,res)=>{

    const {courses}  = req.body;
    const {userId} = req.user.id;

    if(courses.length ===0){
        return res.status(400).json({
            success:false,
            message:"no course found"
        })
    }
    console.log("first")
    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course) return res.status(400).json({success:false,message:"Coule not find the course"});
        
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"Student already enrolled this course",
                    
                })
            }
            totalAmount =totalAmount+course.price;
            console.log(totalAmount)
        }   
        catch(error){
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }


    }
    console.log("Second")
    
    const options = {
        amount:totalAmount*10,
        currency:"INR",
        receipt:Math.random(Date.now()).toString(),
    }
    console.log("third")
    try{

        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        res.json({
            success:true,
            message:paymentResponse,

        })

    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Could Not initiate Order"
        })
    }
    
}

exports.verifyPayment = async(req,res)=>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const courses = req.body?.courses;
    const userId = req.user.id;
    
    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!courses||!userId){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"data required"
        })
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature===razorpay_signature){
            //enroll
            if(!courses || !userId) {
                return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
            }
        
            for(const courseId of courses) {
                try{                                            //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}}, {new:true},)            
                
                if(!enrolledCourse){
                    return res.status(500).json({success:false,message:"Course not Found"});
                }
                // created courseProgress for enrolled Courses in DB;
                const courseProgress = await CourseProgress.create({
                    courseID:courseId,
                    userId:userId,
                    completedVideos: [],
                })
        
        
                //find the student and add the course to their list of enrolledCOurses
                const enrolledStudent = await User.findByIdAndUpdate(userId,  {$push:{ courses: courseId,  courseProgress: courseProgress._id, }},{new:true})
                    
                ///Send mail to the Student;
                await mailSender( enrolledStudent.email, `Successfully Enrolled into ${enrolledCourse.courseName}`,  courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)) 
            }   
                catch(error) {
                    console.log(error);
                    return res.status(500).json({success:false, message:error.message});
                }
            }

            //resnse
            return res.status(200).json({
                success:true,
                message:"Payment Verified"
            })
        }
        return res.status(400).json({
            success:false,
            message:"payment falied"
        })

}

// exports.enrollStudents = async(courses, userId, res) => {

//     if(!courses || !userId) {
//         return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
//     }

//     for(const courseId of courses) {
//         try{                                            //find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}}, {new:true},)            
        
//         if(!enrolledCourse){
//             return res.status(500).json({success:false,message:"Course not Found"});
//         }
//         // created courseProgress for enrolled Courses in DB;
//         const courseProgress = await CourseProgress.create({
//             courseID:courseId,
//             userId:userId,
//             completedVideos: [],
//         })


//         //find the student and add the course to their list of enrolledCOurses
//         const enrolledStudent = await User.findByIdAndUpdate(userId,  {$push:{ courses: courseId,  courseProgress: courseProgress._id, }},{new:true})
            
//         ///Send mail to the Student;
//         const emailResponse = await mailSender( enrolledStudent.email, `Successfully Enrolled into ${enrolledCourse.courseName}`,  courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)) 
//     }   
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({success:false, message:error.message});
//         }
//     }
// }


// exports.verifyPayment = async(req, res) => {
//     const razorpay_order_id = req.body?.razorpay_order_id;
//     const razorpay_payment_id = req.body?.razorpay_payment_id;
//     const razorpay_signature = req.body?.razorpay_signature;
//     const courses = req.body?.courses;
//     const userId = req.user.id;

//     if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
//            return res.status(200).json({success:false, message:"Payment Failed"});   
//     }

//     let body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_SECRET)
//         .update(body.toString())
//         .digest("hex");

//         if(expectedSignature === razorpay_signature) {
//             await enrollStudents(courses, userId, res);                   //enroll karwao student ko
//             return res.status(200).json({success:true, message:"Payment Verified"});    //return res
//         }
//         return res.status(200).json({success:"false", message:"Payment Failed"});
// }
// //capture payment initiate razorpay order

// exports.capturePayment=async(req,res)=>{
//     try{

//         const{courseId}=req.body;
//         const userId=req.user.id;
//         if(!courseId){
//             return res.status(200).json({
//                 syccess:false,
//                 message:" not a valid course id"
//             })
            
//         }
//         let course;
//         try{
//             course = await Course.findById(courseId);
//             if(!course){
//                 return res.status(200).json({
//                     syccess:false,
//                     message:"no course is present"
//                 })
//             }

//             const uid=new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(400).json({
//                     syccess:false,
//                     message:"student is already enrolled"
//                 })
//             }


//         }
//         catch(error){
//             return res.status(400).json({
//                 syccess:false,
//                 message:"error in ccourse detai;s"
//             })
//         }

//         const amount = course.price;
//         const currency = "INR";


//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now().toString()),
//             notes:{
//                 courseId:courseId,
//                 userId,

//             }
//         };
//         try{
//             const paymentRespone = await instance.orders.create(options);
//             console.log(paymentRespone);
//             return res.status(200).json({
//                 syccess:true,
//                 message:"success",
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentRespone.id,
//                 currency:paymentRespone.currency,
//                 amount:paymentRespone.amount
//             })

//         }
//         catch(error){
//             return res.status(400).json({
//                 syccess:false,
//                 message:"error in instace ccreation"
//             })
//         }

//     }
//     catch(error){
//         return res.status(400).json({
//             syccess:false,
//             message:"error in create payments"
//         })
//     }
// }


// exports.enrollStudents = async(courses, userId, res) => {

//     if(!courses || !userId) {
//         return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
//     }

//     for(const courseId of courses) {
//         try{                                            //find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}}, {new:true},)            
        
//         if(!enrolledCourse){
//             return res.status(500).json({success:false,message:"Course not Found"});
//         }
//         // created courseProgress for enrolled Courses in DB;
//         const courseProgress = await CourseProgress.create({
//             courseID:courseId,
//             userId:userId,
//             completedVideos: [],
//         })

//         //find the student and add the course to their list of enrolledCOurses
//         const enrolledStudent = await User.findByIdAndUpdate(userId,  {$push:{ courses: courseId,  courseProgress: courseProgress._id, }},{new:true})
            
//         ///Send mail to the Student;
//         const emailResponse = await mailSender( enrollStudents.email, `Successfully Enrolled into ${enrolledCourse.courseName}`,  courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)) 
//     }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({success:false, message:error.message});
//         }
//     }
// }



// exports.verifySignature=async(req,res)=>{
//         const webhookSecret="12345678"

//         const signature=req.headers["x-razorpay-signature"];

//         const shasum=crypto.createHmac("sha256",webhookSecret);
//         shasum.update(JSON.stringify(req.body));

//         const digest=shasum.digest("hex");

//         if(signature===digest){
//             console.log("payment authorized");
//             const {courseId,userId}=req.body.payload.payment.entity.notes;

//             try{
//                 const enrolledCourse=await Course.findOneAndUpdate({
//                     _id:courseId
//                 },{
//                     $push:{
//                         studentsEnrolled:userId
//                     }
//                 },{new:true});

//                 if(!enrolledCourse){
//                     return res.status(500).json({
//                         syccess:false,
//                         message:"course not found"
//                     })
//                 }
//                 console.log(enrolledCourse);

//                 const enrolledStudent=await User.findOneAndUpdate({userId},{
//                     $push:{
//                         courses:courseId
//                     }
//                 },{new:true});
//                 console.log(enrolledStudent);
                

//                 //mail send

//                 const emailresponse=await mailSender(
//                     enrolledStudent.email,"congralutions,to enrooled a couser in studynotion","okokookookokokokookokk"
//                 );

//                 console.log(emailresponse);

//                 return res.status(200).json({
//                     syccess:true,
//                     message:" successfully verified and course added"
//                 })
//             }
//             catch(error){
//                 return res.status(400).json({
//                     syccess:false,
//                     message:"error in verify signature"
//                 })
                
//             }
//         }
//         else{
//             return res.status(400).json({
//                 syccess:false,
//                 message:"invalid request"
//             })

//         }

    
// }

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}