import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Webview/Dashboard";
import CreateLead from "../Webview/Lead/CreateLead";
import Lead from "../Webview/Lead/Lead";
import Quotation from "../Webview/Quotation/Quotation";
import CreateQuotation from "../Webview/Quotation/CreateQuotation";
import Order from "../Webview/Order/Order";
import CreateOrder from "../Webview/Order/CreateOrder";
import Customer from "../Webview/Customer/Customer";
import CreateCustomer from "../Webview/Customer/CreateCustomer";
import Supplier from '../Webview/Supplier/Supplier';
import CreateSupplier from '../Webview/Supplier/CreateSupplier'
import Product from "../Webview/Product/Product";
import CreateProduct from "../Webview/Product/CreateProduct";

const PanelRoutes = () => {

  return (
    <>
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/lead" exact element={<Lead />} />
          <Route path="/create-lead" exact element={<CreateLead />} />
          <Route path="/quotation" exact element={<Quotation />} />
          <Route path="/create-quotation/:id" exact element={<CreateQuotation />} />
          <Route path="/order" exact element={<Order />} />
          <Route path="/create-order/:id" exact element={<CreateOrder />} />
          <Route path="/customer" exact element={<Customer />} />
          <Route path="/create-customer" exact element={<CreateCustomer />} />
          <Route path="/edit-customer/:id" exact element={<CreateCustomer />} />
          <Route path="/supplier" exact element={<Supplier />} />
          <Route path="/create-supplier" exact element={<CreateSupplier />} />
          <Route path="/edit-supplier/:id" exact element={<CreateSupplier />} />
          <Route path="/product" exact element={<Product />} />
          <Route path="/create-product" exact element={<CreateProduct />} />
          <Route path="/edit-product/:id" exact element={<CreateProduct />} />
        </Routes>
    </>
  );
};

export default PanelRoutes;
