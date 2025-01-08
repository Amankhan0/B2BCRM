import React, { useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import { CalenderIcon } from '..//SVG/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetFullYear } from '../utils';
import { setDataAction } from '../Store/Action/SetDataAction';
import { SET_API_JSON } from '../Store/ActionName/ActionName';

function DatePicker({ register, date, enableTime, title, important, placeholder, name, className, dateOption, disabled, inputStyleType, currentTime, MidNight }) {

  const ApiReducer = useSelector(state => state.ApiReducer)
  const dispatch = useDispatch()

  const handleStart = (selectedDate, name) => {

    console.log('selectedDate',selectedDate);
    console.log('name',name);

    const date = new Date(selectedDate);

    var json = ApiReducer.apiJson;
      Object.assign(json, { [name]: date.getTime() });
      dispatch(setDataAction(json, SET_API_JSON));

    // if (currentTime) {
    //   const currentDate = new Date();
    //   selectedDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    //   console.log("handleStart", { selectedDate, name });
    //   const d = selectedDate.getTime();
    //   var json = ApiReducer.apiJson;
    //   Object.assign(json, { [name]: d });
    //   dispatch(setDataAction(json, SET_API_JSON));
    // }
    // else if (MidNight) {
    //   selectedDate.setHours(23, 59, 59, 999);
    //   console.log("handleStart", { selectedDate, name });
    //   const d = selectedDate.getTime();
    //   var json = ApiReducer.apiJson;
    //   Object.assign(json, { [name]: d });
    //   dispatch(setDataAction(json, SET_API_JSON));
    // }
    // else {
    //   var d = selectedDate.getTime();
    //   var json = ApiReducer.apiJson
    //   Object.assign(json, { [name]: d })
    //   dispatch(setDataAction(json, SET_API_JSON))
    // }
  }

  return (
    <div>
      {
        inputStyleType === 1 ?
          <label className="relative flex">
            <Flatpickr disabled={disabled} placeholder={placeholder ? placeholder : 'dd-mm-yyyy'}
              options={enableTime?{...dateOption, enableTime: true, time_24hr: false}:dateOption} 
              value={ApiReducer?.apiJson[name]}
              onChange={([date]) => {
                handleStart(date, name)
              }}
              className={`form-input peer w-full bg-transparent border-b text-white placeholder:text-white border-white h-12 cursor-pointer pl-9 placeholder:text-slate-400/70   ${className}`} />
            <span className="absolute flex items-center justify-center w-10 h-full pointer-events-none text-slate-400 peer-focus:text-[#0885a6]"> {CalenderIcon}</span>
          </label>
          :
          <>
            <h2 className=" mb-2 tracking-wide text-black line-clamp-1">{title}{important ? <span className='text-red-600 text-base'>*</span> : ''}</h2>
            <label className="relative flex">
              <Flatpickr
                enableTime={true}
                disabled={disabled}
                placeholder={placeholder ? placeholder : 'dd-mm-yyyy'}
                options={enableTime?{...dateOption, enableTime: true, time_24hr: false}:dateOption} 
                value={ApiReducer?.apiJson[name]}
                onChange={([date]) => { handleStart(date, name) }}
                className={` form-input peer w-full rounded-xl border border-slate-400 ${!disabled?'bg-white':'bg-slate-200'} h-12 cursor-pointer pl-9 placeholder:text-slate-500 placeholder:text-[14px] hover:border-slate-400  ${className}`} />
              <span className="absolute flex items-center justify-center w-10 h-full pointer-events-none text-slate-400 peer-focus:text-[#0885a6]"> {CalenderIcon}</span>
            </label>
            {ApiReducer?.apiJsonError[name] ? <label className="text-red-600">{ApiReducer.apiJsonError[name]}</label> : ''}
          </>
      }

    </div>
  )
}

export default DatePicker;