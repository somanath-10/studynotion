import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../../slices/courseSlice';
import { editCourseDetails } from '../../../../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';

function Publish() {
    const {register,handleSubmit,setValues,getValues} = useForm();
    const {token} = useSelector((state)=>state.auth);
    const {course}  = useSelector((state)=>state.course);
    const dispatch = useDispatch();
    const [loading,setLoading]  = useState(true);
    const navigate = useNavigate();

    const goToCOurses=()=>{
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses")

    }

    const handleCourseOperation=async()=>{
            // const form = new FormData();
            // form.append("courseId",course._id);
            // form.append("status","public")
            // const result = await editCourseDetails(form,token);
            setLoading(true);
            // if(result){
            //     goToCOurses();
            // }
            goToCOurses();
            // console.log("result in save chamges",result)
            setLoading(false);

        }

    const onSubmit=()=>{

        handleCourseOperation();

    }
    const goBack=()=>{

        dispatch(setStep(2));
        

    }
  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6 mb-8">
                <label htmlFor='public'>
                <input
                type='checkbox'
                id='public'
                {...register("public")}
                className="inline-flex items-center text-lg"                />

                <span className='ml-2 text-richblack-400'>
                Make this course as Public
                </span>
                </label>
            </div>

            <div className="ml-auto flex max-w-max items-center gap-x-4">
            <button disabled={loading} type='button' onClick={goBack} className='text-yellow-25 flex items-center rounded-md'>
                Back
            </button>
            <button type='submit' className='font-bold border-richblack-200 border border-r-2 border-b-2 px-4 py-2 rounded-md bg-yellow-50'>
                Save Changes
            </button>
        </div>
        </form>

        

    </div>
  )
}

export default Publish