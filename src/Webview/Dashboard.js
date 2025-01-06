import React, { useEffect, useState } from 'react'
import { myVehicleicon } from '../SVG/Icons'
import { Colors } from '../Colors/color'
import { NavLink } from 'react-router-dom'
import ColumnChart from '../Component/ColumnChart'
import { getTrackYourTransportUser } from '../Storage/Storage'
import { ApiHitForDashboard, getFirstDayOfMonth } from '../utils'
import DashboardCard from '../Component/DashboardCard'

function Dashboard() {

  const [data, setData] = useState(null)
  const [typeOfChart, setTypeOfChart] = useState('Yearly')
  const [chartOpenWhichCard, setChartOpenWhichCard] = useState('trips')
  const [total, setTotal] = useState(null)
  const [loader, setLoader] = useState(false)
  const [render, setRender] = useState(null)
  const [activeCard, setActiveCard] = useState('Running')

  var user = getTrackYourTransportUser()

  useEffect(() => {
    if (data === null) {
      var currentYear = new Date().getFullYear();
      onChange('Yearly', currentYear)
    }
  }, [])

  const onChange = (type, value, typeOfCard) => {
    setLoader(true)
    setTypeOfChart(type)
    if (typeOfCard) {
      setActiveCard(typeOfCard)
    }
    var json;
    if (type === 'Quarterly') {
      var json = {
        user_id: user?._id,
        "quarter": true,
        from: '',
        to: '',
        find: typeOfCard ? typeOfCard : activeCard,
        month: '',
        type: 'trips'
      }
    } else if (type === 'Monthly') {
      json = {
        user_id: user?._id,
        from: '',
        to: '',
        find: typeOfCard ? typeOfCard : activeCard,
        month: getFirstDayOfMonth(value,),
        type: 'trips'
      }
    } else if (type === 'Yearly') {
      json = {
        user_id: user?._id,
        from: '',
        find: typeOfCard ? typeOfCard : activeCard,
        to: '',
        month: '',
        "year": value,
        type: 'trips'
      }
    }
    ApiHitForDashboard(json, data, setData, setTotal, setLoader, type?.[1], setRender)
  }

  const onClickCard = (type) => {
    var currentYear = new Date().getFullYear();
    onChange('Yearly', currentYear, type)
  }

  console.log('data', data);

  return (
    <div>
      <div className='grid grid-cols-3 gap-4 m-5'>
        <DashboardCard activeCard={activeCard} onClick={() => onClickCard('Running')} type='Running' themeColor={'green'} title={'Running Trips'} value={'02'} icon={myVehicleicon} />
        <DashboardCard activeCard={activeCard} onClick={() => onClickCard('Ended')} type='Ended' themeColor={Colors.GRADIENTFIRST} title={'Closed Trips'} value={'22'} icon={myVehicleicon} />
        <DashboardCard activeCard={activeCard} onClick={() => onClickCard('Cancelled')} type='Cancelled' themeColor='darkorange' title={'Cancelled Trips'} value={'01'} icon={myVehicleicon} />
      </div>

      <div className='grid grid-cols-12 gap-4 mt-10 card p-5 m-5'>
        <div className='col-span-3 p-4'>
          <p className='text-2xl text-black mb-5 mt-5'>{activeCard === 'Ended' ? 'Closed' : activeCard} Trips Overview</p>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-info" fill="none" viewBox="0 0 24 24" stroke={Colors.ThemeBlue} stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
          </svg>
          <p className='mt-5'>
            <span className='text-black text-5xl'>{total !== null ? total : 0}</span><br />
            <p className='mt-5'>
              {typeOfChart}
            </p>
          </p>
          <p className='border p-2 rounded-full text-center text-white mt-[44%]' style={{ background: Colors.ThemeBlue }}>
            <NavLink to='/trip/view'>View Trips</NavLink>
          </p>
        </div>

        <div className='col-span-9'>
          <div className='bg-slate-200 rounded-md w-max ml-auto'>
            <select onChange={(e) => onChange('Yearly', e.target.value)} style={{ background: typeOfChart === 'Yearly' ? '#fff' : 'none' }} className='text-black p-1 rounded-md w-24 m-1 border-none'>
              <option value={false} selected>Yearly</option>
              <option>2025</option>
              <option>2024</option>
            </select>

            {/* <button onClick={() => onChange('Quarterly')} style={{ background: typeOfChart === 'Quarterly' ? '#fff' : 'none' }} className='text-black p-1  rounded-md w-24 m-1 border-none'>Quarterly</button> */}
            <select onChange={(e) => onChange('Monthly', e.target.value)} style={{ background: typeOfChart === 'Monthly' ? '#fff' : 'none' }} className='text-black p-1 rounded-md w-24 m-1 border-none'>
              <option value={false} selected>Monthly</option>
              <option value='Jan'>Jan</option>
              <option value='Feb'>Feb</option>
              <option value='Mar'>Mar</option>
              <option value='Apr'>April</option>
              <option value='May'>May</option>
              <option value='Jun'>June</option>
              <option value='Jul'>July</option>
              <option value='Aug'>August</option>
              <option value='Sep'>September</option>
              <option value='Oct'>October</option>
              <option value='Nov'>November</option>
              <option value='Dec'>December</option>
            </select>

            <select onChange={(e) => onChange('Quarterly', e.target.value)} style={{ background: typeOfChart === 'Quarterly' ? '#fff' : 'none' }} className='text-black p-1 rounded-md w-24 m-1 border-none'>
              <option value={false} selected>Quarterly</option>
              <option value={'Q1'}>Q1</option>
              <option value={'Q2'}>Q2</option>
              <option value={'Q3'}>Q3</option>
              <option value={'Q4'}>Q4</option>
            </select>
          </div>

          <div className='mt-2'>
            <ColumnChart data={data} BottomText={typeOfChart} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard;