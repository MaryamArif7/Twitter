
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
/*The Controller acts as an intermediary between the Model and the View. 
It handles user requests, processes input, and interacts with the Model to perform business logic. */
/* Register user */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
//generting the salt and hashing the password
//bycrypt.salt generates strin called salt
    const salt = await bcrypt.genSalt();
//then the salt is addded to the hashed password to add the another layer of randomness
    const passwordHash = await bcrypt.hash(password, salt);
//new instance of User is created User->Modal
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });
//this method will save the all the values of newUser in to the db
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Login */
export const login = async (req, res) => {
  try {
//extracting email and password from the body which will be provided by user while logging in
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "USER DOES NOT EXIST" });
    }
//if the user if found then it usses byrypt.compare to compare the 
//provided password the one which is store in the db
//in copmare method user.password is from the db
//and password ->from user while login in
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
//if the password matches it generates a token with user id and secret of jwt
//after enerating the token it deletes the passwrod 

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
/* after this user.password is delted :
->not deleted from the db but  it is removed from the user obj 
->its not returned in the response for th security purposes
->*/
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

