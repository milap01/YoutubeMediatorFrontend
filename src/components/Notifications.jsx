import React, { useEffect, useMemo, useState } from 'react'
import { axiosApi } from '../api/axios';
import Cookies from 'js-cookie';

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [count, SetCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [canceled, setCanceled] = useState(false);

  function acceptRequest(email) {

     const accepted = async () => {
        try {
        const cookie = Cookies.get('access_token')
        const response = await axiosApi(`/api/accept-connection-request/${email}`, {
          headers: { Authorization: `Bearer ${cookie}` }
        });
        setAccepted(true)

      }
      catch (error) {
      if (error.response.status == 401){
        window.location.href = import.meta.env.VITE_ROOT_URL;
      } 
    }
  }
  accepted()
  }
  function cancelRequest(email) {

    const canceled = async () => {
      try {

        const cookie = Cookies.get("access_token")
        const response = await axiosApi.get(`/api/cancel-request/${email}`, {
          headers: { Authorization: `Bearer ${cookie}` }
        })
        setCanceled(true);
        
      } catch (error) {
        if (error.response.status == 401){
          window.location.href = import.meta.env.VITE_ROOT_URL;
        } 
      }
     
    }
    canceled();


  }

  useEffect(function () {
    const getNotifications = async () => {
      try {
        const cookie = Cookies.get('access_token');

        const response = await axiosApi.get('/api/notifications/', {
          headers: { Authorization: `Bearer ${cookie}` }
        });

        setNotifications(response.data)
        SetCount(response.data.length)
      }
      catch (error) {
        if (error.response.status == 401) {
          window.location.href = import.meta.env.VITE_ROOT_URL
        }
      }
    }

    getNotifications()

  }, [accepted, canceled])

  return (
    <>

      <div>
        <h1 className=' text-white text-3xl mt-28 mb-28 text-center font-mono font-bold ' >Notifications</h1>

        {
          count === 0 ? <p className='text-white text-3xl mt-28 mb-36 text-center font-mono' >
            No Messages  🙁
          </p> : ""
        }

        {
          notifications?.map((notification) => (

            <div key={notification.email} className='flex flex-col items-center mt-8' >
              <div className='flex flex-col gap-3 w-80'>
                <div className="relative border border-gray-200 rounded-lg shadow-lg">
                  <button onClick={() => cancelRequest(notification.email)}
                    className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center p-4">
                    <img
                      className="object-cover w-24 h-24 rounded-lg"
                      src={notification.avatar}
                      alt=""
                    />

                    <div className="ml-3 mt-3 overflow-hidden">
                      <p className="font-medium ml-4 text-white">{notification.full_name}</p>
                      <p className="max-w-xs  ml-4 text-sm text-gray-500 truncate">
                        {notification.email}
                      </p>
                      <button onClick={() => acceptRequest(notification.email)} className='bg-gradient-to-r ml-4 from-indigo-600 to-blue-700  p-2 m-2 rounded-md text-white'>
                        Accept
                      </button>
                    </div>
                  </div>
                </div>



              </div>
            </div>

          ))
        }

      </div>

    </>
  )
}

export default Notifications
