import React, { useState } from 'react'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import LoginInput from '../../Component/Input/LoginInput'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { VerifyEamilValidation } from '../../ValidationScheema/Login/VerifyEmail';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import { ApiHit } from '../../Constants/ApiFunction /ApiHit';
import { forgotPassword, login, verifyUser } from '../../Constants/Constants';
import { regexEmail, secretKey, STROGNPASSWORD } from '../../utils';
import InputOtp from '../../Component/OTP/InputOtp';
import ChangePassword from '../ChangePassword';
import { setTrackYourTransportUser } from '../../Storage/Storage';
import CryptoJS from 'crypto-js';
import ForgetPassword from '../ForgetPassword/ForgetPassword';



function Login() {
    const dispatch = useDispatch();
    const [passwordTab, setPasswordTab] = useState(false);
    const [otpTab, setOtpTab] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [changePassword, setChangePassword] = useState(false);
    const [showForgetPassword, setShowForgetPassword] = useState(false); 
    const [message ,setMessage] = useState('')

    const ApiReducer = useSelector((state) => state.ApiReducer);
    console.log("ApiReducer", ApiReducer);

    const handleVerify = (type) => {
        ApiReducer.apiJsonError = {};
        dispatch(setDataAction({}, SET_API_JSON_ERROR));
        VerifyEamilValidation(ApiReducer).then((error) => {
            console.log("res__________", error);
            dispatch(setDataAction(error, SET_API_JSON_ERROR));
            if (Object.keys(error).length === 0) {
                let json = ApiReducer?.apiJson;
                let apiToHit = verifyUser;

                if (type === 'otpverify') {
                    apiToHit = login;
                    json = {
                        OTP: otp,
                        email: ApiReducer?.apiJson?.email,
                        action: 'fto',
                    };
                }

                if (type === 'login') {
                    apiToHit = login;

                    if (ApiReducer.apiJson.password) {
                        const encryption = CryptoJS.AES.encrypt(
                            JSON.stringify(json?.password),
                            secretKey
                        ).toString();
                        json.password = encryption;
                    }
                }

                ApiHit(json, apiToHit).then((res) => {
                    console.log("json", json);
                    console.log("res++++++++++++++ssss", res?.doc?.message);
                    console.log("res++++++++++++++ssss", res);

                    if (res?.message === 'No Data Found') {
                        dispatch(setDataAction({ email: 'email not found' }, SET_API_JSON_ERROR));
                    } else if (res?.doc?.message === "PasswordTab") {
                        setPasswordTab(true);
                    } else if (res?.message === "Wrong credentials") {
                        dispatch(setDataAction({ password: res?.message }, SET_API_JSON_ERROR));
                    } else if (res?.doc?.message === "OTPTab") {
                        setOtpTab(true);
                    } else if (res?.doc?.message === "Logged in successfully") {
                        alert(res?.doc?.message);
                        setTrackYourTransportUser(res?.doc?.finalDoc);
                        window.location.reload();
                    } else if (res.message === 'Invalid OTP') {
                        setOtpError('Invalid OTP');
                    } else if (res?.doc?.message === "Approved") {
                        setChangePassword(true);
                    }
                });
            }
        });
    };

    const handleLogin = () => {
        handleVerify('login');
    };

    const handleVerifyOTP = () => {
        setOtpError('');
        if (otp === '') {
            setOtpError('Please enter OTP');
        } else {
            handleVerify('otpverify');
        }
    };

    const handleForgetPassword = () => {
        var json ={
            email: ApiReducer.apiJson.email,
            action: 'generate',
        }
        ApiHit(json,forgotPassword).then((res)=>{
            console.log("res",res);

            if(res?.status === 200){
                setShowForgetPassword(true)
                setMessage(res?.message)
            }
            
        })
        // setShowForgetPassword(true)

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
                                    Login to continue
                                </p>
                            </div>
                        </div>
                        <div className="mt-16">
                            {showForgetPassword ? (
                                <ForgetPassword  message={message}/>
                            ) : (
                                <div>
                                    {changePassword ? (
                                        <ChangePassword />
                                    ) : (
                                        <div>
                                            <LoginInput
                                                imp={true}
                                                label={'Email'}
                                                name={'email'}
                                                lowercase
                                                error={
                                                    !regexEmail?.test(ApiReducer?.apiJson?.email) ||
                                                    ApiReducer?.apiJsonError?.email
                                                }
                                                disabled={passwordTab || otpTab}
                                            />
                                            {passwordTab && (
                                                <>
                                                    <LoginInput
                                                    type={'password'}
                                                        imp={true}
                                                        label={'Password'}
                                                        name={'password'}
                                                        error={ApiReducer?.apiJsonError?.password}
                                                    />
                                                    <div
                                                        className="text-end text-xs cursor-pointer text-blue-800 hover:underline"
                                                        onClick={handleForgetPassword}
                                                    >
                                                        Forgot password?
                                                    </div>
                                                </>
                                            )}
                                            {otpTab && <InputOtp otp={otp} setOtp={setOtp} otpError={otpError} />}
                                            <div className="mt-3 mb-3">
                                                {passwordTab ? (
                                                    <BeforeLoginButton title={'Login'} onClick={handleLogin} />
                                                ) : otpTab ? (
                                                    <BeforeLoginButton title={'Verify OTP'} onClick={handleVerifyOTP} />
                                                ) : (
                                                    <BeforeLoginButton title={'Verify'} onClick={handleVerify} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
