import { GoogleMap, InfoWindow, Marker, Polyline } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import sourcePin from '../Images/source.png'
import defaultPin from '../Images/defaultPin.png'
import greenPin from '../Images/greenPin.png'
import { isArray } from "underscore";

const GMap = ({ routeArr, srcLatLngArr, desLatLngArr, tollsArr, tollImage, setActiveStation, inforWindow, setInfoWindow, srcName, desName, simLocationArr }) => {


    // console.log('routeArr--', routeArr);

    const [activeMarker, setActiveMarker] = useState(null)
    const [srcInfo, setSrcInfo] = useState(false)
    const [desInfo, setDecInfo] = useState(false)

    useEffect(() => {
        if (inforWindow) {
            setActiveMarker(null)
            setInfoWindow(false)
        }
    }, [inforWindow])

    const onClickMarker = (toll, index) => {
        if (setActiveStation) { setActiveStation({ lat: toll?.lat ? toll?.lat : toll?.end?.lat, lng: toll?.lng ? toll?.lng : toll?.end?.lng }) }
        setActiveMarker(index)
    }

    console.log('routeArr',routeArr);

    return (
        <GoogleMap
            mapContainerStyle={{ height: '70vh', width: '100%' }}
            zoom={tollImage ? 12 : 5}
            center={{ lat: tollImage ? srcLatLngArr[0] : 20.5937, lng: tollImage ? srcLatLngArr[1] : 78.9629 }}
        >

            {/* // src Marker */}
            <Marker position={{ lat: srcLatLngArr[0], lng: srcLatLngArr[1] }}
                icon={{
                    url: sourcePin,
                    scaledSize: new window.google.maps.Size(40, 50),
                }}
                onClick={() => setSrcInfo(srcInfo ? false : true)}
            >

                {
                    srcInfo &&
                    <InfoWindow onCloseClick={() => setSrcInfo(false)}>
                        <p>{srcName}</p>
                    </InfoWindow>
                }

            </Marker>

            {/* // des Marker */}
            <Marker position={{ lat: desLatLngArr[0], lng: desLatLngArr[1] }}
                icon={{
                    url: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png',
                    scaledSize: new window.google.maps.Size(40, 50),
                }}
                onClick={() => setDecInfo(desInfo ? false : true)}
            >

                {
                    desInfo &&
                    <InfoWindow onCloseClick={() => setDecInfo(false)}>
                        <p>{desName}</p>
                    </InfoWindow>
                }

            </Marker>

            {
                tollsArr?.map((toll, tollIndex) => {

                    return (
                        <Marker position={{ lat: toll?.lat ? toll?.lat : toll?.end?.lat, lng: toll?.lng ? toll?.lng : toll?.end?.lng }}
                            icon={{
                                url: tollImage ? tollImage : toll?.crossed === true ? greenPin : defaultPin,
                                scaledSize: new window.google.maps.Size(tollImage ? 50 : 20, tollImage ? 50 : 30),
                            }}
                            onClick={() => onClickMarker(toll, tollIndex)}
                        >
                            {
                                activeMarker !== null && activeMarker === tollIndex &&
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <div>
                                        {toll?.name && <p className="mb-1"><span className="text-black font-bold">Name : </span>{toll?.name}</p>}
                                        {toll?.end?.name && <p className="mb-1"><span className="text-black font-bold">Name : </span>{toll?.end?.name}</p>}
                                        {toll?.address && <p className="mb-1"><span className="text-black font-bold">Address : </span>{toll?.address}</p>}
                                        {toll?.road && <p className="mb-1"><span className="text-black font-bold">Address : </span>{toll?.road}</p>}
                                        {toll?.readerReadTime && <p className="mb-1"><span className="text-black font-bold">Crossed Time : </span>{toll?.readerReadTime}</p>}
                                    </div>
                                </InfoWindow>
                            }
                        </Marker>
                    )
                })
            }

            {/* // Polyline */}
            <Polyline
                path={routeArr !== undefined ? routeArr : []}
                geodesic={true}
                options={{
                    strokeColor: "#0f53fe",
                    strokeOpacity: 2.0,
                    strokeWeight: 3,
                }}
            />

            {
                isArray(simLocationArr) ?
                    <Polyline
                        path={simLocationArr !== undefined ? simLocationArr : []}
                        geodesic={true}
                        options={{
                            strokeColor: "green",
                            strokeOpacity: 2.0,
                            strokeWeight: 3,
                        }}
                    />
                    :
                    ''
            }

        </GoogleMap>
    )
}

export default GMap;





















