import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function TollPlazaMap({ tollPlazaData }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [selectedToll, setSelectedToll] = useState(null);

    // Function to parse datetime and get timestamp
    const parseDateTime = (dateTimeStr) => {
        // Format: "2025-10-20 02:27:57.000"
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

    useEffect(() => {
        if (!tollPlazaData || tollPlazaData.length === 0) return;

        // Initialize map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: [20.5937, 78.9629], // Center of India
                zoom: 5,
                zoomControl: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Clear existing markers and polylines
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        // Sort toll plazas by time (oldest first)
        const sortedTollPlazas = [...tollPlazaData].sort((a, b) =>
            parseDateTime(a.readerReadTime) - parseDateTime(b.readerReadTime)
        );

        // Find the most recent toll plaza (last in sorted array)
        const mostRecentToll = sortedTollPlazas[sortedTollPlazas.length - 1];

        // Create custom icons with different colors
        const createNumberedIcon = (number, isRecent) => {
            const bgColor = isRecent ? '#10B981' : '#EF4444'; // Green for recent, Red for passed
            const animation = isRecent ? `
                @keyframes blink {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
            ` : '';
            const animationStyle = isRecent ? 'animation: blink 1.5s ease-in-out infinite;' : '';

            return L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <style>${animation}</style>
                    <div style="background-color: ${bgColor}; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); ${animationStyle}">
                        ${number}
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
            });
        };

        const bounds = [];
        const coordinates = [];

        // Add markers for each toll plaza (sorted by time)
        sortedTollPlazas.forEach((toll, index) => {
            const coords = toll.tollPlazaGeocode.split(',').map(coord => parseFloat(coord.trim()));

            console.log(`Marker #${index + 1}:`, toll.tollPlazaName, coords, toll.readerReadTime);

            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                const [lat, lng] = coords;
                bounds.push([lat, lng]);
                coordinates.push([lat, lng]);

                // Check if this is the most recent toll plaza
                const isRecent = toll.readerReadTime === mostRecentToll.readerReadTime;

                const marker = L.marker([lat, lng], {
                    icon: createNumberedIcon(index + 1, isRecent),
                    zIndexOffset: isRecent ? 10000 : (1000 - index * 100) // Recent on top, then reverse order (earlier markers on top)
                }).addTo(map);

                const direction = toll.laneDirection === 'N' ? 'North' :
                                 toll.laneDirection === 'S' ? 'South' :
                                 toll.laneDirection === 'E' ? 'East' : 'West';

                const popupContent = `
                    <div style="min-width: 250px;">
                        <div style="background-color: ${isRecent ? '#10B981' : '#EF4444'}; color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px 4px 0 0;">
                            <h3 style="font-weight: bold; font-size: 16px; margin: 0;">Toll #${index + 1}</h3>
                        </div>
                        <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1F2937;">${toll.tollPlazaName}</h3>
                        <div style="font-size: 12px; color: #6B7280; line-height: 1.5;">
                            <p><strong>Time:</strong> ${formatTimeAMPM(toll.readerReadTime)}</p>
                            <p><strong>Direction:</strong> ${direction}</p>
                            <p><strong>Vehicle:</strong> ${toll.vehicleRegNo}</p>
                            <p><strong>Type:</strong> ${toll.vehicleType}</p>
                            <p><strong>Location:</strong> ${toll.tollPlazaGeocode}</p>
                            <p><strong>Seq:</strong> ${toll.seqNo}</p>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);

                marker.on('click', () => {
                    setSelectedToll(toll);
                });
            } else {
                console.error(`Invalid coordinates for marker #${index + 1}:`, coords, toll.tollPlazaName);
            }
        });

        // Draw route line connecting toll plazas
        if (coordinates.length > 1) {
            const polyline = L.polyline(coordinates, {
                color: '#3B82F6',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
            }).addTo(map);
        }

        // Fit map to show all markers
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [tollPlazaData]);

    if (!tollPlazaData || tollPlazaData.length === 0) {
        return null;
    }

    return (
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden h-full'>
            <div className='p-6 bg-gradient-to-r from-blue-500 to-blue-600'>
                <h2 className='text-3xl font-bold text-white mb-2'>
                    Route Map
                </h2>
                <p className='text-blue-100'>
                    {tollPlazaData.length} toll plaza location(s)
                </p>
            </div>

            <div className='relative'>
                <div
                    ref={mapRef}
                    className='w-full'
                    style={{ height: '800px' }}
                />

                {/* Map Legend */}
                <div className='absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]'>
                    <h4 className='font-semibold text-gray-800 mb-2 text-sm'>Legend</h4>
                    <div className='space-y-2 text-xs text-gray-600'>
                        <div className='flex items-center space-x-2'>
                            <div className='w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-md' style={{animation: 'blink 1.5s ease-in-out infinite'}}>
                                <style>
                                    {`@keyframes blink {
                                        0%, 100% { opacity: 1; transform: scale(1); }
                                        50% { opacity: 0.6; transform: scale(1.1); }
                                    }`}
                                </style>
                                N
                            </div>
                            <span>Current Location</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <div className='w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-md'>P</div>
                            <span>Passed</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <div className='w-8 h-0 border-t-2 border-dashed border-blue-500'></div>
                            <span>Route</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Toll Info */}
            {selectedToll && (
                <div className='p-4 bg-gray-50 border-t'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                                {selectedToll.tollPlazaName}
                            </h3>
                            <div className='grid grid-cols-2 gap-3 text-sm'>
                                <div>
                                    <p className='text-gray-500 text-xs'>Time</p>
                                    <p className='font-semibold text-gray-800 text-xs'>{formatTimeAMPM(selectedToll.readerReadTime)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-xs'>Direction</p>
                                    <p className='font-semibold text-gray-800 text-xs'>
                                        {selectedToll.laneDirection === 'N' ? 'North' :
                                         selectedToll.laneDirection === 'S' ? 'South' :
                                         selectedToll.laneDirection === 'E' ? 'East' : 'West'}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-xs'>Vehicle Type</p>
                                    <p className='font-semibold text-gray-800 text-xs'>{selectedToll.vehicleType}</p>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-xs'>Location</p>
                                    <p className='font-semibold text-gray-800 text-xs'>{selectedToll.tollPlazaGeocode}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedToll(null)}
                            className='text-gray-400 hover:text-gray-600'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className='p-4 grid grid-cols-2 gap-3 border-t'>
                <div className='text-center p-3 bg-blue-50 rounded-lg'>
                    <p className='text-xl font-bold text-blue-600'>{tollPlazaData.length}</p>
                    <p className='text-xs text-gray-600'>Total Plazas</p>
                </div>
                <div className='text-center p-3 bg-green-50 rounded-lg'>
                    <p className='text-xl font-bold text-green-600'>
                        {tollPlazaData.filter(t => t.laneDirection === 'N').length}
                    </p>
                    <p className='text-xs text-gray-600'>Northbound</p>
                </div>
                <div className='text-center p-3 bg-orange-50 rounded-lg'>
                    <p className='text-xl font-bold text-orange-600'>
                        {tollPlazaData.filter(t => t.laneDirection === 'S').length}
                    </p>
                    <p className='text-xs text-gray-600'>Southbound</p>
                </div>
                <div className='text-center p-3 bg-purple-50 rounded-lg'>
                    <p className='text-xl font-bold text-purple-600'>
                        {new Set(tollPlazaData.map(t => t.vehicleType)).size}
                    </p>
                    <p className='text-xs text-gray-600'>Vehicle Types</p>
                </div>
            </div>
        </div>
    );
}

export default TollPlazaMap;
