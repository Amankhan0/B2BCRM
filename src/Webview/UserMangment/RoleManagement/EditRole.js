import React, { useEffect, useState } from "react";
import AddRole from "./AddRole";
import { ApiHit } from "../../../utils";
import { search } from "../../../SVG/Icons";
import { searchRole } from "../../../Constants/Constants";
import toast from "react-hot-toast";

const EditAddRole = () => {

    const [data,setData] = useState(null)

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
        ApiHit(json,searchRole).then(res=>{
            if(res?.content){
                setData(res?.content?.[0])
            }else{
                toast.error(res?.messgae||'Something went wrong')
            }
        })
    }
    
    return (
        data &&
       <AddRole data={data}/>
    )
}

export default EditAddRole;