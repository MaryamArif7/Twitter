import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
 
import{
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER}
from  "redux-persist";
import  storage  from 'redux-persist/lib/storage';//choosing storage engine
 // all the states will be stotred in local states
//meaning  the if user close the tab and aggain login that the information will be there untill the user 
// delted the cache.
import { PersistGate } from 'redux-persist/integration/react';
{/* 
Redux persist :
->to maintain the state managed by redux
->to store the info o authnitocation
->when we leave the app then agin logged in ,we see tl stays there ,at what post we were ,stays there

*/}
{/*
1-> persist confi accepting three things,key ,storage 
wht we want to perseist,which reducer
 */}
const persistConfig={
//key for the persisted state in storage  
  key:"root",
  //storge is local stroage here
  storage,version:1};
{/* 
2-> persist reducer  acceptin persist config and root reducer ,in below
auth reducer is the root reducer
the state will be persist based on provided reducer and rehydrate on the base of the persistconfi
*/}
const persistedReducer=persistReducer(persistConfig,authReducer);
{/*3->confiure store a redux tolkit function which takes persisted reducer and other */}
const store=configureStore({
  //root reducer 
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
getDefaultMiddleware({
  serializableCheck:{
//these specific actions will be ignored during serilazation checks
    ignoreActions:[
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER],
  },
}),
});
//persistor:is an object created by redux persist ,which handles the peristence of the store 
//basically what it does is that ,it saves the redux state to storge and rehydate it when the app starts aggain
//persist gate delay the renrendering to wait for the persisted state to eb restore 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>

      <PersistGate loading={null}  persistor={persistStore(store)}>
<App />
      </PersistGate>
    </Provider>

  </React.StrictMode>
);
