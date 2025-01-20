import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from "../../../../../common/IconBtn"
import { IoAddCircle } from "react-icons/io5";
import NestedView from './NestedView';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../../services/operations/courseDetailsAPI';


function CourseBuilder() {
  const {register, handleSubmit, setValue, formState: { errors }} = useForm()
  const [editSectionName,setEditSectionName]= useState(null);
  const {course} = useSelector((state)=>state.course);
  const dispatch = useDispatch();
  const{token} = useSelector((state)=>state.auth);
  const [loading,setLoading] = useState();


    const handleChangeEditSectionName =(sectionId,sectionName)=>{
      if(editSectionName===sectionId){
        cancelEdit();
        return;
      }
      setEditSectionName(sectionId);
      setValue("sectionName",sectionName);
    }
  const onSubmit =async (data)=>{
    setLoading(true);
    let result;

    if(editSectionName){
      result = await updateSection({
        sectionName:data.sectionName,
        sectionId:editSectionName,
        courseId:course._id,
      },token
    )
    }
    
    else{
      result = await createSection({
        sectionName:data.sectionName,
        courseId:course._id,
      },token
    )

    }
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null);
      setValue("sectionName","")
    }


  }

  const cancelEdit = ()=>{
    setEditSectionName(null);
    setValue("sectionName","");

  }
  const goBack = ()=>{

        dispatch(setStep(1));
        dispatch(setEditCourse(true))
  }
  const goToNext = ()=>{
    if(course.courseContent.length===0){
      toast.error("Please enter one section");
      return;
    }
    if(course.courseContent.some((Section)=>Section.subSection.length===0)){
      toast.error("enter sub section in each section")
      return ;
    }
    
    dispatch(setStep(3));

    


  }
  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name
          </label>
          <input
          id='sectionName'
          placeholder='Add Section Name'
          {...register("sectionName",{required:true})}
          className="form-style w-full"
          />
          {
            errors.sectionName &&(
              <span>Field is required</span>
            )
          }
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn
          type='Submit'
          text={editSectionName?"Edit Section Name":"Create Section"}
          outline={true}
          customClasses={"text-white"}>
          <IoAddCircle className=' text-yellow-50'/>
          </IconBtn>


          {
            editSectionName&&(
              <button onClick={cancelEdit} className="text-sm text-richblack-300 underline">
                Cancel Edit
              </button>
            )
          }
        </div>
      </form>

      {
        course?.courseContent.length>0 &&(
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }

      <div className=' flex justify-end gap-x-3 mt-10'>

        <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
          Back
        </button>

        <IconBtn
        text='Next'
        onclick={goToNext}
        />

      </div>

      


      
    </div>
  )
}

export default CourseBuilder