import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';
import Cookies from 'js-cookie';
import { axiosApi } from '../api/axios';
import { AES, enc } from 'crypto-js';


function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const [type,setType] = useState(true);

  function handleLogout(){
    const encRefreshCookie = Cookies.get('refresh_token');

    if (encRefreshCookie){
      document.cookie = "refresh_token=;expires = Thu, 01 Jan 1970 00:00:00 UTC";
      window.location.href = `${import.meta.env.VITE_ROOT_URL}user/login/`

    }

  }

  function getCredentials(){
  

      const urlString = import.meta.env.VITE_URL;
      const url = new URL(urlString);
      url.searchParams.append('scope',import.meta.env.VITE_SCOPES);
      url.searchParams.append('access_type','offline');
      url.searchParams.append('include_granted_scope',true);
      url.searchParams.append('state','state_parameter_pass_through_value');
      url.searchParams.append('redirect_uri',import.meta.env.VITE_REDIRECT_URI);
      url.searchParams.append('response_type','code');
      url.searchParams.append('client_id',import.meta.env.VITE_CLIENT_ID);

      window.location.href = url

      
   

    getData()
  }


  useEffect(() => {
        const cookie = Cookies.get('access_token');

        const userInfo = async function () {

            try {
                const response = await axiosApi.get('api/user-profile/', {
                    headers: { Authorization: `Bearer ${cookie}` }
                })
                // const id = response.data.id;
                // const encryptedId = AES.encrypt(id,import.meta.env.VITE_SECRET_PASSWORD).toString();
                // localStorage.setItem('user',encryptedId)
                const userType = response.data.type;
                localStorage.setItem('full_name',response.data.full_name);
                localStorage.setItem('email',response.data.email);
                if (userType == "CREATOR"){
                  setType(true);
                  localStorage.setItem('type','CREATOR')
                }

                if (userType == "EDITOR"){
                  setType(false);
                  localStorage.setItem('type','EDITOR');
                }

                
               
            } catch (error) {
                
            }

        }

        userInfo();
  },[])

  if (window.innerWidth < 800) {



    function breadCrumb() {
      setIsOpen(prev => !prev)
      // console.log('hii');
      // console.log(isOpen);
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
                type?<button onClick={getCredentials} type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md text-white ">
                Credentials
              </button>:<Link to='/video-upload' className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md text-white ">
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

            <Link to='/profile'  className=' ml-3 mt-4 hover:text-indigo-400 '  >Profile</Link>
            <Link to='/notifications' className='  ml-8  mt-4 hover:text-indigo-400 '  >Notifications</Link>
            <button onClick={handleLogout}  className='  ml-8  mt-4 hover:text-indigo-400 '  >Logout</button>


            <Link className=' ml-3 mt-4 hover:drop-shadow-xl shadow-indigo-300/40 '  >
              {
                type?<button onClick={getCredentials} type="button" className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md ">
                Credentials
              </button>:<Link to='/video-upload' className="bg-gradient-to-r from-indigo-600 to-blue-700  p-3 m-2 rounded-md ">
                Upload Video
              </Link>
              }

            </Link>

            


          </div>

        </nav>

      </>
    )
  }

}

export default Header
