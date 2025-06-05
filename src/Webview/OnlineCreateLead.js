import React, { useEffect, useState } from "react";
import CreateLead from "./Lead/CreateLead";
import { useDispatch, useSelector } from "react-redux";
import { setDataAction } from "../Store/Action/SetDataAction";
import { SET_API_JSON } from "../Store/ActionName/ActionName";

const OnlineCreateLead = () => {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const dispatch = useDispatch();
    const [done,setDone] = useState(false)

    useEffect(()=>{
        if(!done){
            var oldJson = ApiReducer.apiJson
            oldJson = {
                customerDetails:{
                    name: "Aman",
                    contact: "0123456789",
                    leadSource:"online"
                }
            }
            dispatch(setDataAction(oldJson, SET_API_JSON))
            setDone(true)
        }
    },[])


    return (
        <div className='mt-10'>
           <CreateLead/>
        </div>
    );
}

export default OnlineCreateLead;