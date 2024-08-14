import express from "express";
import isAuthenticated  from "../config/auth.js"
import { createTweet } from "../Controllers/tweetController.js";
import { deleteTweet } from "../Controllers/tweetController.js";
import { likeOrDislike } from "../Controllers/tweetController.js";
import { getAllTweets } from "../Controllers/tweetController.js";
import { getFollowingTweets } from "../Controllers/tweetController.js";
 
const router = express.Router();

router.route("/create").post(isAuthenticated , createTweet);

router.route("/delete/:id").delete( isAuthenticated , deleteTweet);

router.route("/like/:id").put( isAuthenticated , likeOrDislike);

router.route("/getAllTweets/:id").get(isAuthenticated , getAllTweets);

router.route("/followingtweet/:id").get(isAuthenticated , getFollowingTweets);


export default router;

