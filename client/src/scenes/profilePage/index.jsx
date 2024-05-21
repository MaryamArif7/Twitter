import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
/**
 function orders:
 ->ProiflePage
 ->useEffect
 ->getUser
 ->serverRes
 ->getUser process the response and rerender the compenent*/
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  /*Use Param:
 -> a route defined in react router Dom,which includes dynmic segment means id etc which can be 
different for every single person,then the value of dynamc sement can be accessed 
using useParams
  ->When the application's current URL matches a route with a dynamic segment, React Router DOM
   parses the URL and extracts the dynamic segment's value.
  >we user the param hook  to acess the paramentrs extracted
  from URL,so extracted key into userId
  */
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      //checki if the token is still valid
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };
/*
1.component mount:
 ->when the profilePage mounts >renders for the first time ,the useEffect s triggered
->the getUser function call is inside of the useEffect hook,
then this will call the http request too server to fetcht he data
->after http req is completed ,when the res is rec,then the getUser will
update the funnction state to setUser
->useEffect dependc array is empty meaning it will run only when the 
copeonent is mounted when the page is rendered first.

*/
  useEffect(() => {
    getUser();
  }, []); 

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;