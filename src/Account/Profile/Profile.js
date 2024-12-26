import React, { useState } from 'react'
import { getTrackYourTransportUser } from '../../Storage/Storage'
import ChagePassTab from './ChagePassTab';
import { groupIcon, messageIcon, simIcon, userIcon } from '../../Icons/Icon';
import ChangePasswordProfile from './ChangePasswordProfile';
import { Colors } from '../../Colors/color';

function Profile() {
  const [activeTab, setActiveTab] = useState('account')
  const user = getTrackYourTransportUser()
  const handleLogout = () => {
    localStorage.removeItem('armyUser');
    window.location.href = '/';
    window.location.reload()
  }
  const getInitials = (name) => {
    if (!name) return ''; 
    const words = name.split(' ');
    if (words.length === 1) return words[0][0].toUpperCase(); 
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };
  const initials = getInitials(user?.username);

  return (
    <div className='flex items-center justify-end'>
      <div style={{ position: 'absolute', zIndex: 900, right: 20, top: 50 }}>
        <div className="popper-box w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
          <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
            <div>
              <div className='w-10 h-10 bg-gray-200 font-medium flex items-center justify-center text-base rounded-full'>{initials}</div>
            </div>
            <div>
              <div className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light">
                {user?.username}
              </div>

            </div>
          </div>
          <div ><ChagePassTab activeTab={activeTab} setActiveTab={setActiveTab}/></div>
          {activeTab === "account" ? 
           <div className="flex flex-col pt-2 pb-5">
          <div

            className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
              {userIcon}
            </div>
            <div>
              <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                Name
              </h2>
              <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                {user?.username}
              </div>
            </div>
          </div>
          <div

            className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-info text-white">
              {messageIcon}
            </div>
            <div>
              <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                Email
              </h2>
              <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                {user.email}
              </div>
            </div>
          </div>
          <div

            className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-white">
              {groupIcon}
            </div>
            <div>
              <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                Location
              </h2>
              <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                {user.operationalLocation}
              </div>
            </div>
          </div>
          <div

            className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-error text-white">
              {simIcon}
            </div>
            <div>
              <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                Contact
              </h2>
              <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                {user.contact}
              </div>
            </div>
          </div>
          <div className="mt-3 px-4">
            <button style={{background:Colors.ThemeBlue}} className="btn h-9 w-full space-x-2 text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={handleLogout}>
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
        : <div>
          <ChangePasswordProfile/>
        </div>
          }
        
        </div>
      </div>
    </div>
  )
}

export default Profile