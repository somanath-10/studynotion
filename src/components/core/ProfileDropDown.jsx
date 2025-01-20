import React from 'react'
import {useState,useRef } from 'react'
import { logout } from '../../services/operations/authAPI';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"
import useOnClickOutside from "../../hooks/useOnClickOutside"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import Confirmationmodel from '../common/Confirmationmodel';


export const ProfileDropDown = () => {
  const {user} = useSelector((state)=>state.profile);
  const dispatch = useDispatch();
  const ref = useRef(null)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)

  const[confirmationmodal,setconfirmationmodal]=useState(null);


  return (
<>

    <button className="relative">

    <div className="flex items-center gap-x-3">
      <button className=' px-3 py-[8px] bg-richblack-800 rounded-md text-[16px] text-richblack-200 font-semibold border border-r-2 border-t-0 border-l-0 border-b-2 border-richblack-600 hover:scale-105 transition-all duration-200' onClick={()=>setconfirmationmodal({
                      
                      text1:"Are you sure ?",
                      text2:"You will be logged out of your account",
                      btn1Text:"Logout",
                      btn2Text:"Cancel",
                      btn1Handler:()=>dispatch(logout(navigate)),
                      btn2Handler:()=>setconfirmationmodal(null),                
              })} >Logout</button>
      <div className=' px-3 py-[8px] bg-yellow-50 rounded-md text-[16px] font-semibold border border-r-2 border-t-0 border-l-0 border-b-2 border-yellow-5 hover:scale-105 transition-all duration-200' onClick={()=>navigate('/dashboard/my-profile')}>Dashboard</div>
      <button onClick={()=>navigate("/dashboard/my-profile")}>
        <img src={user?.image} alt={`profile-${user?.firstName}`}  className="aspect-square w-[30px] rounded-full object-cover" />

      </button>
      {/* <AiOutlineCaretDown className="text-sm text-richblack-100 md:flex hidden" /> */}
    </div>
    {/* {open && (
      <div onClick={(e) => e.stopPropagation()}  ref = {ref}  className="md:flex hidden absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800" >
        <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
          <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
            <VscDashboard className="text-lg" />
            Dashboard
          </div>
        </Link>
        <div onClick = {() => {dispatch(logout(navigate));  setOpen(false); }}  className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25" >
          <VscSignOut className="text-lg" />
          Logout
        </div>
      </div>
    )} */}
  </button>
  {confirmationmodal && <Confirmationmodel modalData={
confirmationmodal

  }/>}

  </>

  )
}
