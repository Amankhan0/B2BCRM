import React, { useEffect, useState } from "react";
import MyInput from "../../../Component/MyInput";
import { compileData, panelPermisson, superAdminRoleData } from "./permission";
import Title from "../../../Component/Title";
import { Colors } from "../../../Colors/color";
import MyButton from "../../../Component/MyButton";
import toast from "react-hot-toast";
import { ApiHit } from "../../../utils";
import { addRole, addRoleWithoutIP, addUserWithoutIP, deleteRoleWithoutIP, deleteUserWithoutIP, downloadWithoutIP, searchRoleWithoutIP, searchUserWithoutIP, selectClass, updateRole, updateRoleWithoutIP, updateUserWithoutIP } from "../../../Constants/Constants";

const AddRole = ({ data }) => {

    const [permissionData, setPermissionData] = useState(null)
    const [render, setRender] = useState(Date.now())
    const [loader, setLoader] = useState(false)

    console.log('data',data);
    

    useEffect(() => {
        if (data) {
            var compile = {
                ...data,
                permission: compileData(data.permission).permission
            }
            setPermissionData(compile)
        }
        else if (permissionData === null) {
            setPermissionData(panelPermisson)
        }
    }, [])

    const onClickAddRemovePermission = (index, keyName, ele) => {
        var oldJson = permissionData
        if (oldJson.permission[index].permission[0][keyName]) {
            oldJson.permission[index].permission[0][keyName] = false
            if (keyName === 'read') {
                let newArr = oldJson.allowedEndPoints.filter(item => item !== ele.readEndpoint);
                oldJson.allowedEndPoints = newArr
            } else if (keyName === 'write') {
                let newArr = oldJson.allowedEndPoints.filter(item => !ele.writeEndpoint.includes(item));
                oldJson.allowedEndPoints = newArr
            }
            else if (keyName === 'delete') {
                let newArr = oldJson.allowedEndPoints.filter(item => item !== ele.deleteEndpoint);
                oldJson.allowedEndPoints = newArr
            }
        } else {
            oldJson.permission[index].permission[0][keyName] = true
            if (keyName === 'read') {
                oldJson.allowedEndPoints.push(ele.readEndpoint)
            } else if (keyName === 'write') {
                console.log('oldJson.allowedEndPoints ===',ele);
                panelPermisson?.permission?.[index]?.writeEndpoint?.map((url, i) => {
                    oldJson.allowedEndPoints.push(url)
                })
            }
            else if (keyName === 'delete') {
                oldJson.allowedEndPoints.push(ele.deleteEndpoint)
            }
        }
        setPermissionData(permissionData)
        setRender(Date.now())
    }

    const onClickSubmit = () => {
        if (permissionData.roleName === '') {
            toast.error('Role name is required')
        } else {
            setLoader(true)
            var oldPermissionData = permissionData
            if(oldPermissionData?.roleType === 'superadmin'){
                var json = {
                    roleName : oldPermissionData.roleName,
                    roleType : 'superadmin',
                    permission : superAdminRoleData.permission,
                    allowedEndPoints:superAdminRoleData.allowedEndPoints
                }
                oldPermissionData = json
            }
            if(data){oldPermissionData._id = data._id}            
            ApiHit(oldPermissionData, data ? updateRole : addRole).then(res => {
                setLoader(false)
                if (res.status === 200) {
                    toast.success(data ? 'Role updated successfully' : 'Role added successfully')
                    window.location.pathname = '/role'
                }
            })
        }
    }

    const onChangeRoleName = (value) => {
        var oldJson = permissionData
        oldJson.roleName = value
        setPermissionData(permissionData)
        setRender(Date.now())
    }

    const onChangeRoleType = (value) => {
        var oldJson = permissionData
        oldJson.roleType = value
        setPermissionData(permissionData)
        setRender(Date.now())
    }

console.log('permissionData',permissionData);


    return (
        permissionData !== null &&
        <div className="mt-10 w-1/2 card p-5">
            <Title color={Colors.BLACK} title={'Select Role Type'} size={'lg'} />
            <select className={selectClass} onChange={(e) => onChangeRoleType(e.target.value)}>
                <option value={""} selected={permissionData?.roleType===""}>Select Role</option>
                <option value={'superadmin'} selected={permissionData?.roleType==="superadmin"}>Super Admin</option>
                <option value={'admin'} selected={permissionData?.roleType==="admin"}>Admin</option>
            </select>
            {
                permissionData?.roleType !== "" &&
                <>
                    {
                        <div className="mt-3 mb-3">
                            <MyInput value={permissionData.roleName} onChange={(e) => onChangeRoleName(e.target.value)} title={'Role Name'} placeholder={'Enter Role Name'} />
                        </div>
                    }
                    {
                        permissionData?.roleType === 'admin' &&
                        permissionData.permission.map((ele, i) => {
                            return (
                                <div className="card border mt-5 p-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Title title={ele.value} size={'md'} color={Colors.BLACK} />
                                        </div>
                                        <div className="flex gap-5">
                                            <p onClick={() => onClickAddRemovePermission(i, 'read', ele)} className={`${ele.permission[0].read ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} cursor-pointer p-1 rounded-md`}>Read</p>
                                            <p onClick={() => onClickAddRemovePermission(i, 'write', ele)} className={`${ele.permission[0].write ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} cursor-pointer p-1 rounded-md`}>Write</p>
                                            <p onClick={() => onClickAddRemovePermission(i, 'delete', ele)} className={`${ele.permission[0].delete ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} cursor-pointer p-1 rounded-md`}>Delete</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="mt-5">
                        <MyButton type={loader&&'loader'} onClick={() => onClickSubmit()} title={data ? 'Update' : 'Submit'} />
                    </div>
                </>
            }
        </div>
    )
}

export default AddRole;