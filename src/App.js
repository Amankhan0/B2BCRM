import React, { useEffect } from 'react';
import './App.css';
import Main from './Panel/panel';
import { getTrackYourTransportUser } from './Storage/Storage';
import BeforeLogin from './Panel/BeforeLogin';
import TrackMap from './Webview/TrackMap';
import logo from "./Images/logo.png";

function App() {
  var user = getTrackYourTransportUser()

  var url = window.location.pathname

  useEffect(() => {
    if (window.location.pathname === '/army/') {
      // return 
      window.history.replaceState({}, '', '/army/');
    }
  }, []);
  
  return (
    <div className="App">
      {
        url.includes('/army/track/map/share') ?
          <div className='absolute w-11/12 ml-16 mt-10'>
            <div className="flex items-center gap-x-3">
              <img src={logo} className="h-8 lg:h-10 xl:h-12" alt="logo" />
              <a href='https://tyt-new-web-admin.vercel.app/' className="text-black first-letter:md:flex tracking-wider text-lg md:text-xl xl:text-2xl">
                Track Your Transport
              </a>
            </div>
            <TrackMap />
          </div>
          :
          user ?
            <Main />
            :
            <BeforeLogin />
      }

    </div>
  );
}

export default App;
