import React from 'react'
import MyInput from '../Component/MyInput'
import { Colors } from '../Colors/color'
import { useSelector } from 'react-redux';
import LocationInformation from './LocationInformation';
import MyVehicleTypeInput from '../Component/MyVehicleTypeInput';
import DatePicker from '../Component/DatePicker';
import MyButton from '../Component/MyButton';
import { ApiHit, finalCreateJson } from '../utils';
import GMap from './GMap';
import { CreateTripApi } from '../Constants/Constants';
import { getTrackYourTransportUser } from '../Storage/Storage';

function CreateTrip() {

  const ApiReducer = useSelector(state => state.ApiReducer)

  var editPage = window.location.pathname.split('/')[2]

  var user = getTrackYourTransportUser()

  const onSubmit = () => {
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

      console.log('oldJson',oldJson);

      ApiHit(oldJson, CreateTripApi).then(result => {
        console.log('res', result);
      })
    })
  }

  console.log('ApiReducer?.createTripJson---', ApiReducer?.createTripJson);

  return (
    <div className=' m-5'>
      <div className='grid grid-cols-2 gap-10'>
        <div className='bg-white'>
          <div className="mb-2">
            <p className='p-2 text-white font-bold rounded-lg' style={{ background: Colors.ThemeBlue }}>Basic Details</p>
          </div>
          <div className='grid grid-cols-2 gap-6 p-3 bg-white rounded-b-xl'>
            <DatePicker name='genratedDate' title={ApiReducer.tripForm === 'withoutEway' ? 'Created On' : 'Generated on'} placeholder={ApiReducer.tripForm === 'withoutEway' ? 'Enter created date' : 'Enter generated date'} important={true} currentTime={true} />
            <DatePicker name='eWayBillValidity' title={ApiReducer.tripForm === 'withoutEway' ? 'Valid Till' : 'Valid Upto'} placeholder={ApiReducer.tripForm === 'withoutEway' ? 'Enter validity' : 'valid upto'} important={true} MidNight={true} />
            <MyInput createTripJson name={'driverName'} title={'Driver Name'} placeholder={'Driver Name'} />
            <MyInput createTripJson name={'driverContact'} title={'Driver Contact'} placeholder={'Driver Contact'} />
            <MyInput createTripJson name={'vehicleNumber'} title={'Vehicle Number'} placeholder={'Vehicle Number'} />
            <MyVehicleTypeInput createTripJson name={'vehicleType'} />
          </div>
          <LocationInformation />
        </div>
        <GMap
          srcLatLngArr={[editPage === 'edit' ? ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lat : ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lat(), editPage === 'edit' ? ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lng : ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lng()]}
          desLatLngArr={[editPage === 'edit' ? ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lat : ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lat(), editPage === 'edit' ? ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lng : ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lng()]}
          routeArr={ApiReducer?.apiJson?.tollGuruGeo?.routeArr}
          srcName={ApiReducer?.apiJson?.sourceLocation?.formatted_address}
          desName={ApiReducer?.apiJson?.destinationLocation?.formatted_address}
        />
      </div>
      <div className='mt-5'>
        <MyButton onClick={() => onSubmit()} width={'24'} title={'Submit'} />
      </div>
    </div>
  )
}

export default CreateTrip;