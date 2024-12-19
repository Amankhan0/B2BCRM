import React, { useEffect } from 'react'
import { ApiHit } from '../utils'
import { getTrip } from '../Constants/Constants'

function ViewTrip() {

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = () =>{
    var json = {
      page:1,
      limit:10,
      search:{

      }
    }
    ApiHit(json,getTrip).then(res=>{
      console.log('get',res);
    })
  }

  return (
    <div>ViewTrip</div>
  )
}

export default ViewTrip