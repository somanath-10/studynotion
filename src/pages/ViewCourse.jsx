import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
function ViewCourse() {

    const [reveiwModal,setReviewModal] = useState(false)
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        ;(async () => {
          const courseData = await getFullDetailsOfCourse(courseId, token)
          dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
          dispatch(setEntireCourseData(courseData.courseDetails))
          dispatch(setCompletedLectures(courseData.completedVideos))
          let lectures = 0
          courseData?.courseDetails?.courseContent?.forEach((sec) => { lectures += sec.subSection.length })
          dispatch(setTotalNoOfLectures(lectures))
        })()
      }, [])


  return (
    <div>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal}/>

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mt-20">
              <div className='mx-6'>
              <Outlet/>

              </div>
            </div>
        </div>

        {
            reveiwModal && <CourseReviewModal setReviewModal={setReviewModal}/>
        }
    </div>
  )
}

export default ViewCourse