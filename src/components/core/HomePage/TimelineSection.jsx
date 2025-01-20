import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineimage from '../../../assets/Images/TimelineImage.png';


const timeline=[
    {
        Logo:Logo1,
        heading:"Leader",
        Description:"Fully committed to the success company"

    },
    {
        Logo:Logo2,
        heading:"Responsibity",
        Description:"Students will always be our top priority"

    },
    {
        Logo:Logo3,
        heading:"Flexible",
        Description:"The ability to switch is an important skills"

    },
    {
        Logo:Logo4,
        heading:"Solve the Problem",
        Description:"FCode your way to a solution"

    },
]

function TimelineSection() {
  return (
    <div>
        <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
            <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
                {
                    timeline.map((element,index)=>{
                        return (
                            <div key={index} className=' flex flex-col lg:gap-3'>
                                <div className="flex gap-6" key={index}>
                                    <div className = "w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">

                                        <img src={element.Logo}/>

                                    </div>
                                    <div>
                                        <p className='font-semibold text-[18px]'>{element.heading}</p>
                                        <p className=' text-base'>{element.Description}</p>
                                    </div>

                                </div>
                                      <div className = {` hidden ${timeline.length - 1 === index ? "hidden" : "lg:block"}  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px] `}> </div>

                            </div>
                        )
                    })
                }

            </div>

            <div className='relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>

                <img src={timelineimage} alt="timelineimage" className='shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit' />

                <div className='absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10'>
                    <div className='flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14'>
                        <p className='text-3xl font-bold w-[75px]'>10</p>
                        <h1 className='text-caribbeangreen-300 text-sm w-[75px]'>Years of Experience</h1>
                    </div>

                    <div className='flex gap-5 items-center lg:px-14 px-7'>
                    <p className='text-3xl font-bold w-[75px]'>50</p>
                    <h1 className='text-caribbeangreen-300 text-sm w-[75px]'>Types of courses</h1>

                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}

export default TimelineSection