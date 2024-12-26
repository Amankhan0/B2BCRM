import React from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import { Colors } from '../../Colors/color';

function ChangePassTab({ activeTab, setActiveTab }) {
    return (
        <div>
            <div className="flex flex-col items-center border-b border-slate-200">
                <div className="tabs-list -mb-0.5 flex md:w-auto overflow-scroll md:overflow-hidden w-full">
                    {/* Account Tab */}
                    <button
                        className={`btn h-10 space-x-1 rounded-none w-full font-medium sm:px-5 border-b-2 ${
                            activeTab === 'account'
                                ? `text-[${Colors.ThemeBlue}] border-[${Colors.ThemeBlue}]`
                                : 'text-gray-400 border-transparent'
                        }`}
                        onClick={() => setActiveTab('account')}
                    >
                        <FaUserAlt />
                        <span>Account</span>
                    </button>

                    {/* Password Tab */}
                    <button
                        className={`btn h-10 space-x-1 rounded-none w-full font-medium sm:px-5 border-b-2 ${
                            activeTab === 'password'
                                ? `text-[${Colors.ThemeBlue}] border-[${Colors.ThemeBlue}]`
                                : 'text-gray-400 border-transparent'
                        }`}
                        onClick={() => setActiveTab('password')}
                    >
                        <FaLock />
                        <span>Password</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassTab;
