import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Webview/Dashboard";
import CreateLead from "../Webview/Lead/CreateLead";
import Lead from "../Webview/Lead/Lead";
import Quotation from "../Webview/Quotation/Quotation";
import CreateQuotation from "../Webview/Quotation/CreateQuotation";
import Order from "../Webview/Order/Order";
import CreateOrder from "../Webview/Order/CreateOrder";

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
        </Routes>
    </>
  );
};

export default PanelRoutes;
