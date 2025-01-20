import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import CourseTable from './InstructorCourses/CourseTable';

function MyCourses() {
    const {token} = useSelector((state)=>state.auth);
    const [courses,setcourses] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{

        const fetchCourses = async()=>{
            const result = await fetchInstructorCourses(token);
            setcourses(result);
            
        }
        fetchCourses();
        
    },[])
  return (
    <div className=' text-white'>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>

                <IconBtn
                 text="Add Course"
                 onclick={()=>navigate("/dashboard/add-course")}
                />

            </div>

            {
                courses && <CourseTable courses={courses} setcourses={setcourses}/>
            }
    </div>
  )
}

export default MyCourses