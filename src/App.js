import React, { useEffect } from 'react';
import './App.css';
import Main from './Panel/panel';
import { getTrackYourTransportUser } from './Storage/Storage';
import BeforeLogin from './Panel/BeforeLogin';

function App() {
  var user = getTrackYourTransportUser()

  console.log("user", user, window.location.pathname);

  useEffect(() => {
    if (window.location.pathname === '/army') {
      console.log("hhelloo")
      // return 
      window.history.replaceState({}, '', '/army/');
    }
  }, []);

  return (
    <div className="App">
      {user ? <Main /> : <BeforeLogin />}
    </div>
  );
}

export default App;
