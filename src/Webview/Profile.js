import React, { useEffect, useState } from 'react'
import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage';
import MyButton from '../Component/MyButton';

function Profile() {

  var user = getAuthenticatedUserWithRoles()?.userData
  
  const logout = () => {
    var confirmMation = window.confirm('Are you sure to logout')
    if (confirmMation) {
      logOutAuthenticatedUser()
      window.location.reload()
    }
  }

  return (
    <div className='card mt-10 p-2'>
      <p className='p-1'>Name : {user?.firstName + ' ' + user?.lastName}</p>
      <p className='p-1'>Contact : {user?.contact}</p>
      <p className='p-1'>Email : {user?.email}</p>
      <p className='p-1'>Full Address : {user?.country} {user?.state} {user?.city} {user?.pinCode} {user?.landmark}</p>
      <div className='mt-5'>
        <MyButton onClick={() => logout()} title={'Logout'} />
      </div>
    </div>
  )
}

export default Profile;