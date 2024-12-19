import React from 'react'
import LoginInput from '../../Component/Input/LoginInput'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import { ApiHit, regexEmail, secretKey } from '../../utils'
import { useSelector } from 'react-redux';
import { changePassword } from '../../Constants/Constants';
import { getTrackYourTransportUser } from '../../Storage/Storage';
import CryptoJS from 'crypto-js';


function ChangePassword() {
  const ApiReducer = useSelector((state) => state.ApiReducer);
  const user = getTrackYourTransportUser()
  console.log("user", user);


  console.log("ApiReducer", ApiReducer);

  const handleUpdatePassword = () => {
    let json = {
      userID: user?._id,
      oldPassword: ApiReducer?.apiJson?.oldPassword,
      newPassword: ApiReducer?.apiJson?.newPassword
    }

    if (ApiReducer.apiJson.oldPassword) {
      var encryption = CryptoJS.AES.encrypt(JSON.stringify(json?.oldPassword), secretKey).toString();
      json.oldPassword = encryption
    }
    if(ApiReducer.apiJson.newPassword){
      var encryptionnew = CryptoJS.AES.encrypt(JSON.stringify(json?.newPassword), secretKey).toString();
      json.newPassword = encryptionnew

    }


    console.log("json+_+_", json);

    ApiHit(json, changePassword).then((res) => {

      alert('yess')
      console.log("res+_+_", res);
    })

  }


  return (
    <div className='p-4'>
      <LoginInput imp={true} label={'Current Password'} name={'oldPassword'} error={!regexEmail?.test(ApiReducer?.apiJson?.email) || ApiReducer?.apiJsonError?.email} />
      <LoginInput imp={true} label={'New Password'} name={'newPassword'} error={!regexEmail?.test(ApiReducer?.apiJson?.email) || ApiReducer?.apiJsonError?.email} />
      <LoginInput imp={true} label={'Confirm Password'} name={'confirmPassword'} error={!regexEmail?.test(ApiReducer?.apiJson?.email) || ApiReducer?.apiJsonError?.email} />
      <BeforeLoginButton title={'UPDATE PASSWORD'} onClick={handleUpdatePassword} />


    </div>
  )
}

export default ChangePassword