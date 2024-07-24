import { createSlice } from "@reduxjs/toolkit";
/*intail state :
it is an object->has mode,user,token,posts as the properties  */
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};
//auth slice an object returened by cretae slice function with below peoprties 
export const authSlice = createSlice({
  name: "auth",
  initialState,
  //an object containg reducer function
  reducers: {
    //the state parameter represehts the current state of the slice
    setMode: (state) => {
      //mode property of state obj
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    //setFriends is takin an acyion from the disptch function 
    //If state.user exists (meaning there is a user object 
    //in the state), it updates the friends property of the user object with the friends data received from the action's payload
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        // in the id below if you dont put . before _id likes will not be updatwd
        //to the front end
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});
//Genertaed actions :
//Automatically created based on the reducer functions.
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
  //exported reducer :
  //The slice's reducer function is exported and used to configure the Redux store
  
export default authSlice.reducer;
/*------other notes-
createSlice uses this
Intuitive state updates: RTK integrates with the Immer library, which means you 
can write to stat````   e without handling immutability manually
the flow :
->user clciked on an an event 
->after clciking on any event ,an action is dispatched(we dispatch an action using useDispatch) which is a obj with proper. of type and payload
->pass through  a midleware
->in th store
->reducer function
->state change dependin on reducer fun
->copmennt rerender:
Components subscribed to the relevant parts of the Redux state using useSelector or connect are notified of the state changes.
->Ui update
*/