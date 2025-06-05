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
import Role from "../Webview/UserMangment/RoleManagement/Role";
import AddRole from "../Webview/UserMangment/RoleManagement/AddRole";
import AddUser from "../Webview/UserMangment/UserManagement/AddUser";
import User from "../Webview/UserMangment/UserManagement/User";
import { getAuthenticatedUserWithRoles } from "../Storage/Storage";
import Profile from "../Webview/Profile";
import EditAddRole from "../Webview/UserMangment/RoleManagement/EditRole";
import EditAddLead from "../Webview/Lead/EditLead";
import EditUser from "../Webview/UserMangment/UserManagement/EditUser";
import OnlineLead from "../Webview/OnlineLead";
import OnlineCreateLead from "../Webview/OnlineCreateLead";

const PanelRoutes = () => {

  let user = getAuthenticatedUserWithRoles();

  return (
    <>
      <Routes>
        {
          // user?.roleObject?.permission?.[0]?.permission?.[0].read &&
          <Route path="/online-lead" exact element={<OnlineLead />} />
        }
        {
          // user?.roleObject?.permission?.[0]?.permission?.[0].read &&
          <Route path="/online-lead/pick/:id" exact element={<OnlineCreateLead />} />
        }
        {
          // user?.roleObject?.permission?.[0]?.permission?.[0].read &&
          <Route path="/lead" exact element={<Lead />} />
        }
        {
          // user?.roleObject?.permission?.[0]?.permission?.[0].write &&
          <Route path="/create-lead" exact element={<CreateLead />} />
        }
        {
          // user?.roleObject?.permission?.[0]?.permission?.[0].write &&
          <Route path="/editlead/:id" exact element={<EditAddLead />} />
        }
        {
          // user?.roleObject?.permission?.[1]?.permission?.[0].read &&
          <Route path="/quotation" exact element={<Quotation />} />
        }
        {
          // user?.roleObject?.permission?.[1]?.permission?.[0].write &&
          <Route path="/create-quotation/:id" exact element={<CreateQuotation />} />
        }
        {
          // user?.roleObject?.permission?.[2]?.permission?.[0].read &&
          <Route path="/order" exact element={<Order />} />
        }
        {
          // user?.roleObject?.permission?.[2]?.permission?.[0].write &&
          <Route path="/create-order/:id" exact element={<CreateOrder />} />
        }
        {
          // user?.roleObject?.permission?.[3]?.permission?.[0].read &&
          <Route path="/customer" exact element={<Customer />} />
        }
        {
          // user?.roleObject?.permission?.[3]?.permission?.[0].write &&
          <>
            <Route path="/create-customer" exact element={<CreateCustomer />} />
            <Route path="/edit-customer/:id" exact element={<CreateCustomer />} />
          </>
        }
        {
          // user?.roleObject?.permission?.[4]?.permission?.[0].read &&
          <Route path="/supplier" exact element={<Supplier />} />
        }
        {
          // user?.roleObject?.permission?.[4]?.permission?.[0].write &&
          <>
            <Route path="/create-supplier" exact element={<CreateSupplier />} />
            <Route path="/edit-supplier/:id" exact element={<CreateSupplier />} />
          </>
        }
        {
          // user?.roleObject?.permission?.[5]?.permission?.[0].read &&
          <Route path="/product" exact element={<Product />} />
        }
        {
          // user?.roleObject?.permission?.[5]?.permission?.[0].write &&
          <>
            <Route path="/create-product" exact element={<CreateProduct />} />
            <Route path="/edit-product/:id" exact element={<CreateProduct />} />
          </>
        }
        {
          // user?.roleObject?.permission?.[6]?.permission?.[0].read &&
          <Route path="/role" exact element={<Role />} />
        }
        {
          // user?.roleObject?.permission?.[6]?.permission?.[0].write &&
          <Route path="/editrole/:id" exact element={<EditAddRole />} />
        }
        {
          // user?.roleObject?.permission?.[6]?.permission?.[0].write &&
          <Route path="/addrole" exact element={<AddRole />} />
        }
        {
          // user?.roleObject?.permission?.[7]?.permission?.[0].read &&
          <Route path="/user" exact element={<User />} />
        }
        {
          // user?.roleObject?.permission?.[7]?.permission?.[0].write &&
          <Route path="/addUser" exact element={<AddUser />} />
        }
        {
          // user?.roleObject?.permission?.[7]?.permission?.[0].write &&
          <Route path="/edituser/:id" exact element={<EditUser />} />
        }
        <Route path="/" exact element={<Dashboard />} />
        {/* <Route path="/profile" exact element={<Profile />} /> */}
      </Routes>
    </>
  );
};

export default PanelRoutes;