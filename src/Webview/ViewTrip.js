import React, { useEffect } from 'react'
import { ApiHit, GetFullYearWithTime } from '../utils'
import { getTrip } from '../Constants/Constants'
import { getTrackYourTransportUser } from '../Storage/Storage'
import DataTable from '../Component/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import { setTripData } from '../Store/Action/TripAction'
import { smallmapIcon } from '../SVG/Icons'
import { NavLink } from 'react-router-dom'

function ViewTrip() {

  const TripReducer = useSelector(state => state.TripReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    fetchData()
  }, [])

  var user = getTrackYourTransportUser()

  const fetchData = () => {
    var json = {
      page: 1,
      limit: 10,
      search: {
        // user_id:user?._id
      }
    }
    ApiHit(json, getTrip).then(res => {
      if (res?.status === 200) {
        dispatch(setTripData(res?.doc))
      }
    })
  }

  console.log('TripReducer', TripReducer);
  const th = ["#", 'Trip Ref Number','Trip created at','Start Date','End Date', 'Source Location', 'Destination Location', 'Driver Name', 'Driver Contact', 'Action']

  let TD;
  if (TripReducer?.doc !== null) {
    if (TripReducer?.doc?.docs?.length !== 0) {
      TD = TripReducer?.doc?.docs.map((element, index) => {
        return (
          <tr key={index}>
            <td className='p-2 border'>{index + 1}</td>
            <td className='p-2 border'>{element?.code}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.created_at)}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.eWayBillDetails?.[0]?.genratedDate)}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.eWayBillDetails?.[0]?.eWayBillValidity)}</td>
            <td className='p-2 border'>{element?.locationDetails?.[0]?.sourceLocation?.name}</td>
            <td className='p-2 border'>{element?.locationDetails?.[0]?.destinationLocation?.name}</td>
            <td className='p-2 border'>{element?.driverDetails?.[0]?.driverName ? element?.driverDetails?.[0]?.driverName : '-'}</td>
            <td className='p-2 border'>{element?.driverDetails?.[0]?.driverContact ? element?.driverDetails?.[0]?.driverContact : '-'}</td>
            <td className='p-2 border'>
              {
                // trackMapAction !== 'false' &&
                <NavLink to={`/track/map/${element?._id}/${index}`} className="relative ml-5">
                  <div className="text-center rounded-md cursor-pointer text-[#0885a6]">
                    <center>{smallmapIcon}</center>
                    <p style={{ fontSize: '10px' }}>Track Trip</p>
                  </div>
                </NavLink>
              }
            </td>
          </tr>
        )
      })
    }
    else {
      TD = () => { return (<div>No data found !</div>) }
    }
  }

  return (
    <div className='m-10'>
      <DataTable td={TD} th={th} totalPages={TripReducer?.doc?.totalPages} api={fetchData} />
    </div>
  )
}

export default ViewTrip