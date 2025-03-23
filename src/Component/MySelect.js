import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataAction } from '../Store/Action/SetDataAction'
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from '../Store/ActionName/ActionName'

function MySelect({ selectedValue, name, disable, title, error, createTripJson, important, uppercase, options, onChange,keyName }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    const onChangeText = (value) => {
        if (createTripJson) {
            var oldJson = ApiReducer?.createTripJson
            if (typeof oldJson.driverDetails[0] === 'object') {
                oldJson.driverDetails[0][name] = value
            } else {
                oldJson.driverDetails[0] = { [name]: value }
            }
            dispatch(setDataAction(oldJson, SET_CREATE_TRIP_JSON))
        } else {
            var oldJson = ApiReducer?.apiJson
            oldJson[name] = value
            dispatch(setDataAction(oldJson, SET_API_JSON))
        }
    }

    return (
        <div>
            <label className='w-full text-black'>{title}{important ? <span className='text-red-600 text-base'>*</span> : ''}</label>
            <select style={{ textTransform: uppercase ? 'uppercase' : '' }} disabled={disable} onChange={onChange ? onChange : (e) => onChangeText(e.target.value)} className={`${disable && 'bg-gray-200'} mt-1 w-full outline-none h-10 text-md rounded-lg border border-slate-400 placeholder:normal-case hover:border-slate-400 pl-2`} name={name}>
                {!selectedValue && <option value={''}>Select Item</option>}
                {
                    options?.map((option, index) => {
                        return (
                            <option value={keyName === 'varientName'?option.varientName+option.varientUnit:option._id} selected={selectedValue === option}>{option?.[keyName]}</option>
                        )
                    })
                }
            </select>
            <label className='w-full text-red-600'>{error ? title + ' is Required' : ''}</label>
        </div>
    )
}

export default MySelect;