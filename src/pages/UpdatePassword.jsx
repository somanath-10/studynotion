import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import {AiFillEyeInvicible,AiFillEye} from "react-icons/ai";
import CTAButton from '../components/core/HomePage/Button'
import { useLocation } from 'react-router-dom';

function UpdatePassword() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [showPassword,setshowPassword] = useState(false);
    const [showconfirmPassword,setconfimpassword] = useState(false);

    const {loading} = useSelector((state) =>state.auth);
    const [formData,setFormData] = useState({
        password:"",
        confirmPassword:"",
    })
    const changeHandler=(event)=>{
        setFormData((prev)=>({
            ...prev,[eve.target.name]:event.target.value

        }))
    }

    const{password,confirmPassword} = formData;

    const handleonSubmit = (e)=>{
    
        e.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password,confirmPassword,token));
        
    }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading?(
                <div className='spinner'>
                </div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5"> Choose New Password</h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">Almost done. Enter your new password and youre all set.</p>
                    <form onSubmit={handleonSubmit}>
                        <label className=' relative'>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"> New Password <sup className="text-pink-200">*</sup>  </p>        
                        <input
                            type={
                                showPassword?("text"):("password")
                            }
                            placeholder='enter new password'
                            value={password}
                            name='password'
                            onChange={changeHandler}
                            className="form-style w-full !pr-10"                             />
                        </label>

                        <span onClick={()=>setshowPassword((prev)=>!prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer"  >
                            {
                                showPassword?(<AiFillEyeInvicible/>):(<AiFillEye/>)
                            }
                        </span>

                        <label className="relative mt-3 block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">  Confirm New Password <sup className="text-pink-200">*</sup> </p>
                        <input
                            required
                            type={
                                setconfimpassword?("text"):("password")
                            }
                            placeholder='enter confirm password'
                            value={confirmPassword}
                            name='confirmpassword'
                            onChange={changeHandler}
className="form-style w-full !pr-10"
                            />
                        </label>

                        <span onClick={()=>setconfimpassword((prev)=>!prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                            {
                                showconfirmPassword?(<AiFillEyeInvicible/>):(<AiFillEye/>)
                            }
                        </span>


                        <button type='submit' className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900" >
                            Reset Password
                        </button>

                        <div className="mt-6 flex items-center justify-between">
                            <CTAButton linkto={'./login'}>
                                RBack to login                       
                            </CTAButton>
                        </div>


                        
                    </form>
                </div>
            )
        }

    </div>
  )
}

export default UpdatePassword