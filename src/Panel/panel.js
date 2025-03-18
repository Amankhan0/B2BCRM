import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Links from './NavLinks';
import { setSidebar } from '../Store/Action/SidebarAction';
import PanelRoutes from './Routes';
import { Colors } from '../Colors/color';
import { dropDownIcon } from '../SVG/Icons';
import { NavLink, useLocation } from 'react-router-dom';
import Title from '../Component/Title';
import { FullReduxNull } from '../Store/FullReduxNull';
import { MdOutlineCancel } from "react-icons/md";
import AccordionSide from '../Component/AccordionSide';
import { useEffect } from 'react';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { getHeadingFromPathname } from '../utils';

const SidebarItem = ({ item, onClick }) => {

    const location = useLocation();
    const url = window.location.pathname;

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const hasSubItems = item.child && item.child.length > 0;

    const handleSubMenuToggle = (title) => {
        setIsSubMenuOpen((prevState) => !prevState);
    };


    useEffect(() => {

    }, [location.pathname])

    return (
        <li className='text-slate-600'>
            {
                hasSubItems ?
                    <div>
                        <button className="cursor-pointer nav-link flex py-2 text-sm  items-center mx-4" onClick={handleSubMenuToggle}>
                            <span className="flex px-3.5 py-2 cursor-pointer">{item.icon}&nbsp;
                                <label className='mt-0.5 ml-1 cursor-pointer text-black'>{item.title}</label>&nbsp;
                                <label className='mt-0.5 ml-5 cursor-pointer'>{dropDownIcon}</label>
                            </span>
                        </button>
                        {isSubMenuOpen && (
                            <ul className='ml-10'>
                                {item.child.map((subItem, index) => (
                                    <SidebarItem key={index} item={subItem} onClick={onClick} />
                                ))}
                            </ul>
                        )}
                    </div>
                    :
                    <div>
                        <NavLink style={{ backgroundColor: url === (item.url) && Colors.ThemeBlue, color: url === (item.url) ? Colors.WHITE : Colors.BLACK }} to={item.url} onClick={onClick} className={`${url === (item.url) ? 'bg-white text-black' : 'text-white'} px-3 nav-link flex py-2 text-sm hover:bg-[#0000004a] items-center mx-4 rounded-lg mb-3`}>
                            {url === (item.url) ? item.blackIcon ? item.blackIcon : item.icon : item.icon}&nbsp;&nbsp;{item.title}
                        </NavLink>
                        {item._id === 99 ? <div className="my-3 mx-4 h-px"></div> : null}
                    </div>
            }
        </li >
    );
};

const SideBarDropDown = ({ item, onClick }) => {

    const UserReducer = useSelector(state => state.UserReducer)

    return (
        <div>
            <AccordionSide onClick={onClick} question={item.title} ans={UserReducer?.userData?.doc?.userType === 'Transporter' && item.id === 3 ? item.Transporterchild : item?.child} />
            {/* <div className={`bg-white px-3 nav-link flex py-2 text-sm justify-between text-black hover:bg-[#26334d82] hover:text-white items-center mx-4 rounded-lg mb-3`} onClick={()=>{alert("yess")}}> {item.title} <div>{<MdKeyboardArrowDown />}</div></div> */}
        </div>
    )
}

export default function Main() {

    const dispatch = useDispatch()
    const reduxSidebar = useSelector(state => state.SidebarReducer)
    const UserReducer = useSelector(state => state.UserReducer)
    const SubReducer = useSelector(state => state.SubscriptionReducer);
    const [showProfile, setShowProfile] = useState(false)
    const [showPopUpExpire, setShowPopUpExpire] = useState(true)

    const [sideBarTitle, setSideBarTitle] = useState('');

    const [localNav, setLocalNav] = useState(Links)
    const [render, setRender] = useState(Date.now())
    const [title, setTitle] = useState('')
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth)
    const [showNotification, setShowNotification] = useState(false)
    const location = useLocation();




    const handleSidebar = (value) => {
        dispatch(setSidebar(value))
    }
    const handleItemClick = (title) => {
        // dispatch(setDataAction(title, SET_PANEL_TITLE))
        // setSideBarTitle(title)
        dispatch(FullReduxNull())
        setRender(Date.now())
        setTitle(title)
    }

    const handleExpire = () => {
        setShowPopUpExpire(false)
    }

    useEffect(() => {
        if (reduxSidebar?.doc === false) {
            if (isSmallScreen > 900) {
                dispatch(setSidebar('is-sidebar-open'))
            } else {
                dispatch(setSidebar(''))
            }
        }
    }, [location.pathname, isSmallScreen, window.innerWidth, reduxSidebar])

    let x = getHeadingFromPathname()


    return (
        <div>
            <div className={reduxSidebar?.doc}>
                <div id="root" style={{ backgroundColor: Colors.HEADER }} className="min-h-100vh flex grow relative overflow-hidden" >
                    <div className="sidebar sidebar-panel">
                        <div className={`flex h-full grow flex-col shadow-xl bg-white`}>
                            <div className="flex justify-between px-3 py-3 border-b-[0.5px]" >
                                <h1 className="flex items-center gap-2" style={{ color: Colors.WHITE }}>
                                    <img className='p-0.5' src={'https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75'} />
                                    {isSmallScreen < 700 && <div className='px-5' onClick={() => handleSidebar(reduxSidebar.doc === 'is-sidebar-open' ? '' : 'is-sidebar-open')}><IoIosArrowDropleftCircle size={25} /></div>}
                                </h1>
                            </div>
                            <div className="nav-wrapper my-5 h-[calc(100%-4.5rem)] overflow-x-hidden pb-6" data-simplebar="init"><div className="simplebar-wrapper" style={{ margin: '0px 0px -24px' }}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                <div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{ height: '100%', overflow: 'scroll' }}><div className="simplebar-content" style={{ padding: '0px 0px 24px' }}>
                                    <ul>
                                        {localNav.map((item, index) => (
                                            <div key={index} className={item?.id === 1 ? 'p-2 w-max -ml-4 font-semibold' : 'p-0'}>
                                                {item.url ? (
                                                    <SidebarItem item={item} onClick={() => handleItemClick(item.title)} />
                                                ) : (
                                                    <SideBarDropDown item={item} onClick={() => handleItemClick(item.title)} />
                                                )}
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                                </div>
                            </div>
                            </div>
                                <div className="simplebar-placeholder" style={{ width: '259px', height: '618px' }}></div>
                            </div>
                                <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}>
                                    <div className="simplebar-scrollbar" style={{ width: '0px', display: 'none' }}></div>
                                </div>
                                <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
                                    <div className="simplebar-scrollbar" style={{ height: '0px', display: 'none' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='main-content' style={{ width: '100%', background: '#f9f9f9' }}>
                        <div className='bg-white shadow-xl flex justify-between px-5 py-3' style={{ alignItems: 'center' }}>
                            { 
                                reduxSidebar?.doc ?
                                    <div className='flex items-center p-1'>
                                        <button style={{ color: Colors.BLACK }} className="sidebar-toggle ml-0.5 flex h-7 w-7 flex-col justify-center space-y-1.5 outline-none focus:outline-none dark:text-accent-light/80" onClick={() => handleSidebar(reduxSidebar.doc === 'is-sidebar-open' ? '' : 'is-sidebar-open')}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </button>
                                        <Title title={getHeadingFromPathname()} size='xl' font={'medium'} color={Colors.BLACK} />
                                    </div>
                                    :
                                    <h1 className="text-base ml-4 flex items-center" style={{ color: Colors.WHITE }}>
                                        <button style={{ color: Colors.BLACK }} className={` sidebar-toggle ml-0.5 flex h-7 w-7 flex-col justify-center space-y-1.5 outline-none focus:outline-none dark:text-accent-light/80`} onClick={() => handleSidebar(reduxSidebar?.doc === 'is-sidebar-open' ? '' : 'is-sidebar-open')}>
                                            <span ></span>
                                            <span></span>
                                            <span></span>
                                        </button>
                                        <img className='-mt-0.5 mr-2 hidden md:flex  w-8 h-8 rounded-full' src={'https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75'} />
                                        <div className='text-black '>
                                            <img className='w-1/4 ml-5' src={'https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75'} />
                                        </div>
                                    </h1>
                            }
                            <div className='items-center gap-x-3 cursor-pointer mr-5' style={{ color: Colors.BLACK }}>
                                {/* <div className={`w-8 h-8 text-center pt-0.5 text-lg rounded-full shadow-xl`} style={{ background: Colors.ThemeBlue, color: Colors.WHITE }} onClick={() => setShowProfile(!showProfile)}>{user?.username?.slice(0, 1)}
                                </div> */}
                            </div>
                        </div>
                        <div className='px-2 md:px-8 lg:px-10' >
                            {(SubReducer?.currentPlan?.everify < 5 || SubReducer?.currentPlan?.trackandtrace < 5 || SubReducer?.currentPlan?.trip < 5) && showPopUpExpire &&
                                <div >
                                    <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 relative -mx-2 md:-mx-8 lg:-mx-10" role="alert">
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <p class="font-bold">Subscription is about to expire soon</p>
                                                <p class="text-sm">Your Subscription is about to end Please renew it</p>
                                            </div>
                                            <div onClick={handleExpire}>< MdOutlineCancel size={25} /></div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <PanelRoutes />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
