import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiSolidDownArrow } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import SubSectionModal from './SubSectionModal';
import Confirmationmodel from '../../../../../common/Confirmationmodel'

import { deleteSection, deleteSubSection } from '../../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../../slices/courseSlice';



function NestedView({handleChangeEditSectionName}) {
    const {course} = useSelector((state)=>state.course);
    const{token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const[addSubSection,setAddSubSection] = useState(null);
    const[viewSubSection,setviewSubSection] = useState(null);
    const [editSubSection,setEditsubsection] = useState(null);
    const[confirmationmodal,setconfirmationmodal] = useState(null);


    const handleDeleteSection = async(sectionId)=>{

           const result =  await deleteSection({
                sectionId,courseId:course._id,token,
    })
    dispatch(setCourse(result))
    setconfirmationmodal(null);

            


    }
 const handleDeleteSubSection=async(subsectionId,sectionId)=>{
    const result = await deleteSubSection({subsectionId,sectionId,token});
    if(result){
        const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section  )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))    }

        setconfirmationmodal(null);


 }

  return (
    <div>

        <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer" >
            {
                course?.courseContent?.map((section)=>(
                    <details key={section._id} open className='mt-1 bg-richblack-700 text-richblack-25'>
                        <summary className=' flex items-center justify-between gap-x-3 border border-richblack-700'>

                                <div className=' flex gap-x-3 items-center'>
                                    <RxDropdownMenu/>
                                    <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                                </div>

                                <div className=' flex items-center gap-x-3'>
                                    <button onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                                        <MdModeEdit className="text-xl text-richblack-300"/>
                                    </button>
                                    <button onClick={()=>{
                                        setconfirmationmodal({
                                            text1:"Delete this section",
                                            text2:"All the letures will be deletd in this section",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:()=>handleDeleteSection(section._id),
                                            btn2Handler:()=>setconfirmationmodal(null)
                                        })
                                    }}>
                                        
                                        <MdDelete className="text-xl text-richblack-300"/>
                                    </button>


                                    <span className="font-medium text-richblack-300">
                                        |
                                    </span>
                                    <BiSolidDownArrow className={`text-2xl text-richblack-300 cursor-pointer`}/>
                                </div>
                        </summary>
                        <div className="px-6 pb-4">
                            {
                                section.subSection.map((data)=>(
                                    <div key={data._id} onClick={()=>setviewSubSection(data)} className=' flex items-center justify-between gap-x-3 border'>
                                            <div className="flex items-center gap-x-3 py-2 ">
                                                <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                                <p className="font-semibold text-richblack-50">{data.title}</p>
                                            </div>
                                            <div onClick={(e)=>e.stopPropagation()}  className=' flex items-center gap-x-3'>
                                                    <button onClick={()=>setEditsubsection({...data,sectionId:section._id})}>
                                                        <MdModeEdit className="text-xl text-richblack-300" />
                                                    </button>
                                                    <button onClick={()=>{
                                                        setconfirmationmodal({
                                                            text1:"Delete this section",
                                                            text2:"All the letures will be deletd in this section",
                                                            btn1Text:"Delete",
                                                            btn2Text:"Cancel",
                                                            btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                                            btn2Handler:()=>setconfirmationmodal(null),
                                                        })
                                                       
                                                    }
                                                    }>
                                                        <MdDelete className="text-xl text-richblack-300"/>
                                                    </button>
                                            </div>

                                    </div>
                                    
                                ))
                                
                            }
                            <button onClick={()=>setAddSubSection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-50">
                                Add Leture
                                <IoMdAddCircleOutline className=' text-yellow-50'/>

                            </button>
                            
                        </div>
                    </details>
                ))
            }
        </div>
        {
            addSubSection?(<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true}/>):viewSubSection?(<SubSectionModal modalData={viewSubSection} setModalData={setviewSubSection} view={true}/>):(editSubSection)?(<SubSectionModal modalData={editSubSection} setModalData={setEditsubsection} edit={true}/>):(<div></div>)
        }

        {
            confirmationmodal?(<Confirmationmodel modalData={confirmationmodal}/>):(<div></div>)
        }

    </div>
  )
}

export default NestedView