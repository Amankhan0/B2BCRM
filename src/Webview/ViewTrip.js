import React, { useEffect, useState } from 'react'
import { ApiHit, GetFullYearWithTime } from '../utils'
import { UpdateTrip, getTrip, searchTrip } from '../Constants/Constants'
import { getTrackYourTransportUser } from '../Storage/Storage'
import DataTable from '../Component/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import { setTripData } from '../Store/Action/TripAction'
import { CrossMark, editIcon, smallmapIcon } from '../SVG/Icons'
import { NavLink } from 'react-router-dom'
import { Colors } from '../Colors/color'
import toast from 'react-hot-toast'
import MyLoader from '../Component/MyLoader'
import ViewTripFilter from '../Component/ViewTripFilter'

function ViewTrip() {

  const TripReducer = useSelector(state => state.TripReducer)
  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const [loader, setLoader] = useState(false)

  const dispatch = useDispatch()
  var user = getTrackYourTransportUser()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = (search) => {
    var json = {
      page: PaginationReducer?.pagination?.page,
      limit: PaginationReducer?.pagination?.limit,
      search: {
        user_id: user?._id
      },
      "populate": "user_id",
      "showShareableTrip": false,
      "showQRCodeTrips": false
    }
    if (search) {
      Object.assign(json.search, search)
    }
    ApiHit(json, getTrip).then(res => {
      if (res?.status === 200) {
        dispatch(setTripData(res?.doc))
      }
    })
  }
  const fetchDataBySearch = (search) => {
    var json = {
      page: PaginationReducer?.pagination?.page,
      limit: PaginationReducer?.pagination?.limit,
      search: {
       
      },
      user_id: user?._id,
    }
    if (search) {
      Object.assign(json.search, search)
    }
    ApiHit(json, searchTrip).then(res => {
      if (res?.status === 200) {
        dispatch(setTripData(res?.doc))
      }
    })
  }

  const onClickEndTrip = (data) => {
    var confirmation = window.confirm('Are you sure to end this trip ?')
    if (confirmation) {
      var newData = data
      newData.status[0] = {
        msg: "Trip Ended",
        timestamp: Date.now(),
        value: 'Ended'
      }
      setLoader(data?._id)
      ApiHit(newData, UpdateTrip).then(res => {
        console.log('res', res);
        if (res.status === 200) {
          setLoader(false)
          toast.success('Trip Ended Successfully')
          fetchData()
        }
      })
    }
  }

  console.log('TripReducer', TripReducer);
  const th = ["#", 'Trip Ref Number', 'Trip created at', 'Start Date', 'End Date', 'Trip Status', 'Source Location', 'Destination Location', 'Driver Name', 'Driver Contact', 'Action']

  let TD;
  if (TripReducer?.doc !== null) {
    if (TripReducer?.doc?.docs?.length !== 0) {
      TD = TripReducer?.doc?.docs?.map((element, index) => {
        return (
          <tr key={index}>
            <td className='p-2 border'>{index + 1}</td>
            <td className='p-2 border'>{element?.code}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.created_at)}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.eWayBillDetails?.[0]?.genratedDate)}</td>
            <td className='p-2 border'>{GetFullYearWithTime(element?.eWayBillDetails?.[0]?.eWayBillValidity)}</td>
            <td className={`p-2 border text-white`}>
              <p className='rounded-lg py-1' style={{ background: element?.status?.[0]?.value === 'Running' ? 'green' : element?.status?.[0]?.value === 'Ended' ? Colors.ThemeBlue : 'red' }}>
                {element?.status?.[0]?.value}
              </p>
            </td>
            <td className='p-2 border'>{element?.locationDetails?.[0]?.sourceLocation?.name}</td>
            <td className='p-2 border'>{element?.locationDetails?.[0]?.destinationLocation?.name}</td>
            <td className='p-2 border'>{element?.driverDetails?.[0]?.driverName ? element?.driverDetails?.[0]?.driverName : '-'}</td>
            <td className='p-2 border'>{element?.driverDetails?.[0]?.driverContact ? element?.driverDetails?.[0]?.driverContact : '-'}</td>

            <td className='p-2 border flex gap-2 justify-center'>
              <NavLink to={`/track/map/${element?._id}/${index}`} className="relative ml-5">
                <div className={`text-center rounded-md cursor-pointer text-green-600`}>
                  <center>{smallmapIcon}</center>
                  <p style={{ fontSize: '10px' }}>Track Trip</p>
                </div>
              </NavLink>
              {
                element?.status?.[0]?.value === 'Running' ?
                  <div onClick={() => onClickEndTrip(element)} className="relative ml-5">
                    <div className={`text-center rounded-md cursor-pointer text-[${Colors.ThemeBlue}]`}>
                      <center>{CrossMark}</center>
                      <p style={{ fontSize: '10px' }}>End Trip</p>
                    </div>
                  </div>
                  :
                  loader === element?._id ?
                    <div className={`ml-5 text-center rounded-md cursor-pointer text-[${Colors.ThemeBlue}]`}>
                      <center><MyLoader /></center>
                      <p className="mt-1" style={{ fontSize: '10px' }}>End Trip</p>
                    </div>
                    :
                    ''
              }
              {
                element?.status?.[0]?.value === 'Running' &&
                <NavLink to={`/trip/edit/${element?._id}/${index}`} className="relative ml-5">
                  <div className="text-center rounded-md cursor-pointer text-[#0885a6]">
                    <center>{editIcon}</center>
                    <p style={{ fontSize: '10px' }}>Edit Trip</p>
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
      <ViewTripFilter fetchData={fetchData} fetchDataBySearch={fetchDataBySearch}/>
      <DataTable td={TD} th={th} totalPages={TripReducer?.doc?.totalPages} api={fetchData} />
    </div>
  )
}

export default ViewTrip