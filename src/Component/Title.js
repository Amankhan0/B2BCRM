import React from 'react'

function Title({ title, size, font, color, padding,underline }) {
    return (
        <>
            {
                size === "6xl" && <div className={`${underline?'underline':''} font-${font} text-4xl md:text-6xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "5xl" && <div className={`${underline?'underline':''} font-${font} text-4xl md:text-5xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "4xl" && <div className={`${underline?'underline':''} font-${font} text-3xl md:text-4xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "3xl" && <div className={`${underline?'underline':''} font-${font} text-lg md:text-3xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "2xl" && <div className={`${underline?'underline':''} font-${font} text-lg md:text-2xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "xl" && <div className={`${underline?'underline':''} font-${font} text-lg md:text-xl`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "lg" && <div className={`${underline?'underline':''} font-${font} text-base lg:text-lg`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "base" && <div className={`${underline?'underline':''} font-${font} text-base`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "md" && <div className={`${underline?'underline':''} font-${font} text-md`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "sm" && <div className={`${underline?'underline':''} font-${font} text-xs md:text-sm`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "xs" && <div className={`${underline?'underline':''} font-${font} text-xs`} style={{ color: color , padding: padding}}>{title} </div>
            }
            {
                size === "extraxs" && <div style={{ color: color, fontSize: '10px' }}>{title} </div>
            }

        </>
    )
}

export default Title;