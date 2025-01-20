import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { FaPlayCircle } from "react-icons/fa";
import IconBtn from '../../common/IconBtn';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';


function VideoDetails() {


  const {courseId,sectionId,subSectionId} = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerRef = useRef()
  const {token} = useSelector((state)=>state.auth)
  const {courseSectionData,courseEntireData,completedLectures} = useSelector((state)=>state.viewCourse)
  const location = useLocation()



  const[videoData,setVideoData] = useState([])

  const [videoEnded,setVideoEnded] = useState(false)
  const [loading,setLoading] = useState(false)



  useEffect(()=>{
    const setVideoSpecificDetails = async()=>{
      if(!courseSectionData.length)
        return;
      if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses")
      }
      else{
        console.log("first")
        const filteredData = courseSectionData.filter((course)=>course._id===sectionId)
        console.log("second",filteredData);
        const filteredVideoData = filteredData?.[0]?.subSection.filter((course)=>course._id===subSectionId)
        console.log("third");

        console.log("filterd data",filteredData);
        console.log("fiteredVdideo",filteredVideoData);
        setVideoData(filteredVideoData?.[0])
        setVideoEnded(false)
      }
    }

    setVideoSpecificDetails();
  },[courseSectionData,courseEntireData])

  const isFirstVideo =()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id===sectionId)

    const subsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data)=>data._id===subSectionId)

    if (currentSectionIndex===0 && subsectionIndex===0){
      return true;
    }
    else{
      return false
    }
  }
  const isLastVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id===sectionId)

    const noofSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const subsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data)=>data._id===subSectionId)


    if (currentSectionIndex===courseSectionData.length-1 && subsectionIndex===noofSubSections-1){
      return true
    }
    else{
      return false
    }



  }

  const goToNextVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id===sectionId)

    const noofSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const subsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data)=>data._id===subSectionId)

    if(subsectionIndex !==noofSubSections-1) {

      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[subsectionIndex+1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }
    else{
      const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }

  }

  const goToPreviousVideo=()=>{

    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id===sectionId)
    const subsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data)=>data._id===subSectionId)

    if(subsectionIndex!=0){
      const prevSubSectionindex = courseSectionData[currentSectionIndex].subSection[subsectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionindex}`)
    }
    else{
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const noofSubSections = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionindex = courseSectionData[currentSectionIndex-1].subSection[noofSubSections-1]._id;

      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionindex}`);
    }

  }

  const handleLetureCompletion =async ()=>{
    setLoading(true);
    const res = await markLectureAsComplete({courseId:courseId,subsectionId:subSectionId},token);
    setLoading(false);
    if(res){
      dispatch(updateCompletedLectures(subSectionId))
    }
  }


  return (
    <div className="flex flex-col gap-5 text-white">
        {
          !videoData?(<div>No data found</div>):
          
          (
            

          <Player
            ref = {playerRef}
            aspectRatio = "16:9"
            playsInline
            onEnded = {()=>setVideoEnded(true)}
            src={videoData?.videoUrl}
            className='w-[80%] border-[2px] rounded-xl overflow-hidden border-richblack-300 flex object-cover'
            >
              <FaPlayCircle position="center"/>

              {
                videoEnded && (
                  <div style = {{backgroundImage:  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",backdropFilter:'blur(3px)' }}
                  className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"   >

                    {
                    !completedLectures.includes(subSectionId) &&(
                      <IconBtn
                        disabled={loading}
                        onclick={()=>handleLetureCompletion()}
                        text={!loading ? "Mark as Completed":"Loading..."}
                      />
                    )
                  }

                  <IconBtn
                   disabled={loading}
                   onclick={()=>{
                    if(playerRef?.current){
                      playerRef.current?.seek(0);
                      setVideoEnded(false);
                    }
                   }}

                   text="Rewatch"
                   customClasses="text-xl max-w-max px-4 mx-auto mt-2"                  />

                  <div  className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                    {
                      !isFirstVideo() && (
                        <button onClick={goToPreviousVideo} className='blackButton'>

                          Prev
                        </button>
                      )
                    }

                    {
                      !isLastVideo() &&(
                        <button  onClick={goToNextVideo} className='blackButton'>
                          Next
                        </button>
                      )
                    }
                  </div>

                    
                  </div>
                )
              }
                          </Player>


            

)
}
      <div className='w-full h-[3px] bg-richblack-700'></div>

      <div className='w-[90%] px-[2rem] flex flex-col gap-[1rem]'>

            <h1 className='text-[22px] font-semibold tracking-wide text-richblack-5'>
              {videoData?.title}
            </h1>
            <p className='text-[16px] font-medium text-richblack-100'>
              {videoData?.description}
            </p>
            </div>

    </div>
  )
}

export default VideoDetails