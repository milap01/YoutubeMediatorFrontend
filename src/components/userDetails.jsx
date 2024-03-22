import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';
import logo from '../assets/logo.png';

function UserDetails() {

    const { id } = useParams();
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true;

        setLoading(true);

        const fetchData = async () => {
            try {
                const cookie = Cookies.get('access_token');
                const response = await axiosApi.get(`/api/user-details/${id}/`, { headers: { Authorization: `Bearer ${cookie}` } });

                if (isMounted) {
                    setUser(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup function to prevent state update on unmounted component
        };
    }, [id])

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


        <>

            <div className='flex flex-col items-center mt-8'>

                <div className='mb-8'>
                    <img src={user.avatar} className='w-32 h-32 rounded-full border-4 border-white shadow-lg' alt='User Avatar' />
                    <div className='text-white text-center font-mono mt-4'>
                        {user.type}
                    </div>
                </div>

                <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden w-full max-w-xl">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-4 text-white">Bio</div>
                        <p className="text-white text-base leading-relaxed">
                            {user.bio}
                        </p>
                    </div>
                </div>

            </div>



        </>



    )
}

export default UserDetails
