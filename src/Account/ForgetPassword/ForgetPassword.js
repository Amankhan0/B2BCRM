import React from 'react'
import { useState } from 'react';
import InputOtp from '../../Component/OTP/InputOtp';
import BeforeLoginButton from '../../Component/BeforeLoginButton';
import { ApiHit } from '../../Constants/ApiFunction /ApiHit';
import { useSelector } from 'react-redux';
import { forgotPassword } from '../../Constants/Constants';

function ForgetPassword({message}) {
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState('');

  const ApiReducer = useSelector((state) => state.ApiReducer);


  const handleOTP = () =>{
    if(otp === ''){
      setOtpError('Please enter OTP');
    }else{
      var json ={
        OTP: otp,
        action: 'verify',
        email : ApiReducer?.apiJson?.email


      }

      console.log(
        "json",json
      );
      
     ApiHit(json ,forgotPassword).then((res)=>{
      console.log("res",res);
      
     })
    }
  }


  return (
    <div>
      <div className='font-medium capitalize text-sm'>{message}</div>
      <div className='mt-2'>
      <InputOtp otp={otp} setOtp={setOtp} otpError={otpError} />
      <BeforeLoginButton title={'Verify OTP'} onClick={handleOTP}/>
      </div>
    </div>
  )
}

export default ForgetPassword