import React, { useEffect, useState } from 'react'
import { axiosApi } from "../api/axios";
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil'
import { loadingAtom } from '../store/atoms/auth'
import { AES, enc } from 'crypto-js';
import { Link } from 'react-router-dom'

function VideoUpload() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useState(false);
  const [creators, setCreators] = useState([]);
  const [creator,setCreator] = useState('')

  useEffect(() => {

    try {
      const getCreators = async () => {

        const cookie = Cookies.get('access_token')
  
        const response = await axiosApi.get('api/get-creators/', {
          headers: { 'Authorization': `Bearer ${cookie}` }
        })
  
        // console.log(response.data);
  
        setCreators(response.data)
  
  
      }
      getCreators()
      
    } catch (error) {
    }

  }, [])


  function submitData(e) {
    e.preventDefault();
    setLoading(true)
    const status = e.target.status.value;

    const formData = new FormData();
    const id = localStorage.getItem('user')

    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }
    // const bytes = AES.decrypt(id, import.meta.env.VITE_SECRET_PASSWORD);
    // const decryptedId = bytes.toString(enc.Utf8);

    // console.log(creator);

    // console.log(selectedFile);
    formData.append('user', creator)
    formData.append('video_file', selectedFile);
    formData.append('fileName', selectedFile.name);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('privacy_status', status);

    const cookie = Cookies.get('access_token');

    try {
      const getData = async () => {
        const response = await axiosApi.post('api/video-upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookie} ` }
        })

        console.log(response.data);
        setLoading(false)

      }

      getData()
    } catch (error) {
      console.log(error);
      setLoading(false)
    }


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

  if (error) {
    return (

      <>
        <div className="text-center m-28">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">Oops! Something went wrong. If Problem Persists then please do the hard reload.</h1>
          <p className="mb-4 text-lg text-gray-700"></p>
          <div className="animate-bounce">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-700">Let's get you back <a href="/" className="text-indigo-700">home</a>.</p>
        </div>
      </>
    )
  }

  return (
    <>

      <form onSubmit={submitData} className='flex flex-col items-center mt-28 mb-28 w-full '>

        <div>
          <label htmlFor="creators" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select User</label>
          <select onChange={(e) => setCreator(e.target.value) } id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
          <option value="null">Choose a Creator</option>
          {
            creators?.map((creator) => (
              <option value={creator.id}>{creator.full_name}</option>
            ))
          }
          </select>
        </div>

        <div>
          <label htmlFor="small-input" className="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="small-input" className="block w-96 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  " />
        </div>


        <div>
          <label htmlFor="message" className="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="message" rows="4" className="block p-2.5 w-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Video Description"></textarea>
        </div>


        <div>
          <label htmlFor="message" className="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
          <textarea value={tags} onChange={(e) => setTags(e.target.value)} id="message" rows="4" className="block p-2.5 w-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Video Tags"></textarea>
        </div>

        <div>
          <label htmlFor="status" className="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Privacy Status</label>
          <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="public">public</option>
            <option value="private">private</option>
            <option value="unlisted">unlisted</option>
          </select>
        </div>

        <div>

          <label className="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
          <input onChange={(e) => setSelectedFile(e.target.files[0])} className="block w-96 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />

        </div>

        <div>
          <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 w-96 text-center me-2 mb-2 mt-6">Submit</button>
        </div>


      </form>

    </>
  )
}

export default VideoUpload
