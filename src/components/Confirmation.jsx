import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { axiosApi } from '../api/axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loginAtom, loadingAtom, } from '../store/atoms/auth';

function Confirmation() {

    const [video, setVideo] = useState([]);
    const isLoggedIn = useRecoilValue(loginAtom);
    const [loading, setLoading] = useRecoilState(loadingAtom);
    const [url,setUrl] = useState('')
    useEffect(() => {
        const cookie = Cookies.get('access_token');

        if (cookie) {
            try {

                const getData = async () => {

                    const response = await axiosApi(`/api/video-details/`, {
                        headers: { Authorization: `Bearer ${cookie}` }
                    })
                    setVideo(response.data)
                    const url = response.data.cloudinary_id;
                    setUrl(url)
                }

                getData()

            } catch (error) {

            }
        }
    }, [])

    function acceptRequest() {
        try {

            const uploadVideo = async () => {

                setLoading(true)

                const cookie = Cookies.get('access_token');
                const response = await axiosApi.get('/api/youtube-upload-2/', {
                    headers: { Authorization: `Bearer ${cookie}` }
                })
                setLoading(false)
                window.location.href = import.meta.env.VITE_ROOT_URL;
            }

            uploadVideo()
        } catch (error) {
        }
    }

    function cancelRequest() {

        try {

            const cancelUpload = async () => {
                setLoading(true)
                const cookie = Cookies.get('access_token');
                const response = await axiosApi.get('/api/cancel-upload/', {
                    headers: { Authorization: `Bearer ${cookie}` }
                })
                setLoading(false)
                window.location.href = import.meta.env.VITE_ROOT_URL;
            }
            cancelUpload()
        } catch (error) {
            setLoading(false);
        }
    }


    if (!isLoggedIn) {
        localStorage.setItem('path', window.location.href);
        window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/login/`
    }



    if (loading) {
        return (
            <>
                <div className="min-h-[43rem] flex flex-col bg-white border shadow-sm  dark:bg-black dark:border-gray-700 dark:shadow-slate-700/[.7]  ">
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
        <div className='flex flex-col items-center m-12 mt-16 text-white font-mono'>

            <h1 className='text-3xl  font-bold ' >{video?.title}</h1>

            <video key={url} className="h-96 mt-8 rounded-lg" controls>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>


            <p className='mt-8 text-wrap'>
                <span> {video?.description}</span>
            </p>

            <p className='mt-8 '>

                <button type="button" onClick={acceptRequest} className="bg-gradient-to-r from-green-600 to-green-700  p-3 m-2 rounded-md text-white ">
                    Accept
                </button>

                <button type="button" onClick={cancelRequest} className="bg-gradient-to-r from-red-600 to-red-700  p-3 m-2 rounded-md text-white ">
                    Cancel
                </button>

            </p>

        </div>
    )
}

export default Confirmation
