import React, { useState } from 'react'
import { CrossMark, Smallclipboard, clipboard, earthIcon } from '../SVG/Icons'
import { GetFullYearWithTime, regexEmail } from '../utils';
import { Colors } from '../Colors/color';
import toast from 'react-hot-toast';

function ShareTripModal({ moda, setModal, data }) {

    const [type, setType] = useState('Mobile')
    const [value, setValue] = useState(null)


    var tripId = window.location.pathname.split('/')[4]
    var tripIndex = window.location.pathname.split('/')[5]

    const copyLink = () => {
        navigator.clipboard.writeText('https://trackyourtransport.in/army/track/map/share/' + tripId + '/' + tripIndex)
            .then(() => {
                toast.success('Share trip link copied!');
            })
            .catch((err) => {
                toast.error('Something went wrong!');
                console.error('Error copying text: ', err);
            });
    }

    const onSubmit = () => {
        if (value === null) {
            toast.error(type === 'Mobile' ? 'Mobile number is required' : 'Email is required')
        } else if (type === 'Mobile' && value?.length !== 10) {
            toast.error('Mobile number is incorrect')
        } else if (type === 'Email' && !regexEmail.test(value)) {
            toast.error('Email is incorrect')
        } else {
            toast.success('done') // sourav hit api here
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-lg w-1/2 mx-4">
                <div className='flex justify-between text-white p-2' style={{ background: Colors.ThemeBlue }} onClick={() => setModal(false)}>
                    <span>Trip Code : {data?.[0]?.code}</span>
                    <span>{CrossMark}</span>
                </div>
                <div className='p-4 '>
                    <div className='grid grid-cols-2 gap-3'>
                        <p><span className='text-black'>Trip start date & time (ETD) :</span> {GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)}</p>
                        <p><span className='text-black'>Trip end date & time (ETA) :</span> {GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.eWayBillValidity)}</p>
                        <p><span className='text-black'>Source Location :</span> {data?.[0]?.locationDetails?.[0]?.sourceLocation?.formatted_address}</p>
                        <p><span className='text-black'>Destination Location :</span> {data?.[0]?.locationDetails?.[0]?.destinationLocation?.formatted_address}</p>
                    </div>
                    <div className='mt-10'>
                    <p className='mt-1 text-black'>Share by mobile or email</p>
                    <div className='flex'>
                        <select onChange={(e) => setType(e.target.value)} className='w-24 border-slate-200 p-2 bg-slate-300 rounded-l-xl'>
                            <option selected={type === 'Mobile'}>Mobile</option>
                            <option selected={type === 'Email'}>Email</option>
                        </select>
                        <input onChange={(e) => setValue(e.target.value)} className='w-full outline-none text-md border border-slate-200 pl-2' />
                        <button onClick={() => onSubmit()} className='p-2 rounded-r-xl text-white text-center flex justify-center' style={{ background: Colors.ThemeBlue }}>Submit</button>
                    </div>
                    </div>
                    <div className='mt-10'>
                        <p className='mb-1 text-black'>Copy link to share publicly</p>
                        <div onClick={() => copyLink()} className='flex justify-between border p-2'>
                            <div className='flex'>
                                {earthIcon} <span className="ml-1 text-black">Public URL :</span> <span className="ml-5">https://trackyourtransport.in/army/track/map/share/{tripId}/{tripIndex}</span>
                            </div>
                            <div>
                                {Smallclipboard}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareTripModal