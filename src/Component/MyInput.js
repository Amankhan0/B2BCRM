import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataAction } from '../Store/Action/SetDataAction'
import { SET_API_JSON } from '../Store/ActionName/ActionName'

function MyInput({ placeholder, name, disable, title, error, important, uppercase, onChange, parent,value,className }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    const onChangeText = (value) => {
        const newJson = ApiReducer.apiJson;
        if (parent) {
            newJson[parent] = { ...newJson[parent], [name]: value };
        } else {
            newJson[name] = value;
        }
        dispatch(setDataAction(newJson, SET_API_JSON));
    };    

    return (
        <div>
            <p className='w-full text-black'>{title}{important ? <span className='text-red-600 text-base'>*</span> : ''}</p>
            <input style={{ textTransform: uppercase ? 'uppercase' : '' }} disabled={disable} onChange={onChange ? onChange : (e) => onChangeText(e.target.value)} className={`${disable && 'bg-gray-200'} mt-1.5 w-full outline-none h-10 text-md rounded-lg border border-slate-400 placeholder:normal-case hover:border-slate-400 pl-2 ${className&&className}`} value={value?value:parent?ApiReducer?.apiJson?.[parent]?.[name]:ApiReducer?.apiJson?.[name]} name={name} placeholder={placeholder} />
            <p className='w-full text-red-600'>{error&&ApiReducer.apiJsonError[name] ? title + ' is Required' : ''}</p>
        </div>
    )
}

export default MyInput