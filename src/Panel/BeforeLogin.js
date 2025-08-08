import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Account/Login/Login'
import Signup from '../Account/Signup/Signup'

function BeforeLogin() {
  return (
    <>
    <Routes>
    <Route path="/" exact element={<Login />} />
    <Route path="/signup" exact element={<Signup />} />
    </Routes>
    </>
  )
}

export default BeforeLogin
