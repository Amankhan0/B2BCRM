import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../Colors/color';
import Title from '../Component/Title';
import { GoogleMapIcon, mapPin } from '../SVG/Icons';
import { setDataAction } from '../Store/Action/SetDataAction';
import { SET_API_JSON } from '../Store/ActionName/ActionName';

function GoogleLocationSearch({ titleColor, title, important, name, error,inputStyleType, placeWidth, disabled, inputEmptyApiHit, functionAPI, setLoopOff }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBYBkhSx7miq3A9WpK7qI33exwVIL-tRhU'
    });


    useEffect(() => {
        if (map && ApiReducer?.apiJson[name] && ApiReducer?.apiJson[name].toString()?.length === 6 && typeof ApiReducer?.apiJson[name] === 'number') {
            onPlacesChanged(ApiReducer?.apiJson[name])
        }
    }, [ApiReducer, map])

    const onLoad = (map) => {
        setMap(map);
    };

    const onSelectPlace = (value) => {
        setPlaces([])
        var oldJson = ApiReducer.apiJson
        delete oldJson.distance
        delete oldJson.tollGuruGeo
        delete oldJson.geometry
        var json = {
            [name]: value
        }
        Object.assign(oldJson, json)
        dispatch(setDataAction(oldJson, SET_API_JSON))
        if (functionAPI) { functionAPI(); }
    }


    const onPlacesChanged = (value) => {

        const inputValue = document.getElementById(`place-search458948354kjfdsnfj${name}`).value; // Get the current input box value
        if (document.getElementById(`place-search458948354kjfdsnfj${name}`).value === '') {
            setPlaces([])
        }

        if (Object.prototype.toString.call(ApiReducer?.apiJson[name]) === '[object Object]') {
            console.log("1")
            var oldJson = ApiReducer?.apiJson
            oldJson[name].formatted_address = document.getElementById(`place-search458948354kjfdsnfj${name}`).value
            delete oldJson.geometry
            delete oldJson.distance
            dispatch(setDataAction(oldJson, SET_API_JSON))
        }

        if (map) {
            const service = new window.google.maps.places.PlacesService(map);
            console.log("2")

            service.textSearch({
                query: value ? value : document.getElementById(`place-search458948354kjfdsnfj${name}`).value
            }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPlaces(results);
                    if (results.length === 1 && typeof ApiReducer?.apiJson[name] === 'number') {
                        onSelectPlace(results[0])
                    }
                }
            });
        }
    };

    console.log({ places })

    return isLoaded ? (
        <div>
            {
                inputStyleType === 1 ?
                    <input
                        disabled={disabled}
                        id={`place-search458948354kjfdsnfj${name}`}
                        type="text"
                        placeholder="Enter Location"
                        onChange={() => onPlacesChanged()}
                        className="outline-none text-white placeholder:text-white h-12 w-full text-md bg-transparent border-b border-slate-400  pl-2"
                        value={Object.prototype.toString.call(ApiReducer?.apiJson[name]) !== '[object Object]' ? ApiReducer?.apiJson[name] : ApiReducer?.apiJson[name]?.formatted_address}
                    />
                    :
                    <>
                        <div className="flex">
                            <Title size='md' color={titleColor ? titleColor : Colors.BLACK} title={title} />{important === false ? '' : <span className="text-red-600 text-lg">*</span>}
                        </div>
                        <input
                            disabled={disabled}
                            id={`place-search458948354kjfdsnfj${name}`}
                            type="text"
                            placeholder="Enter Location"
                            onChange={() => onPlacesChanged()}
                            className={`outline-none h-12 w-full text-md rounded-xl border border-slate-400 hover:border-slate-400 pl-2 ${disabled ? 'disabled:cursor-not-allowed' : 'disabled:cursor-not-allowed'}`}
                            value={Object.prototype.toString.call(ApiReducer?.apiJson[name]) !== '[object Object]' ? ApiReducer?.apiJson[name] : ApiReducer?.apiJson[name]?.formatted_address}
                        />
                    </>
            }
            <div className={`bg-slate-200 rounded-lg w-[${placeWidth}]`}>
                {
                    places.map((ele, i) => {
                        return <p onClick={() => onSelectPlace(ele)} className={`flex p-1 hover:text-white hover:bg-[${Colors.ThemeBlue}] cursor-pointer`}>
                            <span>{GoogleMapIcon}</span>
                            <span className='m-0.5'>{ele.formatted_address}</span>
                        </p>
                    })
                }
            </div>

            {error === true ? <label className="text-red-600">{ApiReducer?.apiJsonError[name]}</label> : ''}

            <div style={{ display: 'none', width: '400px', height: '400px' }}>
                <GoogleMap
                    mapContainerStyle={{ width: '400px', height: '400px' }}
                    center={{ lat: -34.397, lng: 150.644 }}
                    zoom={8}
                    onLoad={onLoad}
                >
                    {places.map(place => (
                        <Marker
                            key={place.id}
                            position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
                        />
                    ))}
                </GoogleMap>
            </div>
        </div>
    ) : <></>;
}

export default GoogleLocationSearch;

