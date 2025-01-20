import React from 'react'
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/css'
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {FreeMode,Navigation,Pagination} from 'swiper/modules'
import { Autoplay } from 'swiper/modules'



import Course_card from './Course_card'

function CourseSlider({Courses}) {
  return (
    <>
        {
          

          Courses?.length ?(
            <Swiper
  loop={true} 
  slidesPerView={1}  // Correct this to slidesPerView
  spaceBetween={200} 
  modules={[Pagination, Autoplay,Navigation]}  // Include Autoplay in the modules
  className='mySwiper' 
  autoplay={{
    delay: 2800,
    disableOnInteraction: false,
  }}
  navigation
  breakpoints={{
    1024:{slidesPerView:2}
  }}
>
              {
                Courses?.map((course,index)=>(
                
                  <SwiperSlide key={index}>
                    
                    <Course_card course={course} Height={"h-[250px]"}/>
      
                  </SwiperSlide>
                ))
              }

            </Swiper>
          )
          :
          (
            <p className="text-xl text-richblack-5">No Course available in this catalog</p>
          )

          
          

        }

        </>

      )
    
  
}

export default CourseSlider