import React from 'react';
import './App.css';
import Main from './Panel/panel';
import { getTrackYourTransportUser } from './Storage/Storage';
import BeforeLogin from './Panel/BeforeLogin';

function App() {
  var user = getTrackYourTransportUser()

  console.log("user", user);

  return (
    <div className="App">
      {user ? <Main /> : <BeforeLogin/>}
    </div>
  );
}

export default App;
