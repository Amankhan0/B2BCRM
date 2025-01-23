import React from 'react'
import LoginInput from '../Component/Input/LoginInput';
import BeforeLoginButton from '../Component/BeforeLoginButton';
import { ApiHit, secretKey, STROGNPASSWORD } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../Store/Action/SetDataAction';
import { SET_API_JSON_ERROR } from '../Store/ActionName/ActionName';
import { VerifyPasswordValidation } from '../ValidationScheema/PasswordValidate';
import { login } from '../Constants/Constants';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';


function ChangePassword() {

    const ApiReducer = useSelector((state) => state.ApiReducer);

    const dispatch = useDispatch();

    const handleSave = () => {
        ApiReducer.apiJsonError = {}
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        VerifyPasswordValidation(ApiReducer).then((error) => {
            dispatch(setDataAction(error, SET_API_JSON_ERROR))

            if (Object.keys(error).length === 0) {
                let json = {
                    email: ApiReducer?.apiJson?.email,
                    password: ApiReducer?.apiJson?.password,
                    action: 'npg'
                }

                if (ApiReducer.apiJson.password) {
                    var encryption = CryptoJS.AES.encrypt(JSON.stringify(json?.password), secretKey).toString();
                    json.password = encryption
                }

                console.log("json", json);

                ApiHit(json, login).then((res) => {
                    console.log("res", res);

                    if (res?.doc?.message === "Password changed successfully") {
                        toast.success('Password Updated Successfully')
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
                    }
                })


            }
        })
    }

    return (
        <div>
            <LoginInput defaultValue={ApiReducer.apiJson.password ? ApiReducer.apiJson.password : ''} imp={true} label={'New Password'} name={'password'} error={!STROGNPASSWORD.test(ApiReducer.apiJson.password)} />
            <LoginInput imp={true} label={'Confirm Password'} name={'confirmPassword'} error={(ApiReducer?.apiJson?.confirmPassword !== ApiReducer?.apiJson?.password || ApiReducer?.apiJson?.confirmPassword === undefined)} />
            <BeforeLoginButton title={'Save'} onClick={handleSave} />
        </div>
    )
}

export default ChangePassword