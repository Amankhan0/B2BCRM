import React from "react";

const TollPlaza = ({ tollsArr, data }) => {

    return (
        <div className="w-full p-6">
            <div id="demo-list" className="steps-list-looped">
                {tollsArr?.map((toll, tollIndex) => {
                    var totalspeed;
                    var preData = tollsArr[tollIndex - 1]
                    if (preData?.readerReadTime && toll?.readerReadTime) {
                        var preTime = new Date(preData?.readerReadTime).getTime()
                        console.log({ preTime })
                        var currentTime = new Date(toll?.readerReadTime).getTime()
                        console.log({ currentTime })
                        // var timeDiff = (preTime - currentTime) / (1000 * 60 * 60);

                        var timeDiff = (currentTime - preTime) / (1000 * 60 * 60);

                        console.log('preData', preData);

                        var preDis = preData.arrival ? preData.arrival.distance : preData.end.arrival.distance
                        var currentDis = toll.arrival ? toll.arrival.distance : toll.end.arrival.distance

                        var totalDis = currentDis - preDis

                        console.log({ totalDis })

                        const speed = totalDis / timeDiff;

                        console.log({ timeDiff })


                        console.log({ speed })

                        totalspeed = speed.toFixed(2) / 1000

                    }
                    else {
                        totalspeed = 0
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
            </div>
            <div className="totals  flex flex-col justify-end items-end p-4">
                <p className="text-lg font-bold">
                    Total Distance: <span className="text-blue-500">{data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[0]?.tollsArr?.summary?.distance?.metric}</span>
                </p>
                {/* <p className="text-lg font-bold">
                    Total Toll Cost: <span className="text-blue-500">₹{data?.[0]?.geometry?.[0]?.vehicleInformationWithToll?.[0]?.tollsArr?.costs?.tag}</span>
                </p> */}
            </div>
        </div>
    );
};

export default TollPlaza;

