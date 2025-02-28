import React from 'react'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path:"../config/.env"
})

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if(!token){
            return res.status(401).json({
                message : "User Is Not Authenticated!" ,
                success : false
            })
        }

        // verified token
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decode);
        req.user = decode.UserId;
        next();
    } catch(error) {
        console.log(error);
    }
}

export default isAuthenticated;
  
