import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  //isLogin and is Reister are both boolean variable,in js types are
  //determind dynamically,looking at the assigned values
  //so its boolean based on the comparsion
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  /*
->register an asyncronus function
takes->values->submitted by the user
             ->onSubmitProps->props by formik
*/
  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    //initialzes formData Obj
    const formData = new FormData();
    for (let value in values) {
      /*
  ->using loop,it will iterate through each key pair 
  ->and append each value to the formData obj 
  -> the append is the formData object method which is used to add key/vlue 
  pair to the form data.
  ->value is the varibale represneting key of the current property in the values 
  we are iterrataig over values 
  
  */
 
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);
/*
 About Fetch:
 ->The FetchApi provides  a js interface for accessing and maniuplatin parts of protocols such
 as req and res .
 ->it is promised based api 
 ->fetch takes one argument ->the path 
 ->but does not directly return the JSON res boody but returns 
 the promise whic resolves with  a response obj
 ->the res obj does not direclyty send the json response but the whole 
 HTTP reposnse 
 ->but the res have json method  
 ->so we can extract the json body contents from the reposnse obj using json() method
 
 
 */
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
//formData is an object
        body: formData,
      }
    );
//savedUserResponse obj waits for the sever reponse  and parses it as json
//savedUser stores the parsed JSON obj which contain information about the user registrtaion
//Calls a mothod to reset the form fields to thier initail values 
 const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
//if the user is successfully registered then setPageType to login
    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
/*This header informs the server that the data being sent in the body of the request is in JSON format.
 When the server sees this header, it knows how to properly parse the incoming data. Without this header, the server might not correctly interpret the body of the reques*/
      headers: { "Content-Type": "application/json" },
/*Converts the values object into a JSON string. The values object contains the user's login credentials, such as email and password.
. Since we are sending JSON data, we need to convert the JavaScript object (values) into a JSON string. */
      body: JSON.stringify(values),
    });
//waits for the server res and parses it as json
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
//loggedIn stores the parsed obj which conatins user info and token if login was successfull
//if loggedin was successfull and the returned the user infor
    if (loggedIn) {
//an actoon is dispatched to store with the user and token
//obtained from server's response
      dispatch(
//setLogin ->is an action creator fun,that creates an action
//to set the user's login status
        setLogin({
//loggedIn.user->contains the user obj revived from the server successfull login
          user: loggedIn.user,
//loggedIn.token ->conatins the authnetication token recived from server on sucessfull loin
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };
  /*Putpose of Dispatch: 
  Dispatching this action allows the application to store the user's authentication state (logged in) 
  and relevant user information (such as username, email, etc.) in the Redux store. Storing this information 
  centrally in the Redux store enables easy access to user data across different components of the application
  Tokens and User obj:
->The token received from the server upon successful login
  ->By storing the token in the Redux store, it can be easily accessed by components throughout the application 
  ->Storing the user object in the Redux store allows the application to access and display user-specific information 
  in various parts of the UI without needing to make additional requests to the server
  
  
  */

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };
  /*formik takes ->onSubmit
                ->inital Values
                ->Validation Schema to validate the values using Yup*/
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {/**Below are the helper method
       * values->an obj containing the current values
       */}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          {/*the above onSumbit binds this onSumbit with Formkis Hnadle submit 
          which triggers form validation and submissin logic  */}
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  //This will set bllur and handleChane event handler to formik's
                  onBlur={handleBlur}
                  onChange={handleChange}
                  //This binds the input field's value to values.firstName from Formik's state.
                  value={values.firstName}
                  name="firstName"
                  //This determines if the field should show an error state, based on whether it has been touched and if there is an error message.
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  //This sets the helper text to the error message if the field has been touched and has an error.
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  {/*Dropezone libary with the functionality used for handling files upload vi drag and drop */}
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    //onDrop triggering a callback function when files are dropped
                    //The call back function takes the accepetedFiles as an argument
                    //it then uses setFieldValue to update the value of this filed wich is picture ->field name
                    //with the first accepted file ->0->denotes first accepted file
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {/*
  ->Below is the render prop pattern ,whcih is mathod to share the code between compemnets 
  uisng a prop whose value is a function(getRootProps,getInputProps)
->we are paasing these as props to the child compoennt which is dropzone 
->Baiscally giving more control to the parent
->1st function->getRootProps->this generates the props that should spread on root container element of drozone compnwnt
->props like OnDRop,onDrag,onDragEnter etc.
->2nd Function->getInputProps-> this function will geenrate the props tht should spread on 
input element
->props include->triggering the file slection dialog when clicked
also incudes onChange,accept,mutliple
                     */}
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        //->below is spreading the all the props returned by the getRootProps
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {/*if login then button will have Login otheriwse register */}
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
