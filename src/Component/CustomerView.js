import React from "react";
import Title from "./Title";
import { Colors } from "../Colors/color";
import { CrossMark } from "../SVG/Icons";

const formatAddress = (address) => {
  if (!address) return "-";
  if (Array.isArray(address)) {
    return address.map((addr) => `${addr.address}, ${addr.state}, ${addr.city}, ${addr.pinCode}, ${addr.landmark || ""}`).join(" | ");
  }
  return `${address.address}, ${address.state}, ${address.city}, ${address.pinCode}, ${address.landmark || ""}`;
};

const CustomerView = ({ data, onClickClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden" role="dialog">
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
      <div className="relative rounded-lg card w-[80%] transition-opacity duration-300 overflow-y-auto p-6" style={{ maxHeight: "90vh" }}>
        <div className="flex justify-between text-white p-3 items-center" style={{ background: Colors.ThemeBlue }}>
          <Title color={Colors.WHITE} title={"Customer"} size={"lg"} />
          <div className="cursor-pointer" onClick={onClickClose}>{CrossMark}</div>
        </div>
        <div className="p-6 space-y-4">
          {[ 
            { label: "Company Name", value: data?.companyName || "-" },
            { label: "Industry", value: data?.industry || "-" },
            { label: "Company Size", value: data?.companySize || "-" },
            { label: "Customer Name", value: data?.name || "-" },
            { label: "Customer Contact", value: data?.contact || "-" },
            { label: "Customer Email", value: data?.email || "-" },
            { label: "GST", value: data?.gstNo || "-" },
            { label: "PAN", value: data?.pancardNo || "-" },
            { label: "Billing Address", value: formatAddress(data?.billingAddress) },
            { label: "Shipping Address", value: formatAddress(data?.shippingAddress) }
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <Title color={Colors.BLACK} title={item.label} size={"lg"} />
              <Title color={Colors.BLACK} title={item.value} size={"sm"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;