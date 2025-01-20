import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input';
import CTAButton from '../components/core/HomePage/Button'
import { sendOtp, signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
    const {signupData,loading} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const[otp,setotp]   = useState("");
    const dispatch = useDispatch();

   
        if(!signupData){
            navigate("/signup");
        }


    const handleonSubmit = (e)=>{
        e.preventDefault();
        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmpassword
        } = signupData;
        
        dispatch(signUp(accountType,
            firstName,
            lastName,
            email,
            password,
            confirmpassword,otp,navigate));
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">

        {
            loading?(
                <div className='spinner'>
                </div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">A Verification code has sent to your email. Enter the code below</p>

                    <form onSubmit={handleonSubmit}>
                        <OTPInput
                        value={otp}
                        numInputs={6}
                        onChange={setotp}
                        renderSeparator={<span>-</span>}
                        inputStyle={{width:"15%",height:"50px",maxHeight:"50px",maxWidth:"50px",borderRadius:"0.5rem",backgroundColor:"#161D29",borderBottom:"2px solid #424854",color:"#F1F2FF",}}

      renderInput={(props) => <input {...props}/>}
      style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",}}  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50" 
      />

      <button type='submit' className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
        verify Email
      </button>

                        

                    </form>

                    <CTAButton linkto={'/login'} className="text-richblack-25">
                    Back to Login
                    </CTAButton>

                    <button onClick={()=>dispatch(sendOtp(signupData.email))} className="flex items-center text-blue-100 gap-x-2">
                        Resend it
                    </button>

                    
                </div>
            )
        }

    </div>
  )
}

export default VerifyEmail