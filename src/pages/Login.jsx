import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/auth/Template"

function Login({setIsLoggedIn}){
  return (

    <Template title="Welcome Back"  description1="Build skills for today, tomorrow, and beyond." description2="Education to future-proof your career."   image = {loginImg} formtype = "login"/>

  )}

export default Login