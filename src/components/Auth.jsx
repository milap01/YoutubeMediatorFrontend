import React from 'react'
import { Outlet } from 'react-router-dom'

function Auth() {
  return (
    <div id='auth' >
      <Outlet />
    </div>
  )
}

export default Auth
