import express from"express";
import { login, register } from "../controllers/auth.js";

//creates an instnce of router 
const router =express.Router( );
//define a route for handlin login reqs ,"login"->endpoint 
//if thers is req to this endpoint then ->login controller will be called
router.post("/login",login);
router.post("/register",register);
export default router; 