import React from "react";
import { Colors } from "../Colors/color";

const MyButton = ({ title, onClick, width, type, icon, bg, color, border, font, className, disable }) => {
    return (
        <button disabled={type === 'loader' ? true : disable} onClick={!disable && onClick} className={`p-2 rounded-md items-center gap-1 text-white w-${width}  ${font && font} text-center flex justify-center ${border && 'border border-themeblue'} ${className}`} style={{ background: bg ? bg : !disable ? Colors.ThemeBlue : 'lightgray', color: color ? color : '' }}>{icon && <p className="px-1">{icon}</p>}{type === 'loader' ? 'loading...' : title}</button>
    )
}

export default MyButton;