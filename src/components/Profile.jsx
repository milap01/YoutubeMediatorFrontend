import React, { useEffect, useState } from 'react'
import UploadWidget from './UploadWidget'
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';
import logo from '../assets/logo.png';

function Profile() {

    const [avatar, setAvatar] = useState('avatar');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [full_name, setFullName] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(false);
    const [msgToken, setMsgToken] = useState("")
    const [open,setOpen] = useState(true)

    useEffect(function () {

        setLoading(true);
        const cookie = Cookies.get('access_token');

        const userInfo = async function () {

            try {
                const response = await axiosApi.get('/api/user-profile/', {
                    headers: { Authorization: `Bearer ${cookie}` }
                })
                setEmail(response.data.email);
                setFullName(response.data.full_name);
                setType(response.data.type);
                setAvatar(response.data.avatar)
                setLoading(false);
            } catch (err) {

                if (err.response.status == 401) {
                    window.location.href = import.meta.env.VITE_ROOT_URL
                }
                setLoading(false);

            }

        }

        userInfo();



    }, [error])

    async function revokeTokens() {
        setLoading(true)

        try {
            const cookie = Cookies.get('access_token');

            const response = await axiosApi.get('/api/revoke/', { headers: { Authorization: `Bearer ${cookie}` } })

            console.log(response.data);
            setMsgToken(response.data.msg)

            setLoading(false)

        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    async function handleSubmit() {

        setLoading(true);
        try {
            const cookie = Cookies.get('access_token');
            const response = await axiosApi.put('/api/user-profile/', {
                "full_name": full_name,
                "email": email,
                "avatar": avatar
            }, {
                headers: { Authorization: `Bearer ${cookie}` }
            })

            setEmail(response.data.email);
            setFullName(response.data.full_name);


            setLoading(false);

        } catch (error) {
            if (error.response.status == 401) {
                window.location.href = import.meta.env.VITE_ROOT_URL
            }
            setLoading(false);
            setError(true);
        }
    }

    function closeBanner(){
        setOpen(false)
    }




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
            {error ? <div>
                <div className="bg-red-200 text-center  text-black py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">Update not done</span>
                </div>
            </div> : ""}

            {msgToken ? <div>
                <div className="bg-red-200 text-center  text-black py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">{msgToken}</span>
                </div>
            </div> : ""}

            {
                open ? <div id="marketing-banner" tabindex="-1" className="fixed mt-14 z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
                    <a href="https://flowbite.com/" className="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
                        <img src={logo} className="h-6 me-2" alt="Flowbite Logo" />
                        <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">we encourage you to revoke your token after your uploading is done and when you have required then regenerate it by clicking credentials</p>
                </div>
                <div className="flex items-center flex-shrink-0">
                   
                    <button onClick={closeBanner} data-dismiss-target="#marketing-banner" type="button" className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span  className="sr-only">Close banner</span>
                    </button>
                </div>
            </div> : ""
            }


            <div className='flex flex-col items-center mt-16' >

                <div >

                    <div className=' w-32 mb-6' >
                        <div>
                            <img src={avatar} className=' w-32 h-32 rounded-full  border-2  border-indigo-300 ' />
                        </div>
                        <div className='text-white text-center font-mono mt-4' >
                            {type}
                        </div>
                    </div>

                </div>

                <div><UploadWidget full_name={full_name} email={email} setAvatar={setAvatar} /></div>

                <div className='mt-6 flex flex-col p-4 ' >

                    <input type='text' className='m-3 p-3 pr-16 text-lg border-solid border-2 border-cyan-900 rounded-md hover:border-green-900 text-white bg-black font-mono' placeholder='Full Name' value={full_name} onChange={(e) => setFullName(e.target.value)} />

                    <input type='email' className='m-3 p-3  text-lg border-solid border-2 border-cyan-900 rounded-md hover:border-green-900 text-white bg-black font-mono' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <button onClick={handleSubmit} className=' m-2 p-2 border border-solid border-indigo-600 rounded-md hover: bg-indigo-600 text-black font-bold text-xl font-mono' >Update </button>

                    <button onClick={revokeTokens} className=' m-2 p-2 border border-solid border-indigo-600 rounded-md hover: bg-indigo-600 text-black font-bold text-xl font-mono' >Revoke Tokens </button>


                </div>

            </div>

        </>
    )
}

export default Profile
