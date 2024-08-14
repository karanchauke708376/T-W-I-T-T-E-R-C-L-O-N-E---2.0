import { User } from "../Models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const Register = async (req , res) => {

    try {
        const {name , username , email , password} = req.body;
        // basic condition

        if(!name || !username || !email || !password) {
            return res.status(401).json({
                message : "All Fields are required! ." ,
                success : false 
            })
        }

        // Email Verified
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({
                message : "User already exist!" ,
                success : false 
            })
        }

        // Password Hashcode create
        const hashedPassword = await bcryptjs.hash(password , 16);


        await User.create({
            name ,
            username ,
            email,
            password : hashedPassword 
        })

        return res.status(201).json({
            message :  ` ${name} Account Created Successfully. ` ,
            success : true 
        })

    } catch (error) {
        console.log("User Account Not Created!");
    }
}

export const Login = async (req , res) => {
    try {
            const {email , password } = req.body;
            if(!email || !password) {
                return res.status(401).json({
                    message : "All Fields are required!" ,
                    success : false 
                })
            };

            // Email
            const user = await User.findOne({email});
            if(!user) {
                return res.status(401).json({
                    message : "Incorrect Email or Password" ,
                    success : false 
                })
            };

            // Password 
            const isMatch = bcryptjs.compare(password, user.password); 
            if(!isMatch){
                return res.status(401).json({
                    message : "Incorrect Email or Password" ,
                    success : false 
                })
            }

            const tokenData = {
                userId:User._id
            }
            const token =  jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            return res.status(201).cookie("token" , token , {expiresIn : "1d" , httpOnly : true }).json({
                message : ` Welcome Back  ${user.name} ` ,
                user ,
                success : true
            })

        
    }catch(error) {
        console.log("User Not Login Here!");
    }
}

export const Logout = (req , res) => {
    return res.cookie("token" , "" , {expiresIn : new Date(Date.now())}).json({
        message : "User Logged Out Successfully" ,
        success : true
    });
}

export const bookmarks = async(req , res) => {
    try {

        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);

        if(user.bookmarks.includes(tweetId)) {
            // Remove From Bookmarks
            await User.findByIdAndUpdate(loggedInUserId , {$pull : {bookmarks : tweetId}});
            return res.status(200).json({
                message : "Remove From Bookmarks!" ,
                success : true 
            })
        } else {
            // Add To Bookmarks
            await User.findByIdAndUpdate(loggedInUserId , {$push : {bookmarks : tweetId}});
            return res.status(200).json({
                message : "Add || Save  To Bookmarks Successfully" ,
                success : true 
            })

        }

    }catch(error) {
        console.log(error);
    }
}

export const getMyProfile = async (req , res) => {
    try {

        const id = req.params.id;         // password not include show your profile
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user ,
        })
    } catch(error) {
        console.log(error);
    }
}

export const getOtherUsers = async(req , res) => {
    try {
        const {id} = req.params;
        const otherUsers = await User.find({_id : {$ne : id}}).select("-password");
        if(!otherUsers) {
            return res.status(401).json({
                message : "Currently Not Available Users!" ,
                success : false 
            })
        };
        return res.status(200).json({
           otherUsers
        })
    }catch(error) {
        console.log(error);
    }
}

export const follow = async(req , res) => {  //sumit follow to anshu 
    try {
        const loggedInUserId = req.body.id; // Sumit
        const userId = req.params.id;      // Anshu

        const  loggedInUser = await User.findById(loggedInUserId); // Sumit
        const user = await User.findById(userId);   // Anshu

        /* 1 - Anshu k follower mai sumit ki id nhi hai toh
           2 - sumit follow karega anshu ko */

        if(!user.followers.includes(loggedInUserId)) {
            await user.updateOne({$push : {followers : loggedInUserId}});
            await loggedInUser.updateOne({$push : {following : userId}});
        } else {
            return res.status(400).json({
                message : `User already followed to ${user.name}` ,
            })
        };
        return res.status(200).json({
            message : `${loggedInUser.name} Following Now ${user.name}` ,
            success : true
        })

    }catch(error) {

    } 
}

export const unfollow = async(req , res) => {  //sumit unfollow to anshu 
    try {
        const loggedInUserId = req.body.id; // Sumit
        const userId = req.params.id;      // Anshu

        const  loggedInUser = await User.findById(loggedInUserId); // Sumit
        const user = await User.findById(userId);   // Anshu

        /* 1 - Anshu ab unfollower karege sumit ko   */

        if(loggedInUser.following.includes(userId)) {
            await user.updateOne({$pull : {followers : loggedInUserId}});
            await loggedInUser.updateOne({$pull : {following : userId}});
        } else {
            return res.status(400).json({
                message : `User Not followed to ${user.name}` ,
            })
        };
        return res.status(200).json({
            message : `${loggedInUser.name} UnFollow Now ${user.name}` ,
            success : true
        })

    }catch(error) {

    } 
}

