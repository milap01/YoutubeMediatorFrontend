import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate} from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './/components/Login.jsx'
import Home from './components/Home.jsx';
import Auth from './components/Auth.jsx';
import Notifications from './components/Notifications.jsx'
import { RecoilRoot } from 'recoil';
import Profile from './components/Profile.jsx';
import Error from './components/Error.jsx';
import Success from './components/Success.jsx';
import VideoUpload from './components/VideoUpload.jsx'
import Confirmation from './components/Confirmation.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(


          <>
      <Route path="user" element={<Auth />} >
         <Route path='register' element={<Register />} />
         <Route path='login' element={<Login />} />
      </Route>

    <Route path='/' element={<App />} >
        <Route path='' element={<Home />} />
        <Route path='profile' element={<Profile />} /> 
        <Route path='notifications' element={<Notifications />} />  
        <Route path='error' element={<Error />} />
        <Route path='oauth2callback' element={<Success />} />
        <Route path='video-upload' element={<VideoUpload />} />
        <Route path='confirmation-page' element={<Confirmation />}/>
        <Route path='error' element={<Error />} />
        <Route path='*' element={<Navigate to='error' />} />
   
    </Route> 
    </>
 
    
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
   
   <RecoilRoot>
   <RouterProvider router={router} />
   </RecoilRoot>
 
 
)
