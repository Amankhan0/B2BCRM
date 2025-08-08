// // import React, { useEffect, useState } from 'react'
// // import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage';
// // import MyButton from '../Component/MyButton';

// // function Profile() {

// //   var user = getAuthenticatedUserWithRoles()?.userData

// //   const logout = () => {
// //     var confirmMation = window.confirm('Are you sure to logout')
// //     if (confirmMation) {
// //       logOutAuthenticatedUser()
// //       window.location.reload()
// //     }
// //   }

// //   return (
// //     <div className='card mt-10 p-2'>
// //       <p className='p-1'>Name : {user?.firstName + ' ' + user?.lastName}</p>
// //       <p className='p-1'>Contact : {user?.contact}</p>
// //       <p className='p-1'>Email : {user?.email}</p>
// //       <p className='p-1'>Full Address : {user?.country} {user?.state} {user?.city} {user?.pinCode} {user?.landmark}</p>
// //       <div className='mt-5'>
// //         <MyButton onClick={() => logout()} title={'Logout'} />
// //       </div>
// //     </div>
// //   )
// // }

// // export default Profile;




// // xbfdg

// import React from 'react'
// import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage'
// import MyInput from '../Component/MyInput';
// import { useSelector } from 'react-redux';
// import MyButton from '../Component/MyButton';

// function Profile() {
//   var user = getAuthenticatedUserWithRoles()?.userData
//   const ApiReducer = useSelector(state => state.ApiReducer);
//   const logout = () => {
//     var confirmMation = window.confirm('Are you sure to logout')
//     if (confirmMation) {
//       logOutAuthenticatedUser()
//       window.location.reload()
//     }
//   }


//   console.log("user", user);
//   return (
//     <div className='grid grid-cols-3 gap-5 mt-10'>
//       <MyInput name={'address'} title={'Address'} placeholder={'Enter address'} disable={true} value={user?.address} />
//       <MyInput name={'contact'} title={'Contact'} placeholder={'Enter contact'} disable={true} value={user?.contact} />
//       <MyInput name={'email'} title={'Email'} placeholder={'Enter email'} disable={true} value={user?.email} />
//       <MyInput name={'firstName'} title={'First Name'} placeholder={'Enter First Name'} disable={true} value={user?.firstName} />
//       <MyInput name={'lastName'} title={'Last Name'} placeholder={'Enter Last Name'} disable={true} value={user?.lastName} />
//       <MyInput name={'pinCode'} title={'Pin code'} placeholder={'Enter Pincode'} disable={true} value={user?.pinCode} />

//       <div className='mt-5'>
//         <MyButton onClick={() => logout()} title={'Logout'} />
//       </div>
//     </div>
//   )
// }

// export default Profile



import React from 'react';
import { getAuthenticatedUserWithRoles, logOutAuthenticatedUser } from '../Storage/Storage';
import MyButton from '../Component/MyButton';

function Profile() {
  const user = getAuthenticatedUserWithRoles()?.userData;

  // Get first letter of user's first name or use 'U' as fallback
  const firstLetter = user?.firstName ? user.firstName.charAt(0) : 'U';

  const logout = () => {
    const confirmation = window.confirm('Are you sure you want to logout?');
    if (confirmation) {
      logOutAuthenticatedUser();
      window.location.reload();
    }
  };

  return (
    <div className="popper-box w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700 absolute right-5 top-14 z-50 shadow">
      <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
        <div className="avatar size-14 flex items-center justify-center bg-primary text-white rounded-full font-bold text-xl">
          {firstLetter}
        </div>
        <div>
          <a
            href="#"
            className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
          >
            {user?.firstName} {user?.lastName}
          </a>
          <p className="text-xs text-slate-400 dark:text-navy-300">
            {user?.roleName || "User"}
          </p>
        </div>
      </div>
      <div className="flex flex-col pt-2 pb-5">
        <a
          href="#"
          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
              Contact
            </h2>
            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
              {user?.contact || "Not available"}
            </div>
          </div>
        </a>
        <a
          href="#"
          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-info text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
              Email
            </h2>
            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
              {user?.email || "Not available"}
            </div>
          </div>
        </a>
        <a
          href="#"
          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
              Address
            </h2>
            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
              {user?.address ? `${user.address}, ${user?.landmark || ''}` : "Not available"}
            </div>
          </div>
        </a>
        <a
          href="#"
          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-error text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
              Location
            </h2>
            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
              {user?.city ? `${user.city}, ${user?.state || ''}, ${user?.country || ''} - ${user?.pinCode || ''}` : "Not available"}
            </div>
          </div>
        </a>
        <div className="mt-3 px-4">
          <button 
            onClick={logout}
            className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
