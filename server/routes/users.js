import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
/* Read route
the route startung with /users is directed here so the 
after /users will also be  directed here
so from the index.js:/users
from fronend the fetch req is :the req qas made by frontend to here witih token
/users/${userId}
->when req hits this endpoint then the middleware verify is called first
>if the token is valid the getUser controller is called
with the user Id exxtracted from the request URLint eh contrller fun */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
/* Update route for friends list */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
