import React from 'react'
import { useSetRecoilState } from 'recoil'
import { accessToken } from '../store/atoms/auth'





function Error() {

  const setToken = useSetRecoilState(accessToken);

  function goToHomePage(){
    setToken(true);
    window.location.href = import.meta.env.VITE_ROOT_URL
  }

  return (
    <div>
       <div className="text-center m-28">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">404 Page Not Found</h1>
          <p className="mb-4 text-lg text-gray-700"></p>
          <div className="animate-bounce">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-700">Let's get you back <a href="/" className="text-indigo-700">home</a>.</p>
        </div>
      </div>
  )
}

export default Error
