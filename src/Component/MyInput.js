import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataAction } from '../Store/Action/SetDataAction'
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from '../Store/ActionName/ActionName'

function MyInput({ placeholder, name, value, title, error, createTripJson }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    const onChange = (value) =>{
        if(createTripJson){
            var oldJson = ApiReducer?.createTripJson
            if(typeof oldJson.driverDetails[0] === 'object'){
                oldJson.driverDetails[0][name] = value
            }else{
                oldJson.driverDetails[0] = {[name] : value}
            }
            
            dispatch(setDataAction(oldJson,SET_CREATE_TRIP_JSON))
        }else{
            var oldJson = ApiReducer?.apiJson
            oldJson[name] = value
            dispatch(setDataAction(oldJson,SET_API_JSON))
        }
    }

    return (
        <div>
            <label className='w-full text-black'>{title}</label>
            <input onChange={(e)=>onChange(e.target.value)} className='mt-2 w-full outline-none h-12 text-md rounded-xl border border-slate-400 hover:border-slate-400 pl-2' value={value} name={name} placeholder={placeholder} />
            <label className='w-full text-red-600'>{error ? title+' is Required' : ''}</label>
        </div>
    )
}

export default MyInput