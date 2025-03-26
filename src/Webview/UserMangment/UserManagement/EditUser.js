import React, { useEffect, useState } from "react";
import { ApiHit } from "../../../utils";
import { searchUser } from "../../../Constants/Constants";
import toast from "react-hot-toast";
import AddUser from "./AddUser";
import { useDispatch } from "react-redux";
import { setDataAction } from "../../../Store/Action/SetDataAction";
import { SET_API_JSON } from "../../../Store/ActionName/ActionName";

const EditUser = () => {

    const [data,setData] = useState(null)
    const dispatch = useDispatch()
    var id = window.location.pathname.split('/')[2]
    useEffect(()=>{
        if(id && data === null){
            fetchRoleData()
        }
    },[])

    const fetchRoleData = () =>{
        var json = {
            page:1,
            limit:1,
            search:{
                _id:id
            }
        }
        ApiHit(json,searchUser).then(res=>{
            if(res?.content){
                dispatch(setDataAction(res?.content?.[0],SET_API_JSON))
                setData(true)
            }else{
                toast.error(res?.messgae||'Something went wrong')
            }
        })
    }
    
    return (
        data &&
       <AddUser edit={true}/>
    )
}

export default EditUser;