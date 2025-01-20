import React from 'react'
import HighlightText from './HighlightText'
import Knowyourp1 from '../../../assets/Images/Know_your_progress.png';
import Knowyourp2 from '../../../assets/Images/Compare_with_others.png';
import cal from '../../../assets/Images/Plan_your_lessons.png';
import Button from './Button';

function LearningLanguageSection() {
  return (
    <div>
        <div className='text-4xl font-semibold text-center my-10'>

            <div className=' text-4xl font-semibold text-center'>
            Your swiss knife for <HighlightText text={"learning any language"}/>
            </div>
            <p className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </p>


            <div className = "flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
                <img src={Knowyourp1} alt="know your progess" className='object-contain lg:-mr-32' />
                <img src={Knowyourp2} alt="compare with others" className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'/>
                <img src={cal} alt="calender" className='object-contain lg:-ml-36 lg:-mt-5 -mt-16'/>



            </div>


        </div>
        <div className = "w-fit mx-auto lg:mb-20 mb-8 -mt-5">
                <Button active={true}>
                    Learn More

                </Button>
            </div>
    </div>
  )
}

export default LearningLanguageSection