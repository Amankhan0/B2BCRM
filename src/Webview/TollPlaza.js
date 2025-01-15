import React from "react";
import { GetFullYearWithTime } from "../utils";

const TollPlaza = ({ tollsArr, data }) => {

    let totalspeed = 0;
    var lastToll = tollsArr[tollsArr?.length - 1]
    var lastTollTime = new Date(lastToll?.readerReadTime).getTime()
    if (lastTollTime) {
        var endDate = data?.[0]?.status?.[0]?.timestamp
        var totalDistance = (data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[0]?.tollsArr?.summary?.distance?.value) / 1000 - (lastToll?.arrival?.distance ? lastToll?.arrival?.distance : lastToll?.end?.arrival?.distance) / 1000
        const timeDifferenceInMs = endDate - lastTollTime;
        const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);
        totalspeed = totalDistance / timeDifferenceInHours;
    }
    
    return (
        <div className="w-full p-6">
            <div id="demo-list" className="steps-list-looped">
                <div className="step-wrapper">
                    <div className="step-content">
                        <div style={{background:'#017f00'}} className="step-number border card p-2">
                            <p className="text-white w-32 border rounded-2xl text-md">
                                <span className="font-bold ">Source : </span>
                                {data?.[0]?.locationDetails[0]?.sourceLocation?.formatted_address}
                                <br />
                            </p>
                            <div className="gap-2 ml-2 w-32">
                                <p className="text-white">Trip start date & time (ETD) - </p>
                                <p className="text-white">{GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {tollsArr?.map((toll, tollIndex) => {
                    var totalspeed = 0;
                    if (tollIndex === 0) {
                        var totalDistance = (toll?.arrival?.distance) / 1000
                        var preTime = data?.[0]?.eWayBillDetails?.[0]?.genratedDate
                        var curretnTime = new Date(toll?.readerReadTime).getTime()
                        const timeDifferenceInMs = curretnTime - preTime;
                        const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);
                        totalspeed = totalDistance / timeDifferenceInHours;
                    } else {
                        var preToll = tollsArr?.[tollIndex - 1]
                        if (preToll?.readerReadTime && toll?.readerReadTime) {
                            var totalDistance = (preToll?.arrival?.distance) / 1000 - (toll?.arrival?.distance) / 1000
                            var preTime = new Date(preToll?.readerReadTime).getTime()
                            var curretnTime = new Date(toll?.readerReadTime).getTime()
                            const timeDifferenceInMs = preTime - curretnTime;
                            const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);
                            totalspeed = totalDistance / timeDifferenceInHours;
                        } else {
                            totalspeed = 0
                        }
                    }
                    return (
                        <div key={tollIndex} className="step-wrapper ">
                            <div className="step-content">
                                <div className="step-number border card p-4" >
                                    <span className="mr-2 font-bold text-black text-base">{tollIndex + 1}</span>
                                    <span className={`${toll?.crossed ? 'bg-green-400 text-white font-bold' : 'bg-[#0885a6] text-white'} p-1 rounded-md`}>
                                        {toll?.crossed ? 'Crossed' : 'Yet to cross'}
                                    </span>
                                    <div className="tooltip2 cursor-context-menu ml-1 mt-0.5 text-black font-bold">
                                        {toll?.name ? toll?.name?.substring(0, 15) + "..." : toll?.end?.name?.substring(0, 15) + "..."}
                                        {toll?.name && (
                                            <span className="tooltiptext">{toll?.name ? toll?.name : toll?.end?.name}</span>
                                        )}
                                    </div>

                                    {/* <p className="text-xs text-slate-500 font-medium"><span className="text-black font-bold">Toll Cost -</span> <span className="text-red-500">₹{toll?.tagCost}</span></p> */}

                                    {toll?.readerReadTime &&
                                        <p className="mt-0.5 text-xs text-slate-500 w-32 font-medium">
                                            <span className="text-black font-bold">Crossing time -</span> <span className="text-blue-500">
                                                {new Date(toll?.readerReadTime).toLocaleString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}
                                            </span>
                                        </p>
                                    }
                                    <p className="mt-0.5 text-xs text-slate-500 w-32 font-medium"><span className="text-black font-bold">Distance - </span> <span className="text-blue-500">{toll?.arrival ? (toll?.arrival?.distance / 1000).toFixed(2) : (toll?.end?.arrival?.distance / 1000).toFixed(2)} km</span></p>
                                    {/* {toll?.speed !== null && ( */}
                                    <p className="mt-0.5 text-xs text-slate-500 w-32 font-medium">
                                        <span className="text-black font-bold">Speed -</span> <span className="text-blue-500">{totalspeed?.toFixed(2)} km/h</span>
                                    </p>
                                    {/* )} */}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className="step-wrapper">
                    <div className="step-content">
                        <div style={{background:'#c9292a'}} className="step-number border card p-2">
                            <p className="text-white p-2 w-32 border rounded-2xl text-md">
                                <span className="font-bold ">Destination : </span>
                                {data?.[0]?.locationDetails[0]?.destinationLocation?.formatted_address}
                            </p>
                            <div className="gap-2 ml-2 w-32">
                                <p className="text-white">Trip end date & time (ETA) - </p>
                                <p className="text-white"> {GetFullYearWithTime(data?.[0]?.eWayBillDetails?.[0]?.eWayBillValidity)}</p>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500 w-32 font-medium">
                                <span className="text-white font-bold">Speed -</span> <span className="text-white">{totalspeed?.toFixed(2)} km/h</span>
                            </p>
                            <p className="text-sm font-bold mt-2 w-32 text-white">
                                Total Distance - <span className="text-white">{data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[0]?.tollsArr?.summary?.distance?.metric}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TollPlaza;

