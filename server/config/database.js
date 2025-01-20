const mongoose=require('mongoose')
require("dotenv").config()

const dbconnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("database connected successfully"))
    .catch((error)=>console.log("error in connecting database"))
}

module.exports=dbconnect;