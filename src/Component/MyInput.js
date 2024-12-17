import React from 'react'
import { useSelector } from 'react-redux'
import { setDataAction } from '../Store/Action/SetDataAction'
import { SET_API_JSON } from '../Store/ActionName/ActionName'

function MyInput({ placeholder, name, value, title, error, errorMsg }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const onChange = (value) =>{
        var oldJson = ApiReducer?.apiJson
        oldJson[name] = value
        setDataAction(oldJson,SET_API_JSON)
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