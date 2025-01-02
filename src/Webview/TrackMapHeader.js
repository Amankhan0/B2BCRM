import React from "react";

const TrackMapHeader = ({ data }) => {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-6 sm:grid-cols-6 gap-6 mb-7 p-2 card items-center">
            <div className="ml-5 lg:col-span-2 md:col-span-2 sm:col-span-2 rounded-2xl flex">
                <div className="self-center rounded-full" style={{ background: 'rgb(8, 133, 166)' }}>
                    <img className="w-8 h-16 p-2 " src="https://firebasestorage.googleapis.com/v0/b/tyt-doc-upload.appspot.com/o/track-your-transport%2FpanFile%2FUntitled-1.png?alt=media&amp;token=eefed7db-d04d-4126-819f-ad245f0630ae" />
                </div>
                <div className="w-full">
                    <div className="flex gap-6 p-2">
                        <p className="text-xs mt-auto mb-auto">From</p>
                        <p className="text-black text-xs font-bold">{data?.[0]?.locationDetails[0]?.sourceLocation?.name}</p>
                    </div>
                    <div className="border border-dashed border-[#0885a6] ml-1"></div>
                    <div className="flex gap-6 p-2">
                        <p className="text-xs mt-auto mb-auto">To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p className="text-black text-xs font-bold">{data?.[0]?.locationDetails[0]?.destinationLocation?.name}</p>
                    </div>
                </div>
            </div>
            <div className="ml-5">
                <p className="text-black">Trip start date & time (ETD)</p>
                {/* <p>{GetFullYear(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)}</p> */}


                <p className="w-24">
                    {new Date(Number(data?.[0]?.eWayBillDetails?.[0]?.genratedDate)).toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </p>
            </div>
            <div className="ml-5">
                <p className="text-black">Estimated time of arrival</p>
                {/* <p>{GetFullYear(data?.[0]?.eWayBillDetails?.[0]?.eWayBillValidity)}</p> */}

                <p className="w-24">
                    {new Date(Number(data?.[0]?.eWayBillDetails?.[0]?.eWayBillValidity)).toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </p>
            </div>

        </div>
    )
}

export default TrackMapHeader;