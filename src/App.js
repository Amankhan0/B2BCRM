import React, { useEffect } from 'react';
import './App.css';
import Panel from './Panel/panel';
import Login from './Webview/Account/Login';
import { getAuthenticatedUserWithRoles } from './Storage/Storage';
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from 'react-redux';
import { ApiHit } from './utils';
import { searchFile } from './Constants/Constants';
import { setDataAction } from './Store/Action/SetDataAction';
import { SET_PDF_ADS } from './Store/ActionName/ActionName';

function App() {

  const PDFAdsReducer = useSelector(state => state.PDFAdsReducer);

  const dispatch = useDispatch()

  let user = getAuthenticatedUserWithRoles();

  useEffect(() => {
    if (PDFAdsReducer?.doc === null) {
      fetchPdfAdsData()
    }
  }, [])

  const fetchPdfAdsData = () => {
    var json = {
      page: 1,
      limit: 10,
      search: {
        active: true,
        ads: true
      }
    }
    ApiHit(json, searchFile).then(res => {
      if (res?.content) {
        dispatch(setDataAction(res?.content,SET_PDF_ADS))
      }
    })
  }

  return (
    !user ?
      <Login />
      :
      <Panel />
  );
}

export default App;
