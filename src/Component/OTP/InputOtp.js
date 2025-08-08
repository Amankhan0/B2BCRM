import React from 'react'
import { useState } from 'react';
import OtpInput from 'react-otp-input';


function InputOtp({otp,setOtp,otpError}) {

    console.log("OTP",otp);
    
  

    return (
        <div>
            <label for="PAN" class="block mb-2 text-sm font-medium text-left text-black dark:text-navy-200"> Enter OTP<span class="text-xs text-red-600">*</span></label>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                    width: '100%',
                    height: '2.5rem',
                    margin: '0 0.4rem', 
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
           { otpError && <div className='text-red-600 mt-2'>{otpError}</div>} 
        </div>
    )
}

export default InputOtp