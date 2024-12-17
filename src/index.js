import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import { Toaster } from 'react-hot-toast';
import SidebarReducer from './Store/Reducer/SidebarReducer';
import ApiReducer from './Store/Reducer/ApiReducer';

const rootReducer = combineReducers({
  SidebarReducer:SidebarReducer,
  ApiReducer:ApiReducer
})


const store = createStore(rootReducer, applyMiddleware(thunk))

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
