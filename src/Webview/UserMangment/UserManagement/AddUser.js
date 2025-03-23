import React, { useEffect, useState } from "react";
import MyInput from "../../../Component/MyInput";
import Title from "../../../Component/Title";
import { Colors } from "../../../Colors/color";
import MyButton from "../../../Component/MyButton";
import toast from "react-hot-toast";
import { ApiHit, ObjIsEmpty, regexEmail } from "../../../utils";
import { searchRole, selectClass } from "../../../Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { checkAddUserValidation } from "./checkAddUserValidation";
import { setDataAction } from "../../../Store/Action/SetDataAction";
import { SET_API_JSON_ERROR } from "../../../Store/ActionName/ActionName";

const AddUser = () => {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const dispatch = useDispatch()
    const [roleData, setRoleData] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)

    useEffect(() => {
        if (roleData === null) {
            fetchRole()
        }
    }, [])

    const fetchRole = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {

            }
        }
        ApiHit(json, searchRole).then(res => {
            if (res.content) {
                setRoleData(res.content)
            }
        })
    }

    const onClickSubmit = () => {
        if (selectedRole === null) {
            toast.error('Role is required')
        } else {
            checkAddUserValidation(ApiReducer.apiJson).then(res => {
                if (!ObjIsEmpty(res)) {
                    dispatch(setDataAction(res, SET_API_JSON_ERROR))
                } else {
                    var json = ApiReducer.apiJson
                    json.roleId = roleData?.[selectedRole]?._id
                    json.roleName = roleData?.[selectedRole]?.roleName
                }
            })
        }
    }

    console.log(ApiReducer?.apiJson);


    return (
        roleData !== null &&
        <div className="mt-10 w-1/2 card p-5">
            <div>
                <div className="mb-4 w-1/2">
                    <Title title={'Select Role'} size={'md'} color={Colors.BLACK} />
                    <select className={selectClass} onChange={(e) => setSelectedRole(e.target.value)}>
                        <option selected={selectedRole === null} value={null}>Select Role</option>
                        {
                            roleData.map((ele, i) => {
                                return (
                                    <option selected={selectedRole !== null && roleData?.[selectedRole]?.roleName === ele.roleName} value={i}>{ele.roleName}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <MyInput name={'firstName'} placeholder={'Enter first name'} title={'First Name'} error={ApiReducer?.apiJson?.firstName === '' ? true : !ApiReducer?.apiJson?.firstName ? true : !ApiReducer?.apiJsonError?.firstName ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'lastName'} placeholder={'Enter last name'} title={'Last Name'} error={ApiReducer?.apiJson?.lastName === '' ? true : !ApiReducer?.apiJson?.lastName ? true : !ApiReducer?.apiJsonError?.lastName ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'contact'} placeholder={'Enter contact'} title={'Contact'} error={ApiReducer?.apiJson?.contact?.length === 10 ? false : ApiReducer?.apiJson?.contact?.length !== 10 ? true : !ApiReducer?.apiJsonError?.contact ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'email'} placeholder={'Enter email'} title={'Email'} error={regexEmail.test(ApiReducer?.apiJson?.email) ? false : !regexEmail.test(ApiReducer?.apiJson?.email) ? true : ApiReducer?.apiJsonError?.email ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'country'} placeholder={'Enter country'} title={'Country'} error={ApiReducer?.apiJson?.country === '' ? true : !ApiReducer?.apiJson?.country ? true : !ApiReducer?.apiJsonError?.country ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'address'} placeholder={'Enter address'} title={'Address'} error={ApiReducer?.apiJson?.address === '' ? true : !ApiReducer?.apiJson?.address ? true : !ApiReducer?.apiJsonError?.address ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'pinCode'} placeholder={'Enter pinCode'} title={'Pincode'} error={ApiReducer?.apiJson?.pinCode === '' ? true : !ApiReducer?.apiJson?.pinCode ? true : !ApiReducer?.apiJsonError?.pinCode ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'landmark'} placeholder={'Enter Landmark'} title={'Landmark'} error={ApiReducer?.apiJson?.landmark === '' ? true : !ApiReducer?.apiJson?.landmark ? true : !ApiReducer?.apiJsonError?.landmark ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'state'} placeholder={'Enter state'} title={'State'} error={ApiReducer?.apiJson?.state === '' ? true : !ApiReducer?.apiJson?.state ? true : !ApiReducer?.apiJsonError?.state ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'city'} placeholder={'Enter city'} title={'City'} error={ApiReducer?.apiJson?.city === '' ? true : !ApiReducer?.apiJson?.city ? true : !ApiReducer?.apiJsonError?.city ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'username'} placeholder={'Enter username'} title={'Username'} error={ApiReducer?.apiJson?.username === '' ? true : !ApiReducer?.apiJson?.username ? true : !ApiReducer?.apiJsonError?.username ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'password'} placeholder={'Enter password'} title={'Password'} error={ApiReducer?.apiJson?.password === '' ? true : !ApiReducer?.apiJson?.password ? true : !ApiReducer?.apiJsonError?.password ? true : false} />
                    </div>
                    <div>
                        <MyInput name={'confirmPassword'} placeholder={'Enter confirm password'} title={'Confirm Password'} error={ApiReducer?.apiJson?.confirmPassword === '' ? true : !ApiReducer?.apiJson?.confirmPassword ? true : !ApiReducer?.apiJsonError?.confirmPassword ? true : false} />
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <MyButton onClick={() => onClickSubmit()} title={'Submit'} />
            </div>
        </div>
    )
}

export default AddUser;