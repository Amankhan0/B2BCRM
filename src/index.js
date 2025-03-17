import React, { useEffect } from 'react';
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
import QuotationReducer from './Store/Reducer/QuotationReducer';
import LeadReducer from './Store/Reducer/LeadReducer';
import OrderReducer from './Store/Reducer/OrderReducer';
import CustomerReducer from './Store/Reducer/CustomerReducer'
import SupplierReducer from './Store/Reducer/SupplierReducer';

const rootReducer = combineReducers({
  SidebarReducer: SidebarReducer,
  ApiReducer: ApiReducer,
  PaginationReducer: PaginationReducer,
  QuotationReducer:QuotationReducer,
  LeadReducer:LeadReducer,
  OrderReducer:OrderReducer,
  CustomerReducer:CustomerReducer,
  SupplierReducer:SupplierReducer,
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