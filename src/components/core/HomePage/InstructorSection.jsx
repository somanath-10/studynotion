import React from 'react'
import aunty from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import Button from './Button'
import { FaArrowRight } from 'react-icons/fa';


function InstructorSection() {
  return (
        
        <div className = "flex flex-col lg:flex-row gap-20 items-center">
            <div className='lg:w-[50%]'>
                <img src={aunty} alt="" className=' shadow-white'  />


            </div>
            <div className='lg:w-[50%]  flex flex-col gap-10'>
                <div className=' lg:w-[50%] text-4xl font-semibold'>
                    Become an
                    <HighlightText text={"Instructor"} />
                </div>
                <p className=' font-medium text-[16px] w-[90%] text-richblack-300'>
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>

                <div className=' w-fit'>
                <Button active={true} linkto={"/signup"} className='w-fit'>
                <div className=' flex gap-3 items-center '>
                    Start Teaching Today
                    <FaArrowRight/>
                </div>
                </Button>
                </div>
                

            </div>


        </div>

    
  )
}

export default InstructorSection