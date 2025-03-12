import React from 'react';
import './App.css';
import Panel from './Panel/panel';
import Login from './Webview/Account/Login';
import { getAuthenticatedUserWithRoles } from './Storage/Storage';

function App() {

  let user = getAuthenticatedUserWithRoles();

  return (
    !user ?
      <Login />
      :
      <Panel />
  );
}

export default App;
