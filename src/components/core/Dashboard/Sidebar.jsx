import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useLocation, useNavigate } from 'react-router-dom'
import { VscSignOut } from "react-icons/vsc"
import Confirmationmodel from '../../common/Confirmationmodel'
import { IoIosSettings } from "react-icons/io";
import { NavLink } from 'react-router-dom'
import { matchPath } from 'react-router-dom'
function Sidebar() {
    const location = useLocation();
      const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
      }

    const {user,loading: profileLoading} = useSelector((state)=>state.profile);
    const {loading:authLoading} = useSelector((state)=>state.auth);
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    const[confirmationmodal,setconfirmationmodal]=useState(null);
    if(profileLoading||authLoading){
        return(<div className=' mt-10'>
            Loading...
        </div>
        )
    }
    
  return (
    <>
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">

            <div className=' flex flex-col'>
                {
                    sidebarLinks.map((link)=>{
                        if(link.type && user?.accountType !==link.type) return null
                        return(
                            <SidebarLink key={link.id} link = {link} iconName={link.icon}/>
                        )
                    })
                }

            </div>

            <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>

            <div className="flex flex-col">
                {/* <SidebarLink link={{name:"settings",path:"/dashboard/settings"}} iconName="VscSignOut"/> */}

                    <NavLink to = {"/dashboard/settings"}
                             className = {`relative px-8 py-2 text-sm font-medium ${matchRoute("/dashboard/settings") ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-300" } transition-all duration-200`} >
                     
                      <span className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute("/dashboard/settings") ? "opacity-100" : "opacity-0" }`}></span>
                                                                                                  {/* here matchRoute means link is opened or not , if opened then its color is yellow  */}
                      <div className="flex items-center gap-x-2">
                        <IoIosSettings className="text-lg" />              {/* Icon Goes Here */}
                        <span>settings</span>
                      </div>
                
                    </NavLink>
                <button onClick={()=>setconfirmationmodal({
                
                text1:"Are you sure ?",
                text2:"You will be logged out of your account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler:()=>dispatch(logout(navigate)),
                btn2Handler:()=>setconfirmationmodal(null),                
        })} className=' text-sm font-medium text-richblack-300'>
            

            <div className=' flex items-center gap-x-2 px-8 py-2 '>
                <VscSignOut className=' text-lg'/>
                <span>Logout</span>

            </div>



        </button>
            </div>


            

            </div>

            {confirmationmodal&&<Confirmationmodel modalData={confirmationmodal}/>}

    </>
  )
}

export default Sidebar