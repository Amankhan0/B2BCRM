import React from "react";
import { Colors } from "../Colors/color";

const MyButton = ({ title, onClick, width, type,icon,bg,color,border,font,className,disable }) => {

    return (
        type !== 'loader' ?
            <button disabled={disable} onClick={!disable&&onClick} className={`p-2 rounded-md items-center gap-1 text-white w-${width}  ${font && font} text-center flex justify-center ${border&&'border border-themeblue'} ${className}`} style={{ background: bg?bg:!disable?Colors.ThemeBlue:'lightgray',color:color?color:'' }}>{icon&&<p className="px-1">{icon}</p>}{title}</button>
            :
             <button className={`p-2 rounded-md text-white w-max`} style={{ background: bg?bg:Colors.ThemeBlue }}>
             <div className="w-max">
                <div className="flex gap-x-2 items-center">
                <div className="spinner w-4 h-4 animate-spin  rounded-full border-[2px] border-white"></div>
                    <div>Loading.....</div>
                </div>
             </div>
         </button>
    )
}

export default MyButton;