import React, { useEffect, useState } from 'react'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import {NavbarLinks} from '../../data/navbar-links'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart,AiOutlineMenu} from "react-icons/ai" 
import { ProfileDropDown } from '../core/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis';
import {IoIosArrowDropdownCircle} from "react-icons/io"
import { ACCOUNT_TYPE } from '../../utils/constants'
import { BsChevronDown } from "react-icons/bs"
import { FaHome } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdAssessment } from "react-icons/md";

// const sublinks = [
//     {
//         title:"python",
//         link:"/catalog/python"
//     },
//     {
//         title:"webdevelopment",
//         link:"/catalog/webdevelopment"
//     }
// ]

const Navbar = () => {
    const navigate = useNavigate();
    const{token}=useSelector((state)=>state.auth);
    const{user}=useSelector((state)=>state.profile);
    const {totalItems}=useSelector((state)=>state.cart);

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
      setIsOpen(!isOpen);
    };

    // api call for catalog
    const [sublinks,setsublinks] = useState([]);
    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        ;(async () => {
          setLoading(true)
          try {
            const res = await apiConnector("GET", categories.CATEGORIES_API,null,{Authorization: `Bearer ${token}`, })
            setSubLinks(res?.data?.data)
          } catch(error) {
            console.log("Could not fetch Categories.", error)
          }
          setLoading(false)
          console.log("links",subLinks)
        })()
      }, [])


    const location=useLocation();
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname);
    }
  return (
    <div className=' flex h-12 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex  w-11/12 max-w-maxContent items-center justify-between '>
        <button className=" md:hidden" onClick={toggleOverlay}>  <AiOutlineMenu fontSize={24} fill="#AFB2BF"/>  </button>

            <Link to={"/"}>
                <img src={logo} width={160} height={42} loading='lazy' className='md:flex hidden'/>
            </Link>




            {/*nav links */}

            <nav className='md:flex hidden'>
                <ul className=' flex gap-x-6 text-richblack-50 '>
                { NavbarLinks.map((link, index) => (

<li key = {index}>
    { link.title === "Catalog" ? (

               <>
                  <div className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25" }`} >
                      <p> {link.title} </p>  <BsChevronDown />                                   {/*   "Catalog \/"   */}     
                      
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                              { subLinks.length ? ( 

                                                        <> 
                                                            { subLinks?.map((subLink, i) => (
                                                                                                                          <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"  key={i} >
                                                                                                                              <p>{subLink.name}</p>
                                                                                                                          </Link>
                                                                                                                    ))
                                                            }
                                                        </>
                                            ):( <p className="text-center">No Courses Found</p> )
                            }                                     
                      </div>
                  </div>
               </>

          ) : (
            <Link to = {link?.path}>
              <p className = {` ${matchRoute(link?.path)? "text-yellow-25" : "text-richblack-25"} `}> {link.title}  </p>
            </Link>
            )
    }
</li>

))
}                   
               </ul>
            </nav>

            {/*Login/signup/dashboard */}

            <div className=' flex gap-x-4 items-center md:flex'>

                {
                    user && user.accountType!==ACCOUNT_TYPE.INSTRUCTOR &&(
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {
                                totalItems>0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to={"/login"}>
                            <button className=' border border-richblack-700 bg-richblack-800 px-[18px] py-[6px] text-richblack-100 rounded-md'>
                                login
                            </button>
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to={"/signup"}>
                            <button className=' border border-richblack-700 bg-richblack-800 px-[18px] py-[6px] text-richblack-100 rounded-md'>
                                signup
                            </button>
                        </Link>
                    )
                }
                {
                    token!==null && <ProfileDropDown/>
                }


            </div>

        </div>


        <div className={`fixed md:hidden top-0 left-0 z-50 h-full w-64 bg-richblack-800 transition-transform duration-300 ${isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleOverlay} className="text-white text-3xl">X</button>
                </div>
                <nav className="p-4 text-white ">
                    <ul onClick={toggleOverlay}>
                        <button onClick={()=>{navigate("/")}} className='relative px-8 py-2 font-medium flex gap-x-2 items-center hover:text-yellow-50 hover:scale-105 transition-all duration-200'><FaHome/>Home</button>
                        <button onClick={()=>{navigate("/about")}} className='relative px-8 py-2  font-medium flex gap-x-2 items-center hover:text-yellow-50 hover:scale-105 transition-all duration-200'><FaInfoCircle/>About</button>
                        <button onClick={()=>{navigate("/contact")}} className='relative px-8 py-2  font-medium flex gap-x-2 items-center hover:text-yellow-50 hover:scale-105 transition-all duration-200'><FaQuestionCircle/>Contact Us</button>
                        <button onClick={()=>{navigate("/dashboard/my-profile")}} className='relative px-8 py-2 font-medium flex gap-x-2 items-center hover:scale-105 hover:text-yellow-50 transition-all duration-200'><MdDashboard/>Dashboard</button>
                        <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>
                        <li className='px-8 flex items-center gap-x-2'><MdAssessment/>Catalog</li>
                        <div className=' mt-4'>
                            <div className='relative flex flex-col gap-y-4 px-8 py-2  text-richblack-200' > 
                                    { subLinks?.map((subLink, i) => (
                                            // <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="  hover:bg-yellow-50 transition-all duration-200"  key={i} >
                                            //     <p>{subLink.name}</p>
                                            // </Link>
                                            <button onClick={()=>navigate(`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`)} className="text-[14px] hover:scale-105 hover:text-yellow-50 transition-all duration-200"  key={i} >
                                                    <p>{subLink.name}</p>
                                            </button>
                                    ))
                                    }
                            </div>
                        </div>
                        <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>


                    </ul>
                </nav>
            </div>
    </div>
  )
}

export default Navbar