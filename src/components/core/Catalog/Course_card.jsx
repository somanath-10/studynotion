import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GetAvgRating from '../../../utils/avgRating'
import RatingStars from '../../common/RatingStars'

function Course_card({course,Height}) {
    const [avgReviewCount,setAvgReviewCount] = useState(0);
    useEffect(()=>{
        const count = GetAvgRating(course.ratingAndreviews)
    //    console.log("COUnt",count)
    },[])
  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div className=' rounded-lg'> 
                    <img src={`${course?.thumbnail}`} alt='coure ka thumb nail' className={`${Height} w-full rounded-xl object-cover`}/>
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">
                        {course?.courseName}
                    </p>
                    <p className="text-sm text-richblack-50">
                        {course?.instructor?.firstName}
                        <span>{" "}</span>
                        {course?.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{course?.ratingAndreviews?.length % 5||0}</span>
                        <RatingStars Review_Count={course?.ratingAndreviews?.length % 5}/>
                        <span className="text-richblack-400">{course?.ratingAndreviews?.length}</span>
                    </div>
                    <p className="text-xl text-richblack-5">
                        RS. {course?.price}
                    </p>
                </div>
            </div>
        
        </Link>
    </div>
  )
}

export default Course_card