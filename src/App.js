
import './App.css';
import { Route,Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgetPassword from './pages/ForgetPassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Myprofile from './components/core/Dashboard/Myprofile';
import Error from './pages/Error'
import PrivateRoute from './components/core/auth/PrivateRoute';
import Settings from './components/core/Dashboard/settings';
import Cart from './components/core/Dashboard/Cart';
import { ACCOUNT_TYPE } from './utils/constants';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import { useDispatch, useSelector } from 'react-redux';
import MyCourses from './components/core/Dashboard/MyCourses';
import AddCourse from './components/core/Dashboard/Cart/AddCourse';
import EditCourse from './components/core/Dashboard/Editcourse';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import VideoDetailsSidebar from './components/core/ViewCourse/VideoDetailsSidebar';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Contact from './pages/Contact';
import Instructor from './components/core/Dashboard/instructorDashboard/Instructor';
import { useEffect } from 'react';
import { getUserDetails } from './services/operations/profileAPI';


function App() {
  const {user} = useSelector((state)=>state.profile)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className=' w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>

      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/catalog/:catalogName' element={<Catalog/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/update-password/:id' element={<ForgetPassword/>}></Route>
        <Route path='/verify-email' element={<VerifyEmail/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/courses/:courseId' element={<CourseDetails/>}></Route>
        <Route path='/contact' element={<Contact/>}/>




        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
                
                <Route path='/dashboard/my-profile' element={<Myprofile/>}></Route>
                <Route path='/dashboard/settings' element={<Settings/>}></Route>
              
                  {
                    user?.accountType===ACCOUNT_TYPE.STUDENT &&(
                      <>
                              <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}></Route>

                              <Route path='/dashboard/cart' element={<Cart/>}></Route>
                      </>
                    )
                  }
                  { user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                                                  <>
                                                      <Route path="dashboard/instructor" element={<Instructor />} />
                                                      <Route path="dashboard/add-course" element={<AddCourse />} />
                                                      <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
                                                      <Route path="dashboard/my-courses" element={<MyCourses />} />   
                                                      <Route path="/my-courses" element={<MyCourses/>}/>
                                                  </>
                                            )
                              }

        </Route>
        <Route path='/forgot-password' element={<ForgetPassword/>}></Route>
        <Route path='*' element={<Error/>}></Route>



        <Route element={
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
                element={<VideoDetails/>}/>
              </>
            )
          }

        </Route>
        
      </Routes>
      
    </div>
  );
}

export default App;
