import React from "react";
import { Colors } from "../Colors/color";

const DashboardCard = ({ TotalNum, Title, Icon, iconBG, onClick, activeBg }) => {

  return (
    <div onClick={onClick} style={{ background: activeBg ? '#e2e8f0' : '#fff', border: activeBg ? `1px solid ${Colors}` : 'none' }} className={`rounded-lg p-7 hover:bg-slate-300`}>
      <div className="flex justify-between space-x-1">
        <p className="text-xl font-semibold text-slate-700 dark:text-navy-100">
          {TotalNum}
        </p>
        <p style={{ color: iconBG }}>{Icon}</p>
      </div>
      <p className="mt-1 text-xs+">{Title}</p>
    </div>
  )
}

export default DashboardCard;