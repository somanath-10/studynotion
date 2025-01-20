import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Thead, Tbody, Tr, Th, Td  } from 'react-super-responsive-table';
import { formattedDate } from '../../../../utils/dateFormatter';
import Confirmationmodel from '../../../common/Confirmationmodel';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../slices/courseSlice';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {RiDeleteBin6Line} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';

function CourseTable({courses,setcourses}) {
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [loading,setLoading]= useState(false)
    const [confirmationmodal,setconfirmationmodal] = useState(false);
    const navigate = useNavigate();
    const handleCourseDelete=async(courseId)=>{
        setLoading(true)
             await deleteCourse({courseId:courseId},token);
            const result = await fetchInstructorCourses(token);
            if(result){
            setcourses(result);
    }
    setconfirmationmodal(false);
    setLoading(false)
}
  return (
    <div>
            <Table className="rounded-xl border border-richblack-800 ">
            <Thead>
                <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                    <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100"> Courses </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100"> Duration </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">  Price </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">  Actions </Th>
                </Tr>
            </Thead>
            <Tbody>
                    {
                        courses.length===0 ?(
                            <Tr>
                                <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                    No courses found
                                </Td>
                            </Tr>
                            
                        ):(
                            courses.map((course)=>(
                                <Tr key={course._id} className='flex gap-x-10 border-b border-richblack-800 px-6 py-8'>
                                        <Td className='flex flex-1 gap-x-4'>
                                            <img src={course?.thumbnail} className='h-[150px] w-[220px] rounded-lg object-cover'/>

                                            <div className="flex flex-col justify-between">
                                                <p className="text-lg font-semibold text-richblack-5">{course.courseName}</p>
                                                <p  className="text-xs text-richblack-300">{course.courseDescription}</p>
                                                <p className="text-[12px] text-white">created:{formattedDate(course.createdAt)}</p>
                                                <p className=' text-yellow-50'>PUBLISHED</p>
                                            </div>
                                        </Td>

                                        <Td className="text-sm font-medium text-richblack-100"> 2hr 30min </Td>
                <Td className="text-sm font-medium text-richblack-100"> ₹{course.price} </Td>
                                        <Td >
                                            <button disabled={loading} className='mr-[19px]' onClick={()=>navigate(`/dashboard/edit-course/${course._id}`)}>
                                                EDIT
                                            </button>
                                            <button onClick={()=>setconfirmationmodal({
                                                    text1:"Do You want to delete This course",
                                                    text2:"All Data will be erased",
                                                    btn1Text:"Delete",
                                                    btn2Text:"Cancel",
                                                    btn1Handler:!loading?()=>handleCourseDelete(course._id):()=>{},
                                                    btn2Handler:!loading?()=>setconfirmationmodal(null):()=>{},
                                            })}>
                                                <RiDeleteBin6Line size={20} />
                                            </button>
                                        </Td>
                                </Tr>
                            ))
                        )
                    }
                </Tbody>
            </Table>
            {
                confirmationmodal&&<Confirmationmodel modalData={confirmationmodal}/>
            }
    </div>
  )
}

export default CourseTable