import React from 'react'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import LoginInput from '../../Component/Input/LoginInput'

function Login() {
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
                            TYT ARMY WEB
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
                            <LoginInput  imp={true}/>
                            {/* <div className="container relative mx-auto mt-2">
          <label
            htmlFor="Password"
            className="block mb-2 text-sm font-medium text-black"
          >
            Password<span className="text-error">*</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent mb-2 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 h-10 border border-gray-300 undefined"
            id="Password"
            defaultValue=""
          />
          <p className="mt-1 text-xs text-error" />
          <div className="flex gap-5" />
          <p className="absolute inset-y-0 right-0 mt-10 mr-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </p>
        </div> */}
                            {/* <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block mb-1 text-xs font-medium text-black ">
              Enter CAPTCHA <span className="text-xs text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Captcha"
              maxLength={6}
              className="mb-2 text-black text-sm bg-transparent focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 h-10 border border-gray-300"
            />
            <div className="text-xs text-error" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-black ">
              CAPTCHA Code
            </label>
            <div className="font-bold bg-gray-300 py-1.5  flex justify-between px-6 ">
              <div className="text-xl text-gray-400 ">eYpEY4</div>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="blue"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div> */}
                            <div className="mt-3 mb-3">
                                <BeforeLoginButton title={'Sign in'} />
                                {/* <button
            className="btn border border-primary/30 bg-primary/10 font-medium text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:border-accent-light/30 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25 mt-3"
            style={{ width: "100%" }}
          >
            Sign inset
          </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login