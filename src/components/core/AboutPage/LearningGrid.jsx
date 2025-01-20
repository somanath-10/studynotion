import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import CTAButton from '../HomePage/Button'
const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highlightText: "Anyone, Anywhere",
      description:  "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum Based on Industry Needs",
      description: "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",   
    },
    {
      order: 2,
      heading: "Our Learning Methods",
      description: "Studynotion partners with more than 275+ leading universities and companies to bring",   
    },
    {
      order: 3,
      heading: "Certification",
      description:  "Studynotion partners with more than 275+ leading universities and companies to bring",  
    },
    {
      order: 4,
      heading: `Rating "Auto-grading"`,
      description: "Studynotion partners with more than 275+ leading universities and companies to bring",     
    },
    {
      order: 5,
      heading: "Ready to Work",
      description:  "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
  ];
  
function LearningGrid() {
  return (
    <div className=' grid lg:grid-cols-4 grid-cols-1 grid-rows-2 mx-auto mb-10 w-11/12 max-w-maxContent'>
        {
            LearningGridArray.map((card,index)=>{
                return(
                    <div key={index} className={`${index === 0 && "lg:col-span-2 lg:h-[250px] p-5"}
                    ${
                        card.order % 2===1?"bg-richblack-700":"bg-richblack-800 lg:h-[280px] p-5"
                    }
                    ${
                        card.order===3 && "lg:col-start-2"
                    }
                    ${
                        card.order<0 && "bg-transparent"
                    }
                    `}>
                        {
                            card.order<0 ?(
                                <div className=' lg:w-[90%] flex flex-col pb-5 gap-3 '>
                                    <div className=' font-semibold'>
                                        <h1 className=' text-4xl'>{card.heading}</h1>
                                        <h1 className=' text-4xl'>
                                        <HighlightText text={card.highlightText}/>

                                        </h1>
                                        
                                        <p className='text-xl'>Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.</p>
                                        <div>
                                        <CTAButton active={true} linkto={card.BtnLink}>
                                            {card.BtnText}

                                        </CTAButton>
                                        </div>
                                    </div>
                                </div>
                            ):
                            (
                                <div className=' flex flex-col gap-8 p-7'>
                                    <h1 className=' text-richblack-300 text-lg'>
                                        {card.heading}
                                    </h1>
                                    <p>{card.description}</p>
                                </div>
                            )
                        }

                    </div>
                )
            })
        }

    </div>
  )
}

export default LearningGrid