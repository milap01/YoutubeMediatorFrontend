import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';
import logo from '../assets/logo.png';

function UserDetails() {

    const { id } = useParams();
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(async function () {
        setLoading(true)

        console.log(id)

        try {
            const cookie = Cookies.get('access_token');
            const response = await axiosApi.get(`/api/user-details/${id}/`, { headers: { Authorization: `Bearer ${cookie}` } });

            console.log(response.data);

            setUser(response.data)
            setLoading(false)

        } catch (error) {
            console.log(error.message);
            setLoading(false)
        }

    }, [])

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
            
        <div className=' w-32 mb-6 mt-14 flex flex-col items-center justify-center' >
                <div>
                    <img src={user.avatar ? user.avatar : logo} className=' w-32 h-32 rounded-full  border-2  border-indigo-300 ' />
                </div>
                <div className='text-white text-center font-mono mt-4' >
                    {user.type}
                </div>
            </div>
        </div>




    )
}

export default UserDetails
