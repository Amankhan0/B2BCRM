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
import PaginationReducer from './Store/Reducer/PaginationReducer';
import TripReducer from './Store/Reducer/TripReducer';

const rootReducer = combineReducers({
  SidebarReducer:SidebarReducer,
  ApiReducer:ApiReducer,
  PaginationReducer:PaginationReducer,
  TripReducer:TripReducer
})


const store = createStore(rootReducer, applyMiddleware(thunk))

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter basename='/army'>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
