import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessToken, loadingAtom, loginAtom } from '../store/atoms/auth';
import logo from '../assets/logo.png';
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom'



function Home() {

  const navigateTo = useNavigate()

  const isLoggedIn = useRecoilValue(loginAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [users, setUsers] = useState([]);
  const [send, setSend] = useState(false);
  const [type, setType] = useState('');
  const [accessTokenValue, setAccessTokenValue] = useRecoilState(accessToken);
  const [currPage, setCurrPage] = useState(1);
  const [nextPage, setNextPage] = useState(2);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(function () {
  //   if (!accessTokenValue) {
  //     setAccessTokenValue(false);
  //   }
  // }, [accessTokenValue]);

  function increaseByValue(number){
    const count = Number(number);

    const possiblePages =  Math.ceil(totalPages / 6);
  
    if(count > possiblePages){
      return;
    }

    setCurrPage(count);
    setNextPage(currPage + 1);


  }

  function increase() {

    if (nextPage == null){
      return;
    }

    setCurrPage((prev) => prev + 1);
    setNextPage(currPage + 1);
  }

  function decrease(){
    if (previousPage == null){
      return;
    }
    setCurrPage((prev) => prev - 1);
    setPreviousPage((currPage - 1));
  }


  function handelFriendRequest(email) {

    if (send) {
      async function cancelFriendRequest(email) {

        try {

          const cookie = Cookies.get('access_token');

          const response = await axiosApi.get(`/api/cancel-request/${email}`, {
            headers: { 'Authorization': `Bearer ${cookie}` }
          })
          setSend(false)
          document.getElementById(email).innerText = "Add Friend"
          
        } catch (error) {
          if (error.response.status == 401){
            window.location.href = import.meta.env.VITE_ROOT_URL;
          }
        }
      
      }
      cancelFriendRequest(email);
    } else {
      async function sendFriendRequest(email) {

        try {

          const cookie = Cookies.get('access_token');

          const response = await axiosApi.get(`/api/send-connection-request/${email}`, {
            headers: { 'Authorization': `Bearer ${cookie}` }
          })
          setSend(true)
          document.getElementById(email).innerText = 'Cancel Request'
            
        } catch (error) {
          if (error.response.status == 401){
            window.location.href = import.meta.env.VITE_ROOT_URL;
          }
        }
      }
      sendFriendRequest(email)
    }

  }


  useEffect(function () {

    setLoading(true);

    if (!accessTokenValue) {

      const encRefreshCookie = Cookies.get('refresh_token');

      if (encRefreshCookie) {
        try {

          const bytes = AES.decrypt(encRefreshCookie,import.meta.env.VITE_SECRET_PASSWORD)
          const cookie = bytes.toString(enc.Utf8);
          const getRefresh = async () => {

            const response = await axiosApi.post('/api/token/refresh/', {
              "refresh": cookie,
            }
            )

            Cookies.set('access_token', response.data.access, { expires: 1 });

            setLoading(false)

            window.location.href = import.meta.env.VITE_ROOT_URL
          }

          getRefresh()

        } catch (error) {
          setLoading(false);
        }
      } else {
        navigateTo('/user/login')
      }


    } else {


      const users = async () => {


        try {

          const cookie = Cookies.get('access_token');

          const res = await axiosApi.get(`/api/index/?page=${currPage}`, {
            headers: { 'Authorization': `Bearer ${cookie}` }
          })

          setUsers(res.data.results)
          setTotalPages(res.data.count)
          setNextPage(res.data.next);
          setPreviousPage(res.data.previous)

          const userType = localStorage.getItem('type');

          if (userType) {
            setType(userType);
          }
          setLoading(false)
        } catch (error) {

          if (error.response.status == 401){
            window.location.href = import.meta.env.VITE_ROOT_URL;
          }
          setLoading(false)
        }

      }

      users()
      setLoading(false)
    }


  }, [currPage,nextPage,previousPage,accessTokenValue,isLoggedIn])

  if (!accessTokenValue) {

    return (

      <>
        <div className="text-center m-28">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">Oops! Something went wrong.</h1>
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




  useEffect(function () {
    if (!isLoggedIn) {
      navigateTo('/user/login')
    }
  }, [isLoggedIn])




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



  if (isLoggedIn) {

    if (window.innerWidth < 1000 && window.innerWidth > 600) {
      return (
        <>

          <div className='flex text-wrap  text-white' >


            <p className=' text-3xl font-mono m-16 ml-12  mt-44 bg-gradient-to-b from-slate-500 to-indigo-600 bg-clip-text text-transparent  font-bold' >
              Collaborate & Uploads Securely

            </p>

            <p className='  text-sm font-mono  m-16 ml-10 mr-10  mt-44  flex flex-col text-slate-400   ' >
              Our Website provides a secure environment for Youtube Creators and Editors to collaborate effectively without compromising channel access.


              <button type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white  p-3 mt-6 rounded-md  w-32  ">
                Subscribe
              </button>

            </p>

          </div>

          <div>
            <div><h1 className='text-white font-mono text-4xl text-center m-16' >{type == "CREATOR" ? "EDITORS" : "CREATORS"}</h1></div>
          </div>

          {
            users == "" ? <h1 className='text-white font-mono text-2xl text-center m-16' >No Users </h1> : ""
          }

          <div className='flex flex-col' >

          <div className='m-16 flex flex-wrap justify-center items-center ' >
            {
              users?.map((user) => (
                <div key={user.email} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4  ">
                  <div className="flex justify-end px-4 pt-4">
                    <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">

                    </button>


                  </div>

                  <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.avatar ? user.avatar : logo} alt="Bonnie image" />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white font-mono">{user.full_name}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{user.type}</span>
                    <div className="flex mt-4 md:mt-6">
                      {
                        <button id={user.email} onClick={(e) => handelFriendRequest(user.email)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 font-mono">Add Friend</button>
                      }

                    </div>
                  </div>

                </div>
              ))
            }


          </div>


          <nav aria-label="Page navigation example " className='text-center'>
            <ul className="inline-flex -space-x-px text-base h-10">
              {
                previousPage == null?<li>
                <button disabled onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>:<li>
                <button onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>
              }


              <li>
                <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage}</button>
              </li>

             {
              nextPage != null?  <li>
              <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage + 1}   className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 1}</button>
            </li>:""
             }


              {
                nextPage != null? <li>
                <button value={currPage + 2} onClick={(e) => increaseByValue(e.target.value)}  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 2}</button>
              </li>:""
              }

              {
                nextPage == null?<li>
                <button disabled onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>:<li>
                <button onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>
              }
              
            </ul>
          </nav>


          </div>

        </>
      )
    }

    if (window.innerWidth < 600) {

      return (
        <>


          <div className='flex flex-col text-wrap  text-white' >


            <p className=' text-xl font-mono m-16 ml-8 mb-2  mt-14 bg-gradient-to-b from-slate-500 to-indigo-600 bg-clip-text text-transparent text-center  font-bold' >
              Collaborate & Uploads Securely

            </p>

            <p className='  text-sm font-mono   m-16 ml-10 mr-10 mt-4 mb-2 text-center  flex flex-col text-slate-400  items-center  ' >
              Our Website provides a secure environment for Youtube Creators and Editors to collaborate effectively without compromising channel access.


              <button type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white  p-3 mt-6 rounded-md  w-32  ">
                Subscribe
              </button>

            </p>

          </div>

          <div>
            <div><h1 className='text-white font-mono text-3xl text-center m-16' >{type == "CREATOR" ? "EDITORS" : "CREATORS"}</h1></div>
          </div>


          {
            users == "" ? <h1 className='text-white font-mono text-xl text-center m-16' >No Users </h1> : ""
          }

          <div className='flex flex-col' >

          <div className='m-4 flex flex-wrap justify-between items-center ' >
            {
              users?.map((user) => (
                <div key={user.email} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2 ml-6 ">
                  <div className="flex justify-end px-4 pt-4">
                    <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">

                    </button>


                  </div>

                  <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.avatar ? user.avatar : logo} alt="Bonnie image" />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white font-mono">{user.full_name}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{user.type}</span>
                    <div className="flex mt-4 md:mt-6">
                      {
                        <button id={user.email} onClick={(e) => handelFriendRequest(user.email)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 font-mono ">Add Friend</button>
                      }

                    </div>
                  </div>

                </div>
              ))
            }


          </div>

          <nav aria-label="Page navigation example " className='text-center'>
            <ul className="inline-flex -space-x-px text-base h-10">
              {
                previousPage == null?<li>
                <button disabled onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>:<li>
                <button onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>
              }


              <li>
                <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage}</button>
              </li>

             {
              nextPage != null?  <li>
              <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage + 1}   className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 1}</button>
            </li>:""
             }


              {
                nextPage != null? <li>
                <button value={currPage + 2} onClick={(e) => increaseByValue(e.target.value)}  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 2}</button>
              </li>:""
              }

              {
                nextPage == null?<li>
                <button disabled onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>:<li>
                <button onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>
              }
              
            </ul>
          </nav>
          </div>

        </>
      )

    }

    return (
      <>



        <div className='flex text-wrap  text-white' >


          <p className=' text-7xl font-mono m-16 mt-40 bg-gradient-to-b from-slate-500 to-indigo-600 bg-clip-text text-transparent  font-bold' >
            Collaborate & Uploads Securely

          </p>

          <p className=' text-2xl font-mono  m-16  mt-44  flex flex-col text-slate-400   ' >
            Our Website provides a secure environment for Youtube Creators and Editors to collaborate effectively without compromising channel access.


            <button type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white  p-3 mt-6 rounded-md  w-48  ">
              Subscribe
            </button>

          </p>

        </div>

        <div>

        </div>

        <div><h1 className='text-white font-mono text-6xl text-center m-16' >{type == "CREATOR" ? "EDITORS" : "CREATORS"}</h1></div>

     <div className='flex flex-col' >
        <div className='m-4 flex flex-wrap justify-center items-center ' >

          {
            users == "" ? <h1 className='text-white font-mono text-3xl text-center m-16' >No Users </h1> : ""
          }

          {
            users?.map((user) => (
              <div key={user.email} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4  ">
                <div className="flex justify-end px-4 pt-4">
                  <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">

                  </button>


                </div>

                <div className="flex flex-col items-center pb-10">
                  <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.avatar ? user.avatar : logo} alt="Bonnie image" />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white font-mono">{user.full_name}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono ">{user.type}</span>
                  <div className="flex mt-4 md:mt-6">
                    {
                      <button id={user.email} onClick={(e) => handelFriendRequest(user.email)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 font-mono ">Add Friend</button>
                    }

                  </div>
                </div>

              </div>
            ))
          }
            </div>


          <nav aria-label="Page navigation example " className='text-center'>
            <ul className="inline-flex -space-x-px text-base h-10">
              {
                previousPage == null?<li>
                <button disabled onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>:<li>
                <button onClick={decrease} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
              </li>
              }


              <li>
                <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage}</button>
              </li>

             {
              nextPage != null?  <li>
              <button onClick={(e) => setCurrPage(Number(e.target.value))} value={currPage + 1}   className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 1}</button>
            </li>:""
             }


              {
                nextPage != null? <li>
                <button value={currPage + 2} onClick={(e) => increaseByValue(e.target.value)}  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currPage + 2}</button>
              </li>:""
              }

              {
                nextPage == null?<li>
                <button disabled onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>:<li>
                <button onClick={increase} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
              </li>
              }
              
            </ul>
          </nav>
          </div>
        

        
    

      </>
    )
  }

}

export default Home
