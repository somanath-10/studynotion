import React, { useEffect, useState } from 'react'
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';
function Instructor() {
    const {token} = useSelector((state)=>state.auth);
    const[loading,setLoading] = useState(false);
    const[instructorData,setInstructorData] = useState(null);
    const [courses,setCourses] = useState([]);
    const {user} = useSelector((state)=>state.profile);


useEffect(()=>{
    const getCourseDataWithStats = async()=>{
        const instructorData = await getInstructorData(token);

        const result = await fetchInstructorCourses(token);

        console.log(instructorData);
        console.log("resukt",result)
        if(instructorData.length){
            setInstructorData(instructorData);
        }

        if(result){
            setCourses(result);
        }
    }
    getCourseDataWithStats();
},[])

    const totalAmount = instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
    const totalStudents = instructorData?.reduce((acc,curr)=>acc + curr.totalStudentsEnrolled,0);


  return (
    <div>
        <div className='text-white'>
            <h1>HI {user.firstName}</h1>
            <p>Lets start something new</p>
        </div>

        {
            loading ? (
                <div className="grid place-items-center mt-60 ">
                <div className="spinner"></div>
            </div> 
            ):courses.length>0 ? (

                <div className='w-full'>

                <div className="w-full flex md:flex-row flex-col justify-center my-4 py-[3rem] space-x-2 space-y-2">

                        {totalAmount > 0 || totalStudents > 0 ? (<InstructorChart courses={instructorData}/>) : (
                    
                    <div className="flex-1 rounded-md bg-richblack-800 p-6">
                        <p className="text-lg font-bold text-richblack-5">Visualize</p>
                        <p className="mt-4 text-xl font-medium text-richblack-50"> Not Enough Data To Visualize  </p>
                    </div>
                )}

                {/* Total Statistics */}
                <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">

                    <p className="text-lg font-bold text-richblack-5">Statistics</p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-lg text-richblack-200">Total Courses</p>
                            <p className="text-3xl font-semibold text-richblack-50">{courses?.length}</p>
                        </div>
                        <div>
                            <p className="text-lg text-richblack-200">Total Students</p>
                            <p className="text-3xl font-semibold text-richblack-50">{totalStudents} </p>
                        </div>
                        <div>
                            <p className="text-lg text-richblack-200">Total Income</p>
                            <p className="text-3xl font-semibold text-richblack-50"> Rs. {totalAmount} </p>
                        </div>
                    </div>

                </div>

            </div>

                <div className="rounded-md bg-richblack-800 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                        <Link to='/dashboard/my-courses'>
                            <p className="text-xs font-semibold text-yellow-50">View all</p>
                        </Link>
                    </div>
                    
                    <div className="flex md:flex-row flex-col items-start space-x-6 space-y-4">
                        {
                            courses.slice(0,3).map((course,index)=>{
                                return(
                                    <div key={index} className='md:w-1/3 w-[100%]'>
                                        <img src={course.thumbnail} className="md:h-[40px] w-full rounded-md object-cover"/>
                                        <div className='mt-3 w-full'>
                                            <p className="text-sm font-medium text-richblack-50">{course.courseName}</p>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <p className="text-xs font-medium text-richblack-300">{course.studentsEnrolled.length} Students</p>
                                                <p className="text-xs font-medium text-richblack-300"> | </p>
                                                <p className="text-xs font-medium text-richblack-300">{course.price}</p>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div> 
   
                              
                </div>

            ):(
                <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
                <p className="text-center text-2xl font-bold text-richblack-5"> You have not created any courses yet</p> 
                <Link to="/dashboard/add-course">
                  <p className="mt-1 text-center text-lg font-semibold text-yellow-50"> Create a course </p> 
                </Link>
              </div>
            )
        }
    </div>
  )
}

export default Instructor