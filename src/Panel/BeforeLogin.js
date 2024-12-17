// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Dashboard from "../Webview/Dashboard";
// import CreateTrip from "../Webview/CreateTrip";
// import ViewTrip from "../Webview/ViewTrip";

// const PanelRoutes = () => {

//   return (
//     <>
//         <Routes>
//           <Route path="/" exact element={<Dashboard />} />
//           <Route path="/trip/create" exact element={<CreateTrip />} />
//           <Route path="/trip/view" exact element={<ViewTrip />} />
//           {/* <Route path="/shared/trip/view" exact element={<ViewSharedTrip />} />
//           <Route path="/trip/edit/:id/:index/:ref" exact element={<EditTrip />} />
//           <Route path="/trip/edit/:id/:index/" exact element={<EditTrip />} />
//           <Route path="/profile" exact element={<Profile />} />
//           <Route path="/track/map/:id/:index" exact element={<TrackMap />} />
//           <Route path="/verify/vehicle" exact element={<VerifyVehicle />} />
//           <Route path="/trips/epod" exact element={<EPOD />} />
//           <Route path="/my/vehicles" exact element={<ViewVehicle />} />
//           <Route path="/verify/driver" exact element={<VerifyDriver />} />
//           <Route path="/my/drivers" exact element={<ViewDriver />} />
//           <Route path="/multimodal/tracking" exact element={<MultiModalTracking />} />
//           <Route path="/empty/vehicle/registration" exact element={<EmptyVehicleRegistration />} />
//           <Route path="/my/empty/vehicles" exact element={<MyEmptyVehicles />} />
//           <Route path="/book/empty/vehicle" exact element={<BookVehicle />} />
//           <Route path="/shortlist/vehicles" exact element={<ShortList />} />
//           <Route path="/test" exact element={<Test />} />
//           <Route path="/testModal" exact element={<Test2 />} />
//           <Route path="/magic" exact element={<Magic />} />
//           <Route path="/e-challan" exact element={<EChallanWeb />} />
//           <Route path="/ev/station" exact element={<EVStation />} />
//           <Route path="/toll/info" exact element={<TollPlaza />} />
//           <Route path="/bid/create" exact element={<CreateBid />} />
//           <Route path="/bid/dashboard" exact element={<BidDashboard />} />
//           <Route path="/bid/live" exact element={<LiveBid />} />
//           <Route path="/bid/my" exact element={<MyBid />} />
//           <Route path="/viewBidders/:id" exact element={<ViewBidders />} />
//           <Route path="/bid/edit/:id" exact element={<EditBid />} />
//           <Route path="/group/create" exact element={<CreateGroup />} />
//           <Route path="/group/dashboard" exact element={<GroupDashboard />} />
//           <Route path="/group/edit/:id" exact element={<EditGroup />} />
//           <Route path="/404" element={<PagenotFound />} />
//           <Route path="*" element={<UnauthorizedAccess />} /> */}
//         </Routes>
//     </>
//   );
// };

// export default PanelRoutes;


import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Account/Login/Login'

function BeforeLogin() {
  return (
    <>
    <Routes>
    <Route path="/" exact element={<Login />} />
    </Routes>
    </>
  )
}

export default BeforeLogin
