import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { loadingAtom} from '../store/atoms/auth';
import {useRecoilState} from 'recoil';
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';

function Success() {

    const [isLoading, setLoading] = useRecoilState(loadingAtom);

    useEffect(function (){

      setLoading(true);
        
      const searchString = window.location.search;

      const url = new URLSearchParams(searchString);

      const code = url.get('code');

      const error = url.get('error');

      console.log(code);
      console.log(error);


      if (!error){


        try {
          const getTokens = async () => {
            setLoading(false)
            const response = await axios.post(`https://oauth2.googleapis.com/token`,{
               'code':code,
               'client_id':import.meta.env.VITE_CLIENT_ID,
               'client_secret':import.meta.env.VITE_CLIENT_SECRET,
               'redirect_uri' :import.meta.env.VITE_REDIRECT_URI,
               'grant_type' : 'authorization_code',
            },{
                headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded'
                }
            });
            setLoading(true)
            
            const {access_token,refresh_token} = response.data;
            console.log(access_token);
            console.log(refresh_token);
            console.log(response.data);


            const cookie = Cookies.get('access_token');
            try {

              if (!access_token || !refresh_token){
                setLoading(false)
                // window.location.href = import.meta.env.VITE_ROOT_URL
                // return
              }

              const saveTokens = await axiosApi.put('api/user-profile/',{
                "full_name": localStorage.getItem('full_name'),
                "email": localStorage.getItem('email'),
                "credentials":response.data
              },{
                headers : {Authorization : `Bearer ${cookie}`}
              })
      
              setLoading(false);
      
              // window.location.href = import.meta.env.VITE_ROOT_URL
            } catch (error) {
              setLoading(false)
              // window.location.href = import.meta.env.VITE_ROOT_URL
            }
         }
    
         getTokens()
         } catch (error) {
          
          console.log(error);
          setLoading(false);
          // window.location.href = import.meta.env.VITE_ROOT_URL
    
         }


      }else{
        setLoading(false)
        // window.location.href = import.meta.env.VITE_ROOT_URL
      }

     
        
    },[])


    if (isLoading) {
      return (
          <>
              <div className="min-h-[55rem] flex flex-col bg-white border shadow-sm  dark:bg-black dark:border-gray-700 dark:shadow-slate-700/[.7]  ">
                  <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
                      <div className="flex justify-center">
                          <div className="animate-spin inline-block w-16 h-16 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                              <span className="sr-only  ">Loading...</span>
                          </div>
                      </div>
                  </div>
              </div>
          </>
      )
  }

  return (
    <div className='text-white text-4xl text-center mt-12'>
      <h1>Success</h1>
    </div>
  )
}

export default Success
