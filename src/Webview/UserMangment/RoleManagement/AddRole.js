import React, { useEffect, useState } from "react";
import MyInput from "../../../Component/MyInput";
import { panelPermisson } from "./permission";
import Title from "../../../Component/Title";
import { Colors } from "../../../Colors/color";
import MyButton from "../../../Component/MyButton";
import toast from "react-hot-toast";
import { ApiHit } from "../../../utils";
import { addRole } from "../../../Constants/Constants";

const AddRole = () => {

    const [permissionData, setPermissionData] = useState(null)
    const [render, setRender] = useState(Date.now())

    useEffect(() => {
        if (permissionData === null) {
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
                ele.writeEndpoint.map((url, i) => {
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
        if(permissionData.roleName === ''){
            toast.error('Role name is required')
        }else{
            console.log('permissionData',permissionData);
            
            ApiHit(permissionData,addRole).then(res=>{
                if(res.status === 200){
                    toast.success('Role added successfully')
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

    console.log('permissionData', permissionData);

    return (
        permissionData !== null &&
        <div className="mt-10 w-1/3 card p-5">
            <div>
                <MyInput value={permissionData.roleName} onChange={(e) => onChangeRoleName(e.target.value)} title={'Role Name'} placeholder={'Enter Role Name'} />
            </div>
            {
                permissionData.permission.map((ele, i) => {
                    return (
                        <div className="card border mt-5 p-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Title title={ele.value} size={'md'} color={Colors.BLACK} />
                                </div>
                                <div className="flex gap-5">
                                    <p onClick={() => onClickAddRemovePermission(i, 'read', ele)} className={`${ele.permission[0].read ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} p-1 rounded-md`}>Read</p>
                                    <p onClick={() => onClickAddRemovePermission(i, 'write', ele)} className={`${ele.permission[0].write ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} p-1 rounded-md`}>Write</p>
                                    <p onClick={() => onClickAddRemovePermission(i, 'delete', ele)} className={`${ele.permission[0].delete ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'} p-1 rounded-md`}>Delete</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div className="mt-5">
                <MyButton onClick={() => onClickSubmit()} title={'Submit'} />
            </div>
        </div>
    )
}

export default AddRole;