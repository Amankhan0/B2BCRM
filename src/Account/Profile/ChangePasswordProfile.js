import React from 'react'
import LoginInput from '../../Component/Input/LoginInput'
import BeforeLoginButton from '../../Component/BeforeLoginButton'
import { ApiHit, regexEmail, secretKey, STROGNPASSWORD } from '../../utils'
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../Constants/Constants';
import { getTrackYourTransportUser } from '../../Storage/Storage';
import CryptoJS from 'crypto-js';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import { ChangePasswordValidation } from '../../ValidationScheema/Login/ChangePassword';


function ChangePasswordProfile() {
  const ApiReducer = useSelector((state) => state.ApiReducer);
  const user = getTrackYourTransportUser()
  console.log("user", user);
  const dispatch = useDispatch();


  console.log("ApiReducer", ApiReducer);

  // const handleUpdatePassword = () => {
  //   ApiReducer.apiJsonError = {}
  //   dispatch(setDataAction({}, SET_API_JSON_ERROR))

  //   ChangePasswordValidation(ApiReducer).then((error) => {
  //     console.log("error", error);
  //     dispatch(setDataAction(error, SET_API_JSON_ERROR))

  //     if (Object.keys(error).length === 0) {
  //       let json = {
  //         userID: user?._id,
  //         oldPassword: ApiReducer?.apiJson?.oldPassword,
  //         newPassword: ApiReducer?.apiJson?.newPassword
  //       }

  //       if (ApiReducer.apiJson.oldPassword) {
  //         var encryption = CryptoJS.AES.encrypt(JSON.stringify(json?.oldPassword), secretKey).toString();
  //         json.oldPassword = encryption
  //       }
  //       if (ApiReducer.apiJson.newPassword) {
  //         var encryptionnew = CryptoJS.AES.encrypt(JSON.stringify(json?.newPassword), secretKey).toString();
  //         json.newPassword = encryptionnew
  //       }
  //     ApiHit(json, changePassword).then((res) => {
  //       console.log({ json })
  //       console.log("res+_+_", res);
  //       if(res?.message === "Password successfully updated"){
  //         alert(res?.message)
  //         setTimeout(()=>{
  //           window.location.reload()
  //         },1000)
  //       }
  //       else if(res.message === "Old password does not match"){
  //         dispatch(setDataAction({'oldPassword' : "Current Password is worong"}))

  //       }
  //     })

  //     }
    




  //   })



 


  // }

  const handleUpdatePassword = () => {
    // Reset errors in the state
    ApiReducer.apiJsonError = {};
    dispatch(setDataAction({}, SET_API_JSON_ERROR));
  
    // Validate input fields
    ChangePasswordValidation(ApiReducer).then((error) => {
      console.log("Validation error:", error);
      dispatch(setDataAction(error, SET_API_JSON_ERROR));
  
      // If no validation errors, proceed
      if (Object.keys(error).length === 0) {
        let json = {
          userID: user?._id,
          oldPassword: ApiReducer?.apiJson?.oldPassword,
          newPassword: ApiReducer?.apiJson?.newPassword,
        };
  
        if (ApiReducer.apiJson?.oldPassword) {
          const encryptedOldPassword = CryptoJS.AES.encrypt(
            ApiReducer.apiJson.oldPassword,
            secretKey
          ).toString();
          json.oldPassword = encryptedOldPassword;
        }
  
        if (ApiReducer.apiJson?.newPassword) {
          const encryptedNewPassword = CryptoJS.AES.encrypt(
            ApiReducer.apiJson.newPassword,
            secretKey
          ).toString();
          json.newPassword = encryptedNewPassword;
        }
  
        ApiHit(json, changePassword)
          .then((res) => {
            console.log("Payload:", json);
            console.log("API Response:", res);
  
            if (res?.message === "Password successfully updated") {
              alert(res?.message);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            else if (res?.message === "Old password does not match") {
              dispatch(
                setDataAction({ oldPassword: "Current Password is incorrect" })
              );
            }
            else{
              alert(res.message)
            }
          })
          .catch((err) => {
            console.error("API Error:", err);
            alert("Failed to update the password. Please try again later.");
          });
      }
    });
  };
  

  return (
    <div className='p-4'>
      <LoginInput imp={true} label={'Current Password'} name={'oldPassword'} error={!STROGNPASSWORD.test(ApiReducer.apiJson.oldPassword)} />
      <LoginInput type={'password'} imp={true} label={'New Password'} name={'newPassword'} error={!STROGNPASSWORD.test(ApiReducer.apiJson.newPassword)} />
      <LoginInput type={'password'} imp={true} label={'Confirm Password'} name={'confirmPassword'} error={(ApiReducer?.apiJson?.confirmPassword !== ApiReducer?.apiJson?.newPassword || ApiReducer?.apiJson?.confirmPassword === undefined)} />
      <BeforeLoginButton title={'UPDATE PASSWORD'} onClick={handleUpdatePassword} />
    </div>
  )
}

export default ChangePasswordProfile;