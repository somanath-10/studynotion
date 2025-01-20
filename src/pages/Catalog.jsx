import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';

import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_card from '../components/core/Catalog/Course_card';


function Catalog() {

    const {catalogName} = useParams();
    const [catalogpageData,setcatalogpageData] = useState(null);
    const [categoryId,setCateforyId] = useState("");
    useEffect(()=>{
        const getCategory = async()=>{
            if(!catalogName) return;
            try{
                const res = await apiConnector("GET",categories.CATEGORIES_API,{});
                const category_id = res?.data?.data?.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id;
                console.log("ID",category_id)
                setCateforyId(category_id)
            }
            catch(error){
                console.log("error",error)
            }
        }
        getCategory();
    },[catalogName])


useEffect(()=>{
    
    const getCategoryDetails = async()=>{
        if(!categoryId) return;
        try{
            console.log("category id",categoryId)
            const res = await getCatalogaPageData(categoryId);
            console.log("res in cat",res)
            setcatalogpageData(res)
            
        }
        catch(error){
            console.log(error)

        }
        

    }
    getCategoryDetails();


},[categoryId])

  return (
    <>
    {
        catalogpageData &&(
            <div  className=" box-content bg-richblack-800 px-4 text-richblack-25">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">
                    {`Home / Catlog /`}
                    <span className="text-yellow-25">
                        {catalogpageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p className="text-3xl text-richblack-5">
                {catalogpageData?.data?.selectedCategory?.name}
    
                </p>
                <p className="max-w-[870px] text-richblack-200">
                {catalogpageData?.data?.selectedCategory?.description}
    
                </p>
            </div>
    
            <div>
                {/* Section1 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Course to get you Started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
    
                        <div>
                            <CourseSlider Courses={catalogpageData?.data?.selectedCategory?.course}/>
                        </div>
    
                        
                </div>
    
    
                {/* Section2 */}
                <div  className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">
                        
                        Top Courses in {catalogpageData?.data?.differentCategory?.name}
    
                    </div>
                    
                    <div className="py-8">
                    <CourseSlider Courses={catalogpageData?.data?.differentCategory?.course}/>
                    </div>
    
                    <div>
                        {
                            catalogpageData?.data?.differentCategory?.course.map((elem,index)=>(
                                <div>
                                    {
                                        elem._id
                                    }
                                </div>
                            ))
                        }
                    </div> 
                </div>
    
                {/* Section3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Frequently Bought</div>
                    <div className=' py-8'>
    
                        <div className=' grid grid-cols-1 lg:grid-cols-2 gap-10'>
                            {
                                catalogpageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>(
                                        <Course_card course={course} key={index} Height={"h-[400px]"}/>
                                ))
                            }
    
                        </div>
    
    
                    </div>
    
                </div>
            </div>
    
            <Footer/>
        </div>
        )
    }
  </>
  )

}

export default Catalog