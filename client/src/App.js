import { BrowserRouter,Navigate,Routes,Route } from "react-router-dom";
import HomePage from 'scenes/homePage';
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "./theme";
function App() {
/*
useSelector: useSeltor is used to read the state from the store
it takes->selctoor func
the selctor fun accepts the entire state of reedux store 
and returns the peice of the state wich we wnt to acees




*/
  const mode =useSelector((state)=>state.mode);//helps to ggrab the state
const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode]);
const isAuth=Boolean(useSelector((state)=>state.token));
  return (
    <div className="App">
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
    <Routes>
      <Route path="/"element={<LoginPage/>}/>
      <Route path="/home" element={isAuth ?<HomePage/>:<Navigate to ="/"/>}/>
      <Route path="/profile/:userId" element={isAuth ?<ProfilePage/>:<Navigate to ="/"/>}/>
    </Routes>
    </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}
export default App;
