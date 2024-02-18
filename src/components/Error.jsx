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
      <h1 className='text-white text-4xl text-center' >Error</h1>
     <button onClick={goToHomePage} className='text-white' >Go to home page</button>
      </div>
  )
}

export default Error
