import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataAction } from '../Store/Action/SetDataAction'
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from '../Store/ActionName/ActionName'

function MyCheckBox({ placeholder, name, disable, title, error, onChange, important, uppercase, parent,checked }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    const onChangeText = () => {
        const newJson = ApiReducer.apiJson;
        if (parent) {
            if(newJson[parent]){
                if(newJson[parent][name]){
                    newJson[parent] = { ...newJson[parent], [name]: false };
                }else{
                    newJson[parent] = { ...newJson[parent], [name]: true };
                }
            }else{
                newJson[parent] = { ...newJson[parent], [name]: true };
            }
        } else {
            newJson[name] =  newJson[name]?false:true;
        }
        dispatch(setDataAction(newJson, SET_API_JSON));
    };

    return (
        <div>
            <p className='w-full text-black'>{title}{important ? <span className='text-red-600 text-base'>*</span> : ''}</p>
            <input checked={checked?checked:parent?ApiReducer?.apiJson?.[parent]?.[name]:ApiReducer?.apiJson?.[name]} style={{ textTransform: uppercase ? 'uppercase' : '' }} disabled={disable} onChange={onChange ? onChange : (e) => onChangeText(e.target.value)} className='cursor-pointer mt-3 w-5 h-5 outline-none text-md rounded-xl border border-slate-400 placeholder:normal-case hover:border-slate-400 pl-2' type='checkbox' name={name} placeholder={placeholder} />
            <label className='w-full text-red-600'>{error ? title + ' is Required' : ''}</label>
        </div>
    )
}

export default MyCheckBox;