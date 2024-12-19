import React, { useState } from 'react';
import Title from './Title';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../Store/Action/SetDataAction';
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from '../Store/ActionName/ActionName';

function MyVehicleTypeInput({ createTripJson, name }) {

  const ApiReducer = useSelector(state => state.ApiReducer)
  const dispatch = useDispatch()

  const [truckHide, setTruckHide] = useState(false)

  const onSetVehicleType = (value,axles) => {
    if (createTripJson) {
      var oldJson = ApiReducer?.createTripJson
      if (typeof oldJson.driverDetails[0] === 'object') {
        oldJson.driverDetails[0][name] = value
        oldJson.driverDetails[0].axles = axles
      } else {
        oldJson.driverDetails[0] = { [name]: value }
      }
      dispatch(setDataAction(oldJson, SET_CREATE_TRIP_JSON))
      setTruckHide(false)
    } else {
      var oldData = ApiReducer?.apiJson
      oldData[name] = value
      dispatch(setDataAction(oldData, SET_API_JSON))
      setTruckHide(false)
    }
  }

  return (
    <div className="mt">
      <div className="flex">
        <Title title='Vehicle Type' color='black' size='md' />
        <span className="text-lg text-red-600">*</span>
      </div>
      <div onClick={() => setTruckHide(true)} className={`cursor-pointer bg-white outline-none h-12 w-full text-base rounded-xl border border-slate-400 hover:border-slate-400 p-3 text-gray-400 flex justify-between`}>
        <p>{ApiReducer?.createTripJson?.driverDetails?.[0]?.vehicleType ? ApiReducer?.createTripJson?.driverDetails?.[0]?.vehicleType : 'Select Vehicle Type'}</p>
        <svg className="w-2.5 h-2.5 ms-3 mt-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg>
      </div>
      {ApiReducer?.apiJsonError[name] ? <label className="text-red-600">{ApiReducer.apiJsonError[name]}</label> : ''}
      {<span>{''}</span>}
      {
        truckHide &&
        <div className="border rounded-xl m-2 absolute bg-white z-10">
          <div onClick={() => onSetVehicleType('2AxlesTruck', 2)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">2 Axles</p>
            <img className="w-12 h-7" src='https://cdn.tollguru.com/github/Asia/2AxlesTruck.png' />
          </div>
          <div onClick={() => onSetVehicleType('3AxlesTruck', 3)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">3 Axles</p>
            <img className="w-14 h-7" src='https://cdn.tollguru.com/github/Asia/3AxlesTruck.png' />
          </div>
          <div onClick={() => onSetVehicleType('4AxlesTruck', 4)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">4 Axles</p>
            <img className="w-16 h-7" src='https://cdn.tollguru.com/github/Asia/4AxlesTruck.png' />
          </div>
          <div onClick={() => onSetVehicleType('5AxlesTruck', 5)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">5 Axles</p>
            <img className="w-18 h-7" src='https://cdn.tollguru.com/github/Asia/5AxlesTruck.png' />
          </div>
          <div onClick={() => onSetVehicleType('6AxlesTruck', 6)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">6 Axles</p>
            <img className="w-20 h-7" src='https://cdn.tollguru.com/github/Asia/6AxlesTruck.png' />
          </div>
          <div onClick={() => onSetVehicleType('7AxlesTruck', 7)} className="flex cursor-pointer gap-10 justify-between hover:bg-gray-100 p-2 rounded-xl">
            <p className="self-center">7 Axles</p>
            <img className="w-22 h-7" src='https://cdn.tollguru.com/github/Asia/7AxlesTruck.png' />
          </div>
        </div>
      }
    </div>
  )
}

export default MyVehicleTypeInput;