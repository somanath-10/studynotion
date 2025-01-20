const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors()); 

app.use(
	fileUpload({ 
		useTempFiles:true,                    
		tempFileDir:"/tmp",
	})
)
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/auth",paymentRoutes);
app.use("/api/v1/auth",profileRoutes);
app.use("/api/v1/auth",courseRoutes);
app.use("/api/v1/auth",contactUsRoute);

cloudinaryConnect();

app.listen(PORT,()=>{
	console.log(`listening at port:${PORT}`)
})
