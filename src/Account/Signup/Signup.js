import React from 'react'
import LoginInput from '../../Component/Input/LoginInput'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import { NavLink } from 'react-router-dom'

function Signup() {
  return (
    <div>
    <div className="flex min-h-100vh grow bg-slate-50 dark:bg-navy-900">
        <div className="fixed top-0 hidden p-6 lg:block lg:px-12">
            <div className="flex items-center space-x-2">
                <img
                    className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                    src="https://play-lh.googleusercontent.com/e9LsfVvW11r0W0ONb0clg_Q4j_KBvfxlU8N6gCnqBxqy49XKLH5ZVkxwul-nyuFBGw"
                    alt="logo"
                />
                <p className="text-xl font-semibold uppercase text-slate-700 dark:text-navy-100">
                    Army vehicle tracking
                </p>
            </div>
        </div>
        <div className="hidden w-full place-items-center lg:grid">
            <div className="w-full max-w-lg p-6">
                <img
                    className="w-full"
                    id="hero-image-light"
                    src="https://lineone-html-es6.piniastudio.com/images/illustrations/dashboard-check.svg"
                    alt="image"
                />
            </div>
        </div>
        <div className="flex flex-col items-center w-full bg-white dark:bg-navy-700 lg:max-w-md">
            <div className="flex flex-col justify-center w-full max-w-sm p-5 grow">
                <div className="text-center">
                    <img
                        className="w-16 h-16 mx-auto lg:hidden"
                        src="https://play-lh.googleusercontent.com/e9LsfVvW11r0W0ONb0clg_Q4j_KBvfxlU8N6gCnqBxqy49XKLH5ZVkxwul-nyuFBGw"
                        alt="logo"
                    />
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                            Welcome
                        </h2>
                        <p className="text-slate-400 dark:text-navy-300">
                            Sign in to continue
                        </p>
                    </div>
                </div>
                <div className="mt-16">
                    <LoginInput imp={true} />

                    <div className="mt-3 mb-3">
                        <BeforeLoginButton title={'Sign in'} />

                    </div>
                </div>
                <div className='text-md'>Already have account ?     <NavLink
                    to="/"
                    className='text-sky-700 hover:underline cursor-pointer'
                >
                    Login
                </NavLink></div>
            </div>
        </div>
    </div>

</div>
  )
}

export default Signup