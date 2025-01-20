import React, { useState } from 'react'
import CTAButton from '../components/core/HomePage/Button' 
import { useDispatch, useSelector } from 'react-redux'
import { getPasswordResetToken } from '../services/operations/authAPI';
function ForgetPassword() {
    const {loading} = useSelector((state)=>state.auth);
    const [emailSent,setEmailSent]=useState(false);
    const[email,setemail]=useState("");
    const dispatch = useDispatch();

    const handleonSubmit = (e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))

    }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading?(
                <div className='spinner'>Loading ...</div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8" >

                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        {
                            !emailSent?"Reset your password":"Check Your Mail"
                        }
                    </h1>

                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        {
                            !emailSent?"Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery":`We have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={handleonSubmit}>
                        {
                            !emailSent &&(
                                <label className=' w-full'>
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Email Address <sup className="text-pink-200">*</sup> </p>
                                    <input
                                    type='email'
                                    placeholder='Enter your email'
                                    value={email}
                                    className="form-style w-full" 
                                    onChange={(event)=>setemail(event.target.value)}/>
                                </label>
                            )
                        }

                        <button type='submit' className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900" >
                            {
                                !emailSent?(

                                    "Reset Password"

                                ):(
                                    "Resend Email"

                                )
                            }
                        </button>
                        
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        
                        <CTAButton active={true} linkto={"/login"}>Back To Login</CTAButton>
                            
                    </div>



                </div>
            )
        }
        
    </div>
  )
}

export default ForgetPassword