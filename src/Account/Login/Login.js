import React, { useState } from 'react'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import LoginInput from '../../Component/Input/LoginInput'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { VerifyEamilValidation } from '../../ValidationScheema/Login/VerifyEmail';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import { ApiHit } from '../../Constants/ApiFunction /ApiHit';
import { login, verifyUser } from '../../Constants/Constants';
import { regexEmail } from '../../utils';

function Login() {
    const dispatch = useDispatch();
    const [passwordTab, setPasswordTab] = useState(false)

    const ApiReducer = useSelector((state) => state.ApiReducer);
    console.log("ApiReducer", ApiReducer);


    const handleVerify = (type) => {
        ApiReducer.apiJsonError = {}
        dispatch(setDataAction({}, SET_API_JSON_ERROR))

        VerifyEamilValidation(ApiReducer).then((error) => {
            console.log("res", error);
            dispatch(setDataAction(error, SET_API_JSON_ERROR))
            if (Object.keys(error).length === 0) {
              
                ApiHit(ApiReducer.apiJson,type === 'login'? login : verifyUser).then((res) => {
                    console.log("res++++", res);
                    if (res?.message === 'No Data Found') {
                        dispatch(setDataAction({ email: 'email not found' }, SET_API_JSON_ERROR))
                    }
                    else if(res?.doc?.message === "PasswordTab"){
                        setPasswordTab(true)
                    }
                    else if(res?.message === "Wrong credentials"){
                        dispatch(setDataAction({ password: res?.message }, SET_API_JSON_ERROR))
                    }
                    else if(res?.doc?.message === "Loggged in successfully"){
                        alert(res?.doc?.message)
                      
                    }
                })
            }
        })
    }

    const handleLogin = () =>{
        handleVerify('login')

    }

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
                        <div className="mt-16">
                            <LoginInput imp={true} label={'Email'} name={'email'} lowercase error={!regexEmail?.test(ApiReducer?.apiJson?.email) || ApiReducer?.apiJsonError?.email} />
                            {passwordTab &&
                                <LoginInput imp={true} label={'Password'} name={'password'}  error={ ApiReducer?.apiJsonError?.password} />

                            }
                            <div className="mt-3 mb-3">
                              { passwordTab ?  <BeforeLoginButton title={'Login'} onClick={handleLogin} /> :<BeforeLoginButton title={'Verify'} onClick={handleVerify} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login