import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import Footer from '../components/common/Footer';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';


function Home() {
  return (
    <div>
        {/* Section1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8'>
            <Link to={"/signup"}>
                <div className = 'group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none'>
                    <div className = "flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            <div className=' text-center text-4xl font-semibold mt-8'>
                Empower Your Future with 
                <HighlightText text={"Coding Skills"}/>
            </div>

            <div className=' text-center w-[90%] font-semibold text-richblack-300 text-lg mt-4'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>


            <div className=' flex flex-row gap-7 mt-8 items-center justify-center'>

                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>

            </div>

            <div className=' shadow-blue-300 my-12  flex justify-center items-center mx-auto'>

                <video muted loop autoPlay className=' shadow-custom'>
                    <source src={banner} type='video/mp4'/>

                </video>
            </div>

            <div>
                    <CodeBlocks active={true} position={"lg:flex-row"} header={
                        <div className=' font-semibold text-4xl'>
                            Unlock Your <HighlightText text={"coding potnetial"}/> {""}
                               with our online Courses
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabut1={
                        {
                            btnText:"try it Yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html> \n <html> \n head><title>Example</\ntitle><linkrel="stylesheet"href="styles.css \n /head>\nbody> \n h1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>\n>`}
                    codecolor={" text-yellow-25"}
                    backgroundgradient = {<div className = "codeblock1 absolute"></div>}/>

                    

                    
                    
                
            </div>


            <div>
                    <CodeBlocks active={true} position={"lg:flex-row-reverse"} header={
                        <div className=' font-bold text-[30px]'>
                            Unlock Your <HighlightText text={"coding potnetial"}/> {""}
                               with our online Courses
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabut1={
                        {
                            btnText:"try it Yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html> \n <html> \n head><title>Example</\ntitle><linkrel="stylesheet"href="styles.css \n /head>\nbody> \n h1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>\n>`}
                    codecolor={" text-yellow-25"}
                    backgroundgradient = {<div className = "codeblock2 absolute"></div>}/>   
                    
                
            </div>

            <ExploreMore/>

            


        </div>

        


        {/* section2 */}

        <div className=' bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg  h-[320px]'>
                    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                    <div className="lg:h-[150px]"></div>


                            <div className="flex flex-row gap-7 text-white lg:mt-8">
                                <CTAButton active={true} linkto={"/signup"}>
                                <div className=' flex flex-row justify-end items-end gap-1'>
                                Explore catalog

                                <FaArrowRight/>

                                </div>
                               
                                
                                </CTAButton>
                                <CTAButton active={false} linkto={"/signup"}>
                                    <div>
                                        Learn More
                                    </div>

                                </CTAButton>

                            </div>
                    </div>


            </div>


            <div className = "mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
                    <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className = "text-4xl font-semibold lg:w-[45%] ">
                                Get the skills you need for a <HighlightText text={"job that is in demand"}/>.

                        </div>

                        <div className = "flex flex-col items-start gap-10 lg:w-[40%]">
                            <div className=' text-[16px]'>

                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.


                            </div>
                            <div>
                                <CTAButton active={true}>
                                    <div>
                                    Learn More
                                    </div>
                                </CTAButton>
                            </div>

                        </div>
                    </div>

                    {/*section 3.1*/}

                    {/*section on images */}

                    <TimelineSection/>
                    <LearningLanguageSection/>

            </div>
        </div>
        
        






        {/* section3 */}


        <div className = "relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">

                <InstructorSection/>

            <h2 className=' text-center text-4xl font-semibold mt-10'>
                review from others learners
                {/* review slider */}                
            </h2>
            <ReviewSlider/>


        </div>





        {/* footer */}
        <Footer/>
    </div>
    
  )
}

export default Home