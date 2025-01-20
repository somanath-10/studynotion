import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'
import { AiOutlineDown } from "react-icons/ai"
import { IoIosArrowBack } from 'react-icons/io'
import { IoMenu } from "react-icons/io5";
import { ImCross } from "react-icons/im";

function VideoDetailsSidebar({setReviewModal}) {
    const [activeStatus,setActiveStatus] = useState("")
    const [videobarActive,setVideoBarActive] = useState("")
    const navigate = useNavigate()
    const {sectionId,subSectionId} = useParams()
    const location = useLocation();
    let count = 1;
    const{
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state)=>state.viewCourse);

    useEffect(() => {
        if (!courseSectionData.length) return;
      
        const currentSection = courseSectionData.findIndex((data) => data._id === sectionId);
      
        const currentSubSection = courseSectionData?.[currentSection]?.subSection.findIndex((data) => data._id === subSectionId);
      
        const activeSubSectionId = courseSectionData[currentSection]?.subSection?.[currentSubSection]?._id;
      
        setActiveStatus(courseSectionData?.[currentSection]?._id);
        setVideoBarActive(activeSubSectionId);

      
      }, [courseSectionData, courseEntireData, location.pathname]);
      const [menuOpen,setMenuOpen] = useState(false);

  return (

    <>
                <div onClick={() => setMenuOpen(true)} className='absolute mt-[1rem] ml-[1rem] text-[2rem] text-richblack-5'><IoMenu /></div>
                <div className={`md:relative absolute lg:w-[25%] md:w-[40%] md:z-[0] z-[200] overflow-hidden ${menuOpen ? "w-[75%]" : "w-[0]"} transition-all duration-200 flex flex-col py-[1rem] min-h-[100vh] bg-richblack-800 border-r-[2px] border-richblack-700`}>

        <div  className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">

            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25"> 
                
                {/* for buttons */}
                <div className="flex w-full items-center justify-between ">

                    <div onClick={() => {navigate(`/dashboard/enrolled-courses`)}} title="back"  className=" md:flex hidden h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"  >
                        <IoIosArrowBack size={30} />
                    </div>
                    <div className='md:hidden flex' onClick={() => setMenuOpen(false)}><ImCross /></div>

                    <IconBtn text="Add Review" customClasses="ml-auto" onclick={() => setReviewModal(true)} />
                </div>
                <div className="flex flex-col">
                     <p>{courseEntireData?.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500"> {completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>



            <div className = "h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((course,index)=>{
                        return(
                            <div onClick={()=>setActiveStatus(course._id)} key={index} className="mt-2 cursor-pointer text-sm text-richblack-5">

                                <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                    <div className="w-[70%] font-semibold">
                                        {course?.sectionName}
                                    </div>

                                    <div  className="flex items-center gap-3">
                                        <span className={`${activeStatus === course?.sectionName ? "rotate-180" : "rotate-180"} transition-all duration-500`}>
                                            <AiOutlineDown/>

                                        </span>
                                    </div>
                                </div>


                                <div>
                                    {
                                        activeStatus === course?._id && (
                                            <div className="transition-[height] duration-500 ease-in-out">

                                                {
                                                course.subSection.map((topic,index)=>(
                                                    <div className={`flex gap-5 p-5 ${videobarActive===topic._id?"bg-yellow-200 text-richblack-900":"bg-richblack-900 text-white"}`} key={index} 
                                                    
                                                    onClick={()=>{navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic._id}`); setVideoBarActive(topic._id);setMenuOpen(false)}}>
                                                        <input type='checkbox' checked = {completedLectures.includes(topic?._id)}
                                                        onChange={()=>{}}
                                                        />

                                                        <span>
                                                            {topic.title}
                                                        </span>

                                                    </div>
                                                ))

                                                }
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        )
                    })
                }
            </div>

                    </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar