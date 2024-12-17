import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { SET_API_JSON, SET_API_JSON_ERROR, SET_TRIP_STEP } from "../Store/ActionName/ActionName";
import { CheckLocationValidation } from "./Validation";
import { Colors } from "../Colors/color";
import MyLoader from "../Component/MyLoader";
import toast from "react-hot-toast";
import { ApiHit, decodeGeometery } from "../utils";
import { getTollGuru } from "../Constants/Constants";
import GoogleLocationSearch from "../Component/GoogleLocationSearch";
import { setDataAction } from "../Store/Action/SetDataAction";

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
                "type": ApiReducer?.apiJson?.vehicleType,
                "axles": ApiReducer?.apiJson?.axles
            },
            "json": true
        }
        if (json?.from?.lat && json?.to?.lat) {
            setLoader(true)
            ApiHit(json, getTollGuru).then(res => {
                console.log('res', res);
                if (res?.status === 200) {
                    var oldArr = ApiReducer?.apiJson
                    oldArr.suggestedRoutes = res?.doc
                    setLoader(false)
                    dispatch(setDataAction(oldArr, SET_API_JSON))
                    // oldArr.driverDetails[index].tollInfo = res?.doc

                    // if (oldArr.routes) {
                    //     oldArr.routes.push(res?.doc)
                    // }
                    // else {
                    //     oldArr.routes = [res?.doc]
                    // }
                    // if (index + 1 === ApiReducer?.createTripJson?.driverDetails?.length) {
                    //     setLoader(false)
                    //     dispatch(setDataAction(oldArr, SET_CREATE_TRIP_JSON))
                    // }
                }
            })
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
                    ApiReducer?.apiJson?.suggestedRoutes?.routes?.map((ele, i) => {
                        return (
                            <div className="p-2">
                                <div className="grid grid-cols-1 gap-6">
                                    <div key={i} onClick={() => onSelectRoute(ele, i)} className="cursor-pointer hover:bg-gray-200 rounded-lg transition duration-100 ease-in-out" style={{ background: ApiReducer?.apiJson?.tollGuruGeo?.selectedIndex === i? '#d5e3f7' : '' }}>
                                        <div className="card p-2">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-black text-sm font-bold underline mb-2">Option {i + 1}</p>
                                                    <p className="text-xs text-black mb-1">
                                                        <span className="font-semibold">Duration :</span> {ele?.summary?.duration?.text}
                                                    </p>
                                                    <p className="text-xs text-black mb-1">
                                                        <span className="font-semibold">Roadway :</span> {ele?.summary?.name}
                                                    </p>
                                                    <p className="text-xs text-black mb-1">
                                                        <span className="font-semibold ">Tolls Cost :</span> 
                                                        <span className="text-red-600"> ₹{ele?.costs?.tag}</span>
                                                    </p>
                                                    
                                                </div>
                                                <div className="m-4">
                                                    {
                                                        ApiReducer?.apiJson?.tollGuruGeo?.selectedIndex === i &&
                                                        <input className="accent-blue-500" type="radio" checked />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
            }
            </div>
        </div>
    )
}

export default LocationInformation; 