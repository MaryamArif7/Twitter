import express from "express";/* The Express.js framework for building web applications.*/
import bodyParser from "body-parser"; /*: Middleware for parsing incoming request bodies.*/
import mongoose  from "mongoose"; /*n Object Data Modeling (ODM) library for MongoDB, used for interacting with the MongoDB database.*/
import cors from "cors"; /*Middleware for enabling Cross-Origin Resource Sharing (CORS), allowing requests from different origins.*/
import dotenv from "dotenv";/*: A module for loading environment variables from a .env file.*/
import multer from "multer"; /* Middleware for handling multipart/form-data, primarily used for uploading files.*/
import helmet from "helmet";/*: Middleware for setting various HTTP headers to enhance security.*/
import morgan from "morgan";/*Middleware for logging HTTP requests.*/
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"
import { fileURLToPath } from "url";
import { error } from "console";
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import{createPost} from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users,posts} from "./data/index.js";
/*configuration*/
const __filenme=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filenme);
dotenv.config();
// app.use is a method used to mount middleware functions at a specified path. 
//middlewre fun has access to req and res objects ,it has path and midleware function"next" what next handles should be
const app =express();
app.use(express.json());
//Helmet is a security middleware that protects Express.js apps by setting various HTTP headers
//when we open the network tab w can see the detail about our app ,by using this middleware we can protect 
//our appliaction from unwanted attacks and vulnerablities ,we can see they wil eb turned off in the headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
//morgan is an HTTP request logger middleware for Node.js that generates logs for each API reques
//common, a standard Apache common log output.
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
//a very useful middleware ,when we are working with full stack application ,we need this 
//to send req from frontend to backend
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));
/* file storage */
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload=multer({storage});
/*routes with files */
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",verifyToken, upload.single("picture"),createPost);
/*routes*/

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

/*mooooooongooo*/
const PORT =process.env.PORT ||6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewURLParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    app.listen(PORT,()=>console.log(`Server Port:${PORT}`));
/*add data one time*/
User.insertMany(users);
Post.insertMany(posts);
})
.catch((error)=>console.log(`${error} did not connect`));