import React, { useState } from 'react'
import { Chart,registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables)

function InstructorChart({courses}) {

    const [currChart,setCirrentChart] = useState("students");
    //func to generate random colors
    const randomColors = (numColors)=>{
        const colors = [];
        for(let i=0;i<numColors;i++){
            const color = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
            colors.push(color);
        }
        return colors;
    }


    //create data for chart display student detail

    const chartDataForStudents = {
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalStudentsEnrolled),
                backgroundColor:randomColors(courses.length)
            }
        ]
    }
    //create data for chart display income info
    const chartDataForIncome = {
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalAmountGenerated),
                backgroundColor:randomColors(courses.length)
            }
        ]
    }

    //create options
    const options = {

    }


  return (
    <div  className="w-full justify-center items-center flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualises</p>
        <div className='w-[100%] flex justify-center items-center mx-auto md:flex-row flex-col'>
            <button onClick={()=>setCirrentChart("students")}  className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "students" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400" }`}>
                Student
            </button>
            <button onClick={()=>setCirrentChart("income")} className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "income" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400" }`}>
                Income
            </button>
        </div>
        <div className="w-full flex items-center justify-center mx-auto aspect-square h-[300px]">
            <Pie data={currChart==='students' ? chartDataForStudents : chartDataForIncome} options={options}/>
        </div>
    </div>
  )
}

export default InstructorChart