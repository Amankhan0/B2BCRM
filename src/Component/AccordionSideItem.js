import { useEffect, useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Colors } from '../Colors/color';
import { eye } from '..//SVG/Icons';
import { NavLink, useLocation } from 'react-router-dom';


export default function AccordionSideItem({ title, content,onClick }) {

    const [expanded, setExpanded] = useState(false);
    var url = window.location.pathname

    const location = useLocation();

    // const onClick = () => {
    //     var url = window.location.pathname

        
  
    // }
    useEffect(() => {

    }, [location.pathname])


    return (
        <div >
            <div
                onClick={() => setExpanded(!expanded)}
                className={`flex cursor-pointer items-center justify-between py-2 text-sm font-bold text-white rounded-lg px-3 w-full `}
            >
                <p >{title}</p>
                <div
                    className={`text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300 ${expanded && '-rotate-180 '} `}
                >
                    <MdKeyboardArrowDown size={20} color={ Colors.WHITE} />
                </div>
            </div>
            {expanded && (
                <div className='mt-3'>
                    <div>
                        {content.map((links, i) => {

                            return (
                                <NavLink to={links.url} onClick={onClick} style={{ backgroundColor: url === (links.url) && Colors.WHITE, color: url === (links.url) ? Colors.BLACK : Colors.WHITE }} className={`${url === (links.url) ? 'bg-white text-black' : 'text-white'} px-3 nav-link flex py-2 text-sm hover:bg-[#0000004a] items-center rounded-lg mb-3`}>
                                    {links.icon}
                                    <div className='px-3' >{links.title}</div>
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
