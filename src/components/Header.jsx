import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';
import Cookies from 'js-cookie';
import { axiosApi } from '../api/axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessToken, loadingAtom, loginAtom } from '../store/atoms/auth';
import { AES } from 'crypto-js';
import { useNavigate } from 'react-router-dom'

function Header() {

  const navigateTo = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('');
  const isLoggedIn = useRecoilValue(loginAtom);
  const [accessTokenValue, setAccessToken] = useRecoilState(accessToken);
  const [loading, setLoading] = useRecoilState(loadingAtom);

  useEffect(function () {
    if (!isLoggedIn) {
      navigateTo('/user/login')
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!accessTokenValue) {
      const refresh_cookie = Cookies.get('refresh_token');

      if (refresh_cookie) {

        try {

          const bytes = AES.decrypt(refresh_cookie, import.meta.env.VITE_SECRET_PASSWORD);

          const cookie = bytes.toString(enc.Utf8);

          const getRefresh = async () => {

            const response = await axiosApi.post('/api/token/refresh/', {
              "refresh": cookie,
            }
            )

            Cookies.set('access_token', response.data.access, { expires: 1 });

            setAccessToken(true)

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



    }
  }, [accessTokenValue])


  if (!isLoggedIn) {
    window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/login/`
  }

  function handleLogout() {
    const encRefreshCookie = Cookies.get('refresh_token');

    if (encRefreshCookie) {
      document.cookie = "refresh_token=;expires = Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
      localStorage.setItem('path', window.location.href);
      window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/login/`;
    }

  }

  function getCredentials() {
    const user = localStorage.getItem('email')
    if (user) {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/authorize/${user}`;

    }
    return;
  }


  useEffect(() => {

    const userInfo = async function () {

      try {
        const cookie = Cookies.get('access_token');
        const response = await axiosApi.get('/api/user-profile/', {
          headers: { Authorization: `Bearer ${cookie}` }
        })

        const userType = response.data.type;
        localStorage.setItem('full_name', response.data.full_name);
        localStorage.setItem('email', response.data.email);
        if (userType == "CREATOR") {
          setType('CREATOR');
          localStorage.setItem('type', 'CREATOR')
        }

        if (userType == "EDITOR") {
          setType('EDITOR');
          localStorage.setItem('type', 'EDITOR');
        }

      } catch (error) {
        if (error.response.status == 401) {
          // window.location.href = import.meta.env.VITE_ROOT_URL;
        }
      }

    }

    userInfo();
  }, [])

  if (window.innerWidth < 800) {



    function breadCrumb() {
      setIsOpen(prev => !prev)
    }

    if (isOpen) {

      return (<>


        <div className=' w-200  h-72  bg-black  flex flex-col justify-center items-center  font-mono ' >

          <button className="bg-transparent hover:bg-indigo-600 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded " onClick={breadCrumb} >
            Close
          </button>

          <Link to='/profile' className=' m-4  mt-6 hover:text-indigo-400 text-white '  >Profile</Link>

          <Link to='/notifications' className=' m-4 ml-5  mt-2 hover:text-indigo-400 text-white '  >Notifications</Link>

          <button onClick={handleLogout} className=' m-4 ml-5  mt-2 hover:text-indigo-400 text-white '  >Logout</button>


          <Link className=' ml-2 mt-1 hover:drop-shadow-xl shadow-indigo-300/40 '  >
            {
              type ? <button onClick={getCredentials} type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md text-white ">
                Credentials
              </button> : <Link to='/video-upload' className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md text-white ">
                Upload Video
              </Link>
            }

          </Link>

        </div>

      </>)

    }



    return (
      <>

        <nav className='bg-slate-700 sticky z-10 top-0 bg-opacity-30 backdrop-filter backdrop-blur-xl  p-4 border-b border-gray-200 flex justify-between font-mono ' >

          <div>
            <Link to='/' >
              <img src={logo} width='100 px' className=' rounded-md mt-6 ml-4 ' />
            </Link>
          </div>

          <div className=' text-white text-sm  m-2 mt-4 ' >

            <button className="bg-transparent hover:bg-indigo-600 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded font-mono" onClick={breadCrumb} >
              Expand
            </button>

          </div>

        </nav>

      </>
    )

  }
  else {
    return (
      <>

        <nav className='bg-slate-700 sticky z-10 top-0 bg-opacity-30 backdrop-filter backdrop-blur-xl  p-4 border-b border-gray-200 flex justify-between font-mono ' >

          <div>
            <Link to='/' >
              <img src={logo} width='150 px' className=' rounded-md mt-4 ml-4 ' />
            </Link>
          </div>

          <div className=' text-white text-lg  m-2 ' >

            <Link to='/profile' className=' ml-3 mt-4 hover:text-indigo-400 '  >Profile</Link>
            <Link to='/notifications' className='  ml-8  mt-4 hover:text-indigo-400 '  >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="text-gray-600 w-6 h-6"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
                />
              </svg>

            </Link>
            <button onClick={handleLogout} className='  ml-8  mt-4 hover:text-indigo-400 '  >Logout</button>


            <Link className=' ml-3 mt-4 hover:drop-shadow-xl shadow-indigo-300/40 '  >
              {
                type == "CREATOR" ? <button onClick={getCredentials} type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md ">
                  Credentials
                </button> : ""
              }

              {
                type == "EDITOR" ? <Link to='/video-upload' className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md ">
                  Upload Video
                </Link> : ""
              }

            </Link>




          </div>

        </nav>

      </>
    )
  }

}

export default Header
