import React, { useEffect, useState } from "react";
import { GetTripWithGeo, ULIPApiHandler, UpdateTrip, fetchSimLocation } from "../Constants/Constants";
import { useSelector } from "react-redux";
import TrackMapHeader from "./TrackMapHeader";
import toast from "react-hot-toast";
import { ApiHit, GetFullYearWithTime, calculateDistance, graterThenAndLessThenTimeAccept } from "../utils";
import TollPlaza from "./TollPlaza";
import { isArray } from "underscore";
import GMap from "./GMap";
import { ShareTripIcon, shareSmallIcon } from "../SVG/Icons";
import { Colors } from "../Colors/color";

const TrackMap = () => {

    const UserReducer = useSelector(state => state.UserReducer);
    const [data, setData] = useState(null);
    const [vehicleToDisplayTolls, setVehicleToDisplayTolls] = useState(0);
    const [fetchToll, setFetchToll] = useState(false);
    const [simLocation, setSimlocation] = useState(null);

    var url = window.location.pathname
    var splitUrl = url.split('/')[4]

    useEffect(() => {
        if (data === null) {
            getTripApi()
        }
        if (data !== null && simLocation === null) {
            getSimData()
        }
    }, [vehicleToDisplayTolls, data, simLocation])

    const getTripApi = () => {
        var json = {
            page: 1,
            limit: 1,
            search: {
                originalId: splitUrl !== 'share' ? splitUrl : url.split('/')?.[5]
            },
            populate: 'originalId',
            ref: ''
        }
        console.log('call --- ');
        ApiHit(json, GetTripWithGeo).then(res => {
            console.log('res ---- --- -- -- ', res);
            if (res?.message === 'Success' && res?.status === 200 && res?.doc?.docs?.length === 1) {
                var tempArr = []
                var geometryData = res?.doc?.docs?.[0]
                var fullData = res?.doc?.docs?.[0]?.originalId
                var convertData = { ...geometryData, ...fullData }
                delete convertData?.originalId
                tempArr.push(convertData)
                setData(tempArr)
            }
        })
    }

    const onChange = (e) => {
        setVehicleToDisplayTolls(parseInt(e.target.value))
        setFetchToll(false)
    }

    if (data !== null && fetchToll === false && data?.[0]?.status?.[0]?.value === "Running") {
        setFetchToll(true)
        var json = {
            "url": "https://www.ulip.dpiit.gov.in/ulip/v1.0.0/FASTAG/01",
            "search": {
                "vehiclenumber": data?.[0]?.driverDetails?.[vehicleToDisplayTolls]?.vehicleNumber
            },
            "xmlParse": false,
            user_id: UserReducer?.userData?.doc?._id,
        }

        ApiHit(json, ULIPApiHandler)
            .then(res => {
                if (res.status === 200 && res?.doc?.code === "200" && res?.doc?.message === "Success" && res?.doc?.response?.[0] && res?.doc?.response?.[0]?.response) {
                    if (res?.doc?.response?.[0]?.response?.respCode === "000" && res?.doc?.response?.[0]?.response?.result === "SUCCESS") {
                        if (res?.doc?.response?.[0]?.response?.vehicle?.vehltxnList?.txn && res?.doc?.response?.[0]?.response?.vehicle?.vehltxnList?.txn?.length !== 0) {
                            let arr = []
                            data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[vehicleToDisplayTolls]?.tollsArr?.tolls?.map((myToll, myIndex) => {
                                var oldToll = myToll
                                res?.doc?.response?.[0]?.response?.vehicle?.vehltxnList?.txn.map((fastag, fastagIndex) => {
                                    var oldEle = fastag
                                    if (typeof oldEle.tollPlazaGeocode === 'object' && oldEle.tollPlazaGeocode !== null) {
                                    } else {
                                        oldEle.tollPlazaGeocode = { lat: parseFloat(oldEle.tollPlazaGeocode?.split(',')[0]), lng: parseFloat(oldEle.tollPlazaGeocode?.split(',')[1]) }
                                    }
                                    var distanceBetweenFastagAndTollGuru = calculateDistance(myToll?.lat ? myToll?.lat : myToll?.end?.lat, myToll?.lng ? myToll?.lng : myToll?.end?.lng, oldEle?.tollPlazaGeocode?.lat, oldEle?.tollPlazaGeocode?.lng)
                                    if (parseInt(distanceBetweenFastagAndTollGuru) < 10) {
                                        var checkDateIsRangeOrNot = graterThenAndLessThenTimeAccept(
                                            fastag?.readerReadTime,
                                            data?.[0]?.eWayBillDetails?.[0]?.genratedDate,
                                            data?.[0]?.eWayBillDetails?.[0]?.eWayBillValidity
                                        )
                                        if (checkDateIsRangeOrNot) {
                                            if (!oldToll.crossed) {
                                                oldToll.crossed = true
                                                oldToll.readerReadTime = fastag?.readerReadTime
                                                oldToll.seqNo = fastag?.seqNo
                                                oldToll.laneDirection = fastag?.laneDirection
                                                oldToll.vehicleType = fastag?.vehicleType
                                                arr.push(oldToll)
                                            }
                                        }
                                    }
                                })
                                arr.push(oldToll)
                            })
                            setFetchToll('complete')
                        }
                        else {
                            toast.error('No Toll Plaza Crossed')
                        }
                    }
                }
                else if (res?.message == "The toll data for this vehicle spans over three days, hence it cannot be displayed.") {
                    toast.error('No Toll Plaza Crossed')
                }
                else if (res?.status === 500) {
                    toast.error('No Toll Plaza Crossed')
                }
                else if (res?.status === 201) {
                    toast.error('No Toll Plaza Crossed')
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    if (fetchToll === 'complete') {
        var json = data?.[0]
        json.updateToll = true
        ApiHit(json, UpdateTrip).then(res => {
            setFetchToll(true)
        })
    }
    if (isArray(simLocation)) {
        var json = data?.[0]
        json.geometry[0].vehicleInformationWithToll[vehicleToDisplayTolls].simLocation = simLocation
        ApiHit(json, UpdateTrip).then(res => {
            console.log('res', res);
        })
    }

    const getSimData = () => {
        if (data?.[0]?.driverDetails?.[vehicleToDisplayTolls]?.trip_Id) {
            var json = {
                tripId: data?.[0]?.driverDetails?.[vehicleToDisplayTolls]?.trip_Id
            }
            console.log('json', json);
            ApiHit(json, fetchSimLocation).then(res => {
                if (res?.status === 200) {
                    var simArr = []
                    var oldData = data?.[0]
                    res?.data?.map((ele, i) => {
                        simArr.push({ lat: ele?.loc?.[0], lng: ele?.loc?.[1] })
                    })
                    if (simArr?.length === res?.data?.length) {
                        oldData.geometry[0].vehicleInformationWithToll[vehicleToDisplayTolls].simLocation = simArr
                        setSimlocation(simArr)
                    }
                }
            })
        } else {
            setSimlocation(false)
        }
    }

    console.log('data----', data);

    const sharetrip = () => {
        console.log(url.split('/')[5]);
        var shareTripUrl = 'https://trackyourtransport.in/army/track/map/share/'+url.split('/')[4]+'/'+url.split('/')[5]
        navigator.clipboard.writeText(shareTripUrl)
            .then(() => {
                toast.success('Share trip link copied!');
            })
            .catch((err) => {
                toast.error('Something went wrong!');
                console.error('Error copying text: ', err);
            });
    }

    return (
        data !== null ?
            <div className="m-10">

                {/* ******* map Header ******* */}
                <TrackMapHeader data={data} />
                <div className="mt-7 mb-10 flex justify-between">
                    <div>
                        <p className="text-black">Selected Vehicle</p>
                        <select onChange={(e) => onChange(e)} className="bg-gray-200 rounded-xl p-2 w-32 card">
                            {
                                data?.[0]?.driverDetails?.map((ele, index) => {
                                    return (
                                        <option key={index} value={index} selected={parseInt(vehicleToDisplayTolls) === index ? true : false}>{ele?.vehicleNumber}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {
                        url.split('/')[4] !== 'share' &&
                        <div onClick={() => sharetrip()} className="flex self-center items-center gap-2 px-3 h-10 cursor-pointer rounded-lg" style={{ background: Colors.ThemeBlue, color: 'white' }}>
                            <p className="text-sm">Share</p>
                            <span>{shareSmallIcon}</span>
                        </div>
                    }
                </div>
                {/* ******* map Header ******* */}

                <GMap
                    routeArr={data?.[0]?.geometry?.[0]?.routeArr}
                    simLocationArr={data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[vehicleToDisplayTolls]?.simLocation}
                    srcLatLngArr={[data?.[0]?.locationDetails[0]?.sourceLocation?.geometry?.location?.lat, data?.[0]?.locationDetails[0]?.sourceLocation?.geometry?.location?.lng]}
                    desLatLngArr={[data?.[0]?.locationDetails[0]?.destinationLocation?.geometry?.location?.lat, data?.[0]?.locationDetails[0]?.destinationLocation?.geometry?.location?.lng]}
                    tollsArr={data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[vehicleToDisplayTolls]?.tollsArr?.tolls}
                    srcName={data?.[0]?.locationDetails[0]?.sourceLocation?.formatted_address}
                    desName={data?.[0]?.locationDetails[0]?.destinationLocation?.formatted_address}
                />

                <div>
                    <p className="bg-[#017f00] text-white w-max p-2 mt-5 border rounded-2xl text-md">
                        <span className="font-bold ">Source : </span>
                        {data?.[0]?.locationDetails[0]?.sourceLocation?.formatted_address}
                        <br />
                    </p>
                    <p className="flex gap-2 ml-2">
                        <span className="text-black">Trip start date & time (ETD) - </span>
                        {GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)}
                    </p>
                </div>

                <TollPlaza data={data} tollsArr={data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[vehicleToDisplayTolls]?.tollsArr?.tolls} />
                <div>
                    <p className="bg-[#c9292a] text-white w-max p-2 border rounded-2xl text-md">
                        <span className="font-bold ">Destination : </span>
                        {data?.[0]?.locationDetails[0]?.destinationLocation?.formatted_address}
                    </p>
                    <p className="flex gap-2 ml-2">
                        <span className="text-black">Trip end date & time (ETA) - </span>
                        {GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)}
                    </p>
                </div>

            </div>
            :
            <h2 style={{ fontSize: 20, color: 'black', margin: 20 }}>
                Loading...
            </h2>
    )
}

export default TrackMap;