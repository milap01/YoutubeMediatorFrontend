import React, { useEffect,useState } from 'react'
import {useParams} from 'react-router-dom'
import { axiosApi } from '../api/axios';

function RegisterConfirmation() {

  const {token} = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(function(){

    setLoading(true);

    if (!token){
        return
    }

    const register = async () => {
        try {
            const response = await axiosApi.get(`/api/activate/${token}/`);
            console.log(response.data);
            setLoading(false);
            window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/login/`;

        } catch (error) {
            console.log(error);
            setLoading(false);
            setTimeout(function (){},100000000)
            window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/register/`;
        }
    } 

    register()

  },[])

  if (loading) {
    return <>
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
}

  return (
    <div>
      
    </div>
  )
}

export default RegisterConfirmation
