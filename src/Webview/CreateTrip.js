import React, { useState } from 'react'
import MyInput from '../Component/MyInput'
import { Colors } from '../Colors/color'
import { useDispatch, useSelector } from 'react-redux';
import LocationInformation from './LocationInformation';
import MyVehicleTypeInput from '../Component/MyVehicleTypeInput';
import DatePicker from '../Component/DatePicker';
import MyButton from '../Component/MyButton';
import { ApiHit, finalCancelCreateJson, finalCreateJson } from '../utils';
import GMap from './GMap';
import { CreateTripApi, UpdateTrip } from '../Constants/Constants';
import { getTrackYourTransportUser } from '../Storage/Storage';
import toast from 'react-hot-toast';
import { setDataAction } from '../Store/Action/SetDataAction';
import { SET_API_JSON } from '../Store/ActionName/ActionName';

function CreateTrip() {

  const ApiReducer = useSelector(state => state.ApiReducer)
  const [loader, setLoader] = useState(false)

  var editPage = window.location.pathname.split('/')[3]

  var user = getTrackYourTransportUser()
  const dispatch = useDispatch()

  const onSubmit = () => {
      if(!ApiReducer?.apiJson?.eWayBillValidity){
        toast.error('Trip end date and time (ETA) is required')
      }
      else if(!ApiReducer?.createTripJson?.driverDetails?.[0]?.vehicleNumber){
        toast.error('Vehicle number is required')
      }
      else if(!ApiReducer?.createTripJson?.driverDetails?.[0]?.vehicleType){
        toast.error('Vehicle type is required')
      }
      else if(!ApiReducer?.apiJson?.sourceLocation){
        toast.error('Source location is required')
      }
      else if(!ApiReducer?.apiJson?.destinationLocation){
        toast.error('Destination location is required')
      }
      else if(!ApiReducer?.apiJson?.tollGuruGeo){
        toast.error('Please select route')
      }
      else{
        let confirmation = false
        if(!ApiReducer?.apiJson?.genratedDate){
          confirmation = window.confirm('bla bla')
        }else{
          confirmation = true
        }
        if(confirmation) {
          setLoader('submit')
          finalCreateJson(ApiReducer, user).then(res => {
            var oldJson = res
            var vehicleTollDetails = []
            var newGeometry = {}
            oldJson.driverDetails.map((ele, index) => {
              vehicleTollDetails.push({
                vehicleNumber: ele?.vehicleNumber,
                axles: ele?.axles,
                tollsArr: {
                  tolls: ele?.tollInfo?.routes[oldJson?.geometry?.selectedIndex].tolls,
                  summary: ele?.tollInfo?.routes[oldJson?.geometry?.selectedIndex].summary,
                  costs: ele?.tollInfo?.routes[oldJson?.geometry?.selectedIndex].costs,
                }
              })
            })
            newGeometry.vehicleInformationWithToll = vehicleTollDetails
            newGeometry.polyline = oldJson?.geometry?.polyline
            newGeometry.routeArr = oldJson?.geometry?.routeArr
            oldJson.geometry = newGeometry
    
            console.log('oldJson', oldJson);
    
            ApiHit(oldJson, CreateTripApi).then(result => {
              setLoader(false)
              if (result?.status === 404) {
                toast.error('Vehicle already in a trip')
              } else if (result?.status === 200) {
                window.location.pathname = '/army/trip/view'
              }
            })
          })
        }
      }
  }

  console.log('ApiReducer?.createTripJson---', ApiReducer);

  const onClickCancel = () => {
    var confirmation = window.confirm('Are you sure to cancel this trip ?')
    if (confirmation) {
      setLoader(true)
      var json = {
        "status": {
          msg: 'Trip Cancel',
          value: 'Cancelled',
          timestamp: Date.now()
        },
        "_id": window.location.pathname.split('/')[4]
      }
      console.log(json);
      ApiHit(json, UpdateTrip).then(result => {
        setLoader(false)
        if (result?.status === 404) {
          toast.error('Vehicle already in a trip')
        } else if (result?.status === 200) {
          window.location.pathname = '/army/trip/view'
        }
      })
    }
  }

  const onUpdate = () => {
    setLoader('update')
    var json = {
      "genratedDate":ApiReducer?.apiJson?.genratedDate,
      "eWayBillValidity":ApiReducer?.apiJson?.eWayBillValidity,
      "driverDetails":ApiReducer?.createTripJson?.driverDetails,
      "_id": window.location.pathname.split('/')[4]
    }
    console.log('json',json);
    ApiHit(json, UpdateTrip).then(result => {
      setLoader(false)
      if (result?.status === 404) {
        toast.error('Vehicle already in a trip')
      } else if (result?.status === 200) {
        window.location.pathname = '/army/trip/view'
      }
    })
  }

  return (
    <div className=' m-5'>
      <div className='grid grid-cols-2 gap-10'>
        <div className='bg-white'>
          <div className="mb-2">
            <p className='p-2 text-white font-bold rounded-lg' style={{ background: Colors.ThemeBlue }}>Basic Details</p>
          </div>
          <div className='grid grid-cols-2 gap-6 p-3 bg-white rounded-b-xl'>
            <DatePicker dateOption={{ enableTime: true, time_24hr: false }} name='genratedDate' title={'Trip start date & time (ETD)'} placeholder={'Trip start date & time (ETD)'} currentTime={true} />
            <DatePicker dateOption={{ enableTime: true, time_24hr: false }} name='eWayBillValidity' title={'Trip end date and time (ETA)'} placeholder={'Trip end date and time (ETA)'} important={true} MidNight={true} />
            <MyInput createTripJson name={'driverName'} title={'Driver Name'} placeholder={'Driver Name'} />
            <MyInput createTripJson name={'driverContact'} title={'Driver Contact'} placeholder={'Driver Contact'} />
            <MyInput important={true} disable={editPage === 'edit'} createTripJson name={'vehicleNumber'} title={'Vehicle Number'} placeholder={'Vehicle Number'} />
            <MyVehicleTypeInput editpage={editPage === 'edit'} createTripJson name={'vehicleType'} />
          </div>
          <LocationInformation editPage={editPage === 'edit'} />
        </div>
        <GMap
          srcLatLngArr={[editPage === 'edit' ? ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lat : ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lat(), editPage === 'edit' ? ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lng : ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lng()]}
          desLatLngArr={[editPage === 'edit' ? ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lat : ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lat(), editPage === 'edit' ? ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lng : ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lng()]}
          routeArr={ApiReducer?.apiJson?.tollGuruGeo?.routeArr}
          srcName={ApiReducer?.apiJson?.sourceLocation?.formatted_address}
          desName={ApiReducer?.apiJson?.destinationLocation?.formatted_address}
        />
      </div>
      <div className='mt-5 flex gap-2'>
        {
          editPage === 'edit' ?
            <MyButton type={loader === 'update' ? 'loader' : ''} onClick={() => onUpdate()} width={'24'} title={'Update'} />
            :
            <MyButton type={loader === 'submit' ? 'loader' : ''} onClick={() => onSubmit()} width={'24'} title={'Submit'} />
        }
        {
          editPage === 'edit' &&
          <MyButton bg={'gray'} type={loader ? 'loader' : ''} onClick={() => onClickCancel()} width={'24'} title={'Cancel Trip'} />
        }
      </div>
    </div>
  )
}

export default CreateTrip;