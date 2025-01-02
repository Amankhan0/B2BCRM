import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { SET_API_JSON, SET_API_JSON_ERROR, SET_CREATE_TRIP_JSON, SET_TRIP_STEP } from "../Store/ActionName/ActionName";
import { CheckLocationValidation } from "./Validation";
import { Colors } from "../Colors/color";
import MyLoader from "../Component/MyLoader";
import toast from "react-hot-toast";
import { ApiHit, decodeGeometery } from "../utils";
import { getTollGuru } from "../Constants/Constants";
import GoogleLocationSearch from "../Component/GoogleLocationSearch";
import { setDataAction } from "../Store/Action/SetDataAction";
import { truckicon } from "../SVG/Icons";
import MyInput from "../Component/MyInput";

const LocationInformation = ({ editPage }) => {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const UserReducer = useSelector(state => state.UserReducer)

    const [loopOff, setLoopOff] = useState(false)
    const [loader, setLoader] = useState(false)

    const dispatch = useDispatch()

    const fillTraderOrTransporter = () => {
        var TraderOrTransporterJson;
        if (UserReducer?.userData?.doc?.userType === 'Trader/Manufacturer' && !ApiReducer?.apiJson?.traderPan) {
            TraderOrTransporterJson = {
                traderName: UserReducer?.userData?.doc?.fullName,
                traderEmail: UserReducer?.userData?.doc?.email,
                traderContact: UserReducer?.userData?.doc?.contactno,
                traderPan: UserReducer?.userData?.doc?.pan,
            }
        }
        else if (UserReducer?.userData?.doc?.userType === 'Transporter' && !ApiReducer?.apiJson?.transporterPan) {
            TraderOrTransporterJson = {
                transporterName: UserReducer?.userData?.doc?.fullName,
                transporterEmail: UserReducer?.userData?.doc?.email,
                transporterContact: UserReducer?.userData?.doc?.contactno,
                transporterPan: UserReducer?.userData?.doc?.pan,
            }
        }
        var oldJson = ApiReducer?.apiJson
        Object.assign(oldJson, TraderOrTransporterJson)
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    if (ApiReducer?.apiJson?.sourceLocation?.geometry?.location && ApiReducer?.apiJson?.destinationLocation?.geometry?.location && !loopOff && !ApiReducer?.apiJson?.tollGuruGeo) {
        myFunction()
    }

    function myFunction() {
        console.log('call ----- --');
        setLoopOff(true)
        if (editPage) {
            console.log("null")
        } else {
            for (let index = 0; index < ApiReducer?.createTripJson?.driverDetails?.length; index++) {
                const element = ApiReducer?.createTripJson?.driverDetails?.[index];
                var json = {
                    "from": {
                        "lat": ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lat?.(),
                        "lng": ApiReducer?.apiJson?.sourceLocation?.geometry?.location?.lng?.()
                    },
                    "to": {
                        "lat": ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lat?.(),
                        "lng": ApiReducer?.apiJson?.destinationLocation?.geometry?.location?.lng?.()
                    },
                    "vehicle": {
                        "type": element?.vehicleType,
                        "axles": element?.axles
                    },
                    "json": true
                }
                if (json?.from?.lat && json?.to?.lat) {
                    setLoader(true)
                    ApiHit(json, getTollGuru).then(res => {
                        if (res?.status === 200) {
                            var oldArr = ApiReducer?.createTripJson
                            oldArr.driverDetails[index].tollInfo = res?.doc

                            if (oldArr.routes) {
                                oldArr.routes.push(res?.doc)
                            }
                            else {
                                oldArr.routes = [res?.doc]
                            }
                            if (index + 1 === ApiReducer?.createTripJson?.driverDetails?.length) {
                                setLoader(false)
                                dispatch(setDataAction(oldArr, SET_CREATE_TRIP_JSON))
                            }
                        }
                    })
                }
            }
        }
    }

    const onSelectRoute = (item, index) => {
        var oldJson = ApiReducer?.apiJson
        item.selectedIndex = index
        var decodePoliLine = decodeGeometery(item?.polyline)
        let geoToLatLng = decodePoliLine?.map((item, index) => {
            return {
                lat: parseFloat(item[0].toString().split(',')),
                lng: parseFloat(item[1].toString().split(',')),
            }
        });
        if (geoToLatLng) {
            item.routeArr = geoToLatLng
        }
        oldJson.tollGuruGeo = item
        oldJson.distance = item?.summary?.distance?.metric
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    console.log('ApiReducer', ApiReducer);

    return (
        <div>
            <div className="mb-2">
                <p className='p-2 text-white font-bold rounded-lg' style={{ background: Colors.ThemeBlue }}>Location Details</p>
            </div>
            <div className="grid grid-cols-2 gap-6 p-3">
                <div className="mb-5">
                    <GoogleLocationSearch
                        disabled={editPage ? true : false}
                        title='Source Location'
                        name='sourceLocation'
                        error={!ApiReducer?.apiJson?.sourceLocation || !Object.keys(ApiReducer?.apiJson?.sourceLocation).length ? true : false}
                        inputEmptyApiHit="true"
                        functionAPI={myFunction}
                        setLoopOff={setLoopOff}
                    />
                </div>
                <div className="mb-5">
                    <GoogleLocationSearch
                        disabled={editPage ? true : false}
                        title='Destination Location'
                        name='destinationLocation'
                        error={!ApiReducer?.apiJson?.destinationLocation || !Object.keys(ApiReducer?.apiJson?.destinationLocation).length ? true : false}
                        inputEmptyApiHit="true"
                        functionAPI={myFunction}
                        setLoopOff={setLoopOff}
                    />
                </div>
            </div>

            <div className="-mt-2" style={{background:Colors.transparentBlue}}>
            {
                loader ? (
                    <div className="mb-5 p-4 flex flex-row gap-3">
                        <div style={{ marginLeft: '33%', marginTop: 'auto' }}>
                            <MyLoader />
                        </div>
                        <p>Fetching....</p>
                    </div>
                ) : (
                    Array.isArray(ApiReducer?.createTripJson?.routes?.[0]?.routes) && ApiReducer?.createTripJson?.routes?.[0]?.routes.length > 0 ? (
                        <div className="bg-gray-100 p-2">
                            <div className="grid grid-cols-1 gap-6">
                                {ApiReducer?.createTripJson?.routes?.slice(-1).map((ele, i) => (
                                    <div key={i}>
                                        {ele?.routes?.map((routesEle, j) => (
                                            <div key={`${i}-${j}`} onClick={() => onSelectRoute(routesEle, j)} className="p-2 mb-4 cursor-pointer hover:bg-gray-200 rounded-lg transition duration-100 ease-in-out" style={{ background: ApiReducer?.apiJson?.tollGuruGeo?.selectedIndex === j ? '#d5e3f7' : '' }}>
                                                <div className="card p-2">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-black text-sm font-bold underline mb-2">Option {j + 1}</p>
                                                            <p className="text-xs text-black mb-1">
                                                                <span className="font-semibold">Duration :</span> {routesEle?.summary?.duration?.text}
                                                            </p>
                                                            <p className="text-xs text-black mb-1">
                                                                <span className="font-semibold">Roadway :</span> {routesEle?.summary?.name}
                                                            </p>
                                                        </div>
                                                        <div className="m-4">
                                                            {
                                                                ApiReducer?.apiJson?.tollGuruGeo?.selectedIndex === j &&
                                                                <input className="accent-blue-500" type="radio" checked />
                                                            }
                                                        </div>
                                                    </div>
                                                    {ApiReducer?.createTripJson?.driverDetails?.map((item, index) => (
                                                        <div key={index} className="mb-2 flex items-center gap-5 p-2 bg-slate-100">
                                                            <p>{truckicon}</p>
                                                            <p className="text-sm text-black"><span className="font-semibold">Vehicle :</span> {item?.vehicleNumber}</p>
                                                            <p className="text-sm text-black"><span className="font-semibold">Total number of toll plazas :</span> {item?.tollInfo?.routes?.[j]?.tolls?.length}</p>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5">
                                <MyInput value={ApiReducer?.apiJson?.distance} disable={true} important={false} name='distance' title='Distance' placeholder='Enter distance' error={!ApiReducer?.apiJson?.distance} />
                            </div>
                        </div>

                    ) : ""
                )
            }
            </div>
        </div>
    )
}

export default LocationInformation; 