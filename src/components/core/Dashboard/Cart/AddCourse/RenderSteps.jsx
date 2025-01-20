import React from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from 'react-icons/fa'
import CourseInformation from './CourseInformation/CourseInformation'
import CourseBuilder from './CourseBuilder/CourseBuilder'
import Publish from './PublishCourse'
function RenderSteps() {

    const {step} = useSelector((state)=>state.course)

    const steps = [
        {
            id:1,
            title:"Course Information",

        },
        {
            id:2,
            title:"Course Builder",

        },{
            id:3,
            title:"Publish",

        },
    ]
  return (
    <div>
        <div className="relative mb-2 flex w-full justify-center">
            {
                steps.map((item)=>(
                    <>
                        <div className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${step === item.id?"bg-yellow-900 border-yellow-50 text-yellow-50":"border-richblack-100 bg-richblack-800 text-richblack-300"}`}>
                            {
                                step-1>=item.id ?(
                                        <FaCheck className=' bg-yellow-50 rounded-full text-richblack-700'/>
                                ):(item.id)}
                        </div>
                        
                        

                        {/* Add Dashes */}
                        {item.id !== steps.length && (
                        <>
                            <div className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${step > item.id  ? "border-yellow-50" : "border-richblack-500"} `}>
                            </div>
                        </>
                         )}
                        
                    </>
                ))
            }
        </div>
        <div className="relative mb-16 flex w-full select-none justify-between">
            {
                steps.map((item)=>(
                        <div className="flex min-w-[130px] flex-col items-center gap-y-2" key={item.id} >
                            <p className={`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`} >
                                {item.title}
                            </p>
                        </div>
                    
                ))
            }
        </div>

        {
            step===1 &&<CourseInformation/>
        }
        {
            step===2 &&<CourseBuilder/>
        }
        {
            step===3 && <Publish/>
        }
    </div>
  )
}

export default RenderSteps