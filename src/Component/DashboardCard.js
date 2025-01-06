import React, { useEffect, useState } from 'react'
import { ApiHit } from '../utils'
import { getTrip } from '../Constants/Constants'
import { getTrackYourTransportUser } from '../Storage/Storage'
import { Colors } from '../Colors/color'

const DashboardCard = ({ title, type, icon, themeColor,onClick,activeCard }) => {

    const [data,setData] = useState(null)

    var user = getTrackYourTransportUser()

    useEffect(()=>{
        if(data === null){
            fetchData()
        }
    },[])

    const fetchData = () =>{
        var json = {
            "page": 1,
            "limit": 1,
            "search": {
                "user_id": user?._id,
                "find":type
            },
            "populate": "user_id",
            "showShareableTrip": false,
            "showQRCodeTrips": false
        }
        ApiHit(json,getTrip).then(res=>{
            if(res?.status === 200){
                setData(res?.doc?.totalDocs)
            }
        })
    }

    return (
      <div className={`card p-7 cursor-pointer`} onClick={onClick} style={{border:activeCard === type?'0.5px solid'+Colors.ThemeBlue:'blue'}}>
        <div className='flex justify-between'>
          <div>
            <p className='text-xl font-bold text-black mb-2'>{data}</p>
            <p>{title}</p>
          </div>
          <div>
            <p style={{ color: themeColor }}>{icon}</p>
          </div>
        </div>
      </div>
    )
  }

export default DashboardCard