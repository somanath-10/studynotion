import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';
import { useNavigate } from 'react-router-dom';


function RenderTotalAmount() {
    const {total,cart,totalItems} = useSelector((state)=>state.cart);
    const {user} = useSelector((state)=>state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {token} = useSelector((state)=>state.auth)


    const handleBuycourse = ()=>{

        const courses = cart.map((course)=>course._id);
        // console.log(courses)
        buyCourse(token,courses,user,navigate,dispatch)
        // console.log("Bought these courses",courses);
    }
    
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="mb-1 text-sm font-medium text-richblack-300">Total</p>

        <p className="mb-6 text-3xl font-medium text-yellow-100">Rs: {total}</p>


        <button onClick={()=>handleBuycourse()} className=' w-full justify-center px-4 py-2 bg-yellow-50 rounded-md'>
            Buy Now
        </button>
        <div>
          {totalItems}
        </div>
    </div>
  )
}

export default RenderTotalAmount