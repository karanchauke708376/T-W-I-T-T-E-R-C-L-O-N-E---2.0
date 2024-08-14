import express from "express"
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute  from "./Routes/userRoute.js"
import tweetRoute from "./Routes/tweetRoute.js"
import cors from "cors";
import path from "path";

const _dirname = path.resolve();
console.log(_dirname);

dotenv.config({
    path: ".env"
})

databaseConnection();
const app = express();

// middlewares
app.use(express.urlencoded({
    extended : true 
}));

app.use(express.json());
app.use(cookieParser());

// a mechanism that allows certain types of requests, from another domain, protocol, or port, to work that would otherwise be restricted by the SOP.
const corsOptions = {
    origin: "http://localhost:3000" ,
    credentials : true
}

app.use(cors(corsOptions));

// API
app.use("/api/v1/user" , userRoute )
app.use("/api/v1/tweet" , tweetRoute)

app.use(express.static(path.join(_dirname , "/Frontend/twitter/build")));
app.get("*" , (req, res) => {
    res.sendFile(path.resolve(_dirname , "Frontend" , "twitter" , "build" , "index.html"));
})


// app.get("/home" , (req , res) => {
//     res.status(200).json({
//         message : "Comming From Backend ..."
//     })
// })  Twitter2.0/Backend/package.json





app.listen(process.env.PORT , () => {
    console.log(`Server Listen At Point :  ${process.env.PORT} `)
})