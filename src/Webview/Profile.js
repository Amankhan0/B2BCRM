// import React, { useEffect, useState } from 'react'
// import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage';
// import MyButton from '../Component/MyButton';

// function Profile() {

//   var user = getAuthenticatedUserWithRoles()?.userData

//   const logout = () => {
//     var confirmMation = window.confirm('Are you sure to logout')
//     if (confirmMation) {
//       logOutAuthenticatedUser()
//       window.location.reload()
//     }
//   }

//   return (
//     <div className='card mt-10 p-2'>
//       <p className='p-1'>Name : {user?.firstName + ' ' + user?.lastName}</p>
//       <p className='p-1'>Contact : {user?.contact}</p>
//       <p className='p-1'>Email : {user?.email}</p>
//       <p className='p-1'>Full Address : {user?.country} {user?.state} {user?.city} {user?.pinCode} {user?.landmark}</p>
//       <div className='mt-5'>
//         <MyButton onClick={() => logout()} title={'Logout'} />
//       </div>
//     </div>
//   )
// }

// export default Profile;


import React from 'react'
import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage'
import MyInput from '../Component/MyInput';
import { useSelector } from 'react-redux';
import MyButton from '../Component/MyButton';

function Profile() {
  var user = getAuthenticatedUserWithRoles()?.userData
  const ApiReducer = useSelector(state => state.ApiReducer);
  const logout = () => {
    var confirmMation = window.confirm('Are you sure to logout')
    if (confirmMation) {
      logOutAuthenticatedUser()
      window.location.reload()
    }
  }


  console.log("user", user);
  return (
    <div className='grid grid-cols-3 gap-5 mt-10'>
      <MyInput name={'address'} title={'Address'} placeholder={'Enter address'} disable={true} value={user?.address} />
      <MyInput name={'contact'} title={'Contact'} placeholder={'Enter contact'} disable={true} value={user?.contact} />
      <MyInput name={'email'} title={'Email'} placeholder={'Enter email'} disable={true} value={user?.email} />
      <MyInput name={'firstName'} title={'First Name'} placeholder={'Enter First Name'} disable={true} value={user?.firstName} />
      <MyInput name={'lastName'} title={'Last Name'} placeholder={'Enter Last Name'} disable={true} value={user?.lastName} />
      <MyInput name={'pinCode'} title={'Pin code'} placeholder={'Enter Pincode'} disable={true} value={user?.pinCode} />

      <div className='mt-5'>
        <MyButton onClick={() => logout()} title={'Logout'} />
      </div>
    </div>
  )
}

export default Profile
