import { useEffect, useState } from 'react'
import MyInput from '../../Component/MyInput'
import MyButton from '../../Component/MyButton'
import { fastag1 } from '../../Constants/Constants'
import { useSelector } from 'react-redux';
import { ApiHitUlip, ApiTYTLogin } from '../../utils';
import { toast } from 'react-hot-toast';
import TollPlazaMap from './TollPlazaMap';

function RoadFreight() {
    const ApiReducer = useSelector(state => state.ApiReducer);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [tollPlazaData, setTollPlazaData] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // 'list', 'map', or 'both'

    // Vehicle number regex: 5-11 or 17-20 alphanumeric characters
    const vehicleNumberRegex = /^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$/;

    console.log("ApiReducer", ApiReducer);

    // Get token and userId from localSt
    const getStoredCredentials = () => {
        return {
            token: localStorage.getItem('ulipToken'),
            userId: localStorage.getItem('ulipUserId')
        };
    };

    const validateVehicleNumber = (value) => {
        return vehicleNumberRegex.test(value);
    }

    // Function to parse datetime and get timestamp
    const parseDateTime = (dateTimeStr) => {
        const [datePart, timePart] = dateTimeStr.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, parseFloat(second)).getTime();
    };

    // Function to format time in AM/PM format
    const formatTimeAMPM = (dateTimeStr) => {
        const [datePart, timePart] = dateTimeStr.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');

        const date = new Date(year, month - 1, day, hour, minute);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const dateStr = `${day}-${month}-${year}`;

        return `${dateStr} ${hours}:${minutesStr} ${ampm}`;
    };

    // Sort toll plazas by time (newest first for display, but keep original order for numbering)
    const getSortedTollPlazasForDisplay = () => {
        if (!tollPlazaData || tollPlazaData.length === 0) return [];
        // Sort by time oldest to newest first, then add index
        const sortedOldestFirst = [...tollPlazaData].sort((a, b) =>
            parseDateTime(a.readerReadTime) - parseDateTime(b.readerReadTime)
        );
        // Add sequential number (oldest = 1)
        const withNumbers = sortedOldestFirst.map((toll, index) => ({
            ...toll,
            displayNumber: index + 1
        }));
        // Reverse to show newest first
        return withNumbers.reverse();
    };

    // Sort toll plazas by time (oldest first) - for map
    const getSortedTollPlazas = () => {
        if (!tollPlazaData || tollPlazaData.length === 0) return [];
        return [...tollPlazaData].sort((a, b) =>
            parseDateTime(a.readerReadTime) - parseDateTime(b.readerReadTime)
        );
    };

    // Find the most recent toll plaza
    const getMostRecentToll = () => {
        const sorted = getSortedTollPlazas();
        return sorted.length > 0 ? sorted[sorted.length - 1] : null;
    };

    const getTolls = async (vehicleNo) => {
        if (!validateVehicleNumber(vehicleNo)) {
            toast.error('Invalid vehicle number format. Must be 5-11 or 17-20 alphanumeric characters.');
            return;
        }

        setLoading(true);

        try {
            // Get credentials from localStorage
            let { token, userId } = getStoredCredentials();

            // If not in localStorage, login to get token and user ID
            if (!token || !userId) {
                console.log("No stored credentials found. Logging in to TYT...");
                const loginRes = await ApiTYTLogin();
                console.log("Login response:", loginRes);

                if (loginRes?.status === 200 && loginRes?.doc?.token && loginRes?.doc?.doc?._id) {
                    token = loginRes.doc.token;
                    userId = loginRes.doc.doc._id;
                    console.log("Login successful. Token and User ID saved to localStorage");
                } else {
                    setLoading(false);
                    toast.error('Failed to authenticate. Please try again.');
                    return;
                }
            } else {
                console.log("Using stored credentials from localStorage");
            }

            // Now call the ULIP API with the token
            const json = {
                url: "https://www.ulip.dpiit.gov.in/ulip/v1.0.0/FASTAG/01",
                search: {
                    vehiclenumber: vehicleNo
                },
                xmlParse: false,
                user_id: userId
            }

            console.log("Sending payload:", json);

            const res = await ApiHitUlip(json, fastag1, token);
            console.log("res_____", res);
            setLoading(false);

            if (res?.status === 200 && res?.doc?.response?.[0]?.responseStatus === 'SUCCESS') {
                const tollData = res?.doc?.response?.[0]?.response?.vehicle?.vehltxnList?.txn || [];
                setTollPlazaData(tollData);
                toast.success(`Found ${tollData.length} toll plaza transactions!`);
            } else {
                setTollPlazaData(null);
                toast.error(res?.message || res?.doc?.message || 'Failed to fetch vehicle details');
            }
        } catch (error) {
            console.error("Error fetching tolls:", error);
            setLoading(false);
            setTollPlazaData(null);
            toast.error('Error fetching vehicle details. Please try again.');
        }
    }

    const handleSubmit = () => {
        if (!vehicleNumber.trim()) {
            toast.error('Please enter a vehicle number');
            return;
        }

        const upperCaseVehicleNo = vehicleNumber.toUpperCase().trim();
        getTolls(upperCaseVehicleNo);
    }

    useEffect(() => {
        if (ApiReducer?.apiJson?.vehiclenumber) {
            setVehicleNumber(ApiReducer.apiJson.vehiclenumber);
            getTolls(ApiReducer.apiJson.vehiclenumber);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ApiReducer?.apiJson?.vehiclenumber])
    return (
        <div className='-mx-10'>
            <div
                style={{
                    backgroundImage: "url(https://trackyourtransport.in/assets/road-C-jIZYTc.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
                className='relative flex items-center py-16'
            >
                {/* Overlay with gradient */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70'></div>

                {/* Main Container - Left & Right Layout */}
                <div className='relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

                    {/* Left Side - Content */}
                    <div className='space-y-8'>
                        {/* Hero Text */}
                        <div>
                            <h1 className='text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight'>
                                Track Your Vehicle
                            </h1>
                            <p className='text-gray-200 text-xl drop-shadow-md leading-relaxed'>
                                Real-time tracking and monitoring for your road freight shipments
                            </p>
                        </div>

                        {/* Features List */}
                        <div className='space-y-4'>
                            <div className='flex items-start space-x-4'>
                                <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 mt-1'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>Toll Plaza Based Tracking</h3>
                                    <p className='text-gray-300 text-sm'>Monitor your vehicle's journey through toll plaza checkpoints</p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-4'>
                                <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 mt-1'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>24/7 Support</h3>
                                    <p className='text-gray-300 text-sm'>Round-the-clock customer support for all your queries</p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-4'>
                                <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 mt-1'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>Secure & Reliable</h3>
                                    <p className='text-gray-300 text-sm'>Your data is protected with enterprise-grade security</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Search Form */}
                    <div className='flex justify-center lg:justify-end'>
                        <div className='w-full max-w-md'>
                            {/* Form Card */}
                            <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-3xl'>
                                <div className='text-center mb-6'>
                                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Track Now</h2>
                                    <p className='text-gray-600 text-sm'>Enter your vehicle details below</p>
                                </div>

                                <div className='space-y-6'>
                                    <MyInput
                                        title={"Vehicle Number"}
                                        name={"vehiclenumber"}
                                        placeholder={"e.g., MH01AB1234"}
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value)}
                                    />
                                    <MyButton
                                        title={loading ? "Tracking..." : "Track Vehicle"}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Additional Info */}
                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                    <p className='text-xs text-gray-500 text-center'>
                                        Get instant updates on your shipment location, estimated arrival time, and delivery status
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Toll Plaza Results and Map Section - Side by Side */}
            {tollPlazaData && tollPlazaData.length > 0 && (
                <div className='w-full py-12 bg-gray-50'>
                    <div className='max-w-[1800px] mx-auto px-8'>
                        {/* View Toggle Buttons */}
                        <div className='flex justify-center mb-8'>
                            <div className='bg-white rounded-xl shadow-lg p-2 inline-flex space-x-2'>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className='w-5 h-5 inline-block mr-2 -mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
                                    </svg>
                                    List View
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        viewMode === 'map'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className='w-5 h-5 inline-block mr-2 -mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
                                    </svg>
                                    Map View
                                </button>
                                <button
                                    onClick={() => setViewMode('both')}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        viewMode === 'both'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className='w-5 h-5 inline-block mr-2 -mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z' />
                                    </svg>
                                    Both
                                </button>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 ${viewMode === 'both' ? 'lg:grid-cols-2' : ''} gap-8`}>
                            {/* Left Side - Transaction List */}
                            {(viewMode === 'list' || viewMode === 'both') && (
                            <div className='bg-white rounded-2xl shadow-2xl p-8 h-fit lg:sticky lg:top-8'>
                                <div className='mb-6'>
                                    <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                                        Toll Plaza Transactions
                                    </h2>
                                    <p className='text-gray-600'>
                                        Found {tollPlazaData.length} toll plaza transaction(s) for vehicle {vehicleNumber}
                                    </p>
                                </div>

                                <div className='space-y-4 max-h-[800px] overflow-y-auto pr-2'>
                                    {getSortedTollPlazasForDisplay().map((toll, index) => {
                                        const mostRecent = getMostRecentToll();
                                        const isRecent = mostRecent && toll.readerReadTime === mostRecent.readerReadTime;

                                        return (
                                            <div
                                                key={index}
                                                className={`border rounded-xl p-5 hover:shadow-lg transition-all ${
                                                    isRecent
                                                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-white shadow-md'
                                                        : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'
                                                }`}
                                            >
                                                <div className='flex items-start justify-between mb-3'>
                                                    <div className='flex-1'>
                                                        <h3 className='text-lg font-semibold text-gray-800 mb-1 flex items-center'>
                                                            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                                                                isRecent ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                                            }`}>
                                                                <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                                                    <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
                                                                </svg>
                                                            </div>
                                                            {toll.tollPlazaName}
                                                            {isRecent && (
                                                                <span className='ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse'>
                                                                    Current Location
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className='text-xs text-gray-500'>Seq: {toll.seqNo}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        isRecent ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        #{toll.displayNumber}
                                                    </div>
                                                </div>

                                            <div className='grid grid-cols-2 gap-3'>
                                                <div className='flex items-start space-x-2'>
                                                    <svg className='w-4 h-4 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                    </svg>
                                                    <div>
                                                        <p className='text-xs text-gray-500'>Time</p>
                                                        <p className='text-xs font-semibold text-gray-800'>{formatTimeAMPM(toll.readerReadTime)}</p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start space-x-2'>
                                                    <svg className='w-4 h-4 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
                                                    </svg>
                                                    <div>
                                                        <p className='text-xs text-gray-500'>Direction</p>
                                                        <p className='text-xs font-semibold text-gray-800'>
                                                            {toll.laneDirection === 'N' ? 'North' : toll.laneDirection === 'S' ? 'South' : toll.laneDirection === 'E' ? 'East' : 'West'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start space-x-2'>
                                                    <svg className='w-4 h-4 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' />
                                                    </svg>
                                                    <div>
                                                        <p className='text-xs text-gray-500'>Vehicle Type</p>
                                                        <p className='text-xs font-semibold text-gray-800'>{toll.vehicleType}</p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start space-x-2'>
                                                    <svg className='w-4 h-4 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14' />
                                                    </svg>
                                                    <div>
                                                        <p className='text-xs text-gray-500'>Vehicle Number</p>
                                                        <p className='text-xs font-semibold text-gray-800'>{toll.vehicleRegNo}</p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start space-x-2 col-span-2'>
                                                    <svg className='w-4 h-4 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                    </svg>
                                                    <div>
                                                        <p className='text-xs text-gray-500'>Location</p>
                                                        <p className='text-xs font-semibold text-gray-800'>{toll.tollPlazaGeocode}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                            )}

                            {/* Right Side - Map */}
                            {(viewMode === 'map' || viewMode === 'both') && (
                            <div className='lg:sticky lg:top-8 h-fit'>
                                <TollPlazaMap tollPlazaData={tollPlazaData} vehicleNumber={vehicleNumber} />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoadFreight
