import React from 'react'
import MyInput from '../Component/MyInput'
import { Colors } from '../Colors/color'
import { useSelector } from 'react-redux';
import LocationInformation from './LocationInformation';
import MyVehicleTypeInput from '../Component/MyVehicleTypeInput';
import DatePicker from '../Component/DatePicker';
import MyButton from '../Component/MyButton';
import { finalCreateJson } from '../utils';
import GMap from './GMap';

function CreateTrip() {

  const ApiReducer = useSelector(state => state.ApiReducer)

  var editPage = window.location.pathname.split('/')[2]

  const onSubmit = () => {
    finalCreateJson(ApiReducer,).then(res => {
      console.log('res', res);
    })
  }

  console.log('ApiReducer', ApiReducer);

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
            <MyInput name={'driverName'} title={'Driver Name'} placeholder={'Driver Name'} />
            <MyInput name={'driverContact'} title={'Driver Contact'} placeholder={'Driver Contact'} />
            <MyInput name={'vehicleNumber'} title={'Vehicle Number'} placeholder={'Vehicle Number'} />
            <MyVehicleTypeInput name={'vehicleType'} />
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