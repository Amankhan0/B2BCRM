import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetTripWithGeo } from "../Constants/Constants";
import { setTripData } from "../Store/Action/TripAction";
import { ApiHit } from "../utils";
import CreateTrip from "./CreateTrip";
import { setDataAction } from "../Store/Action/SetDataAction";
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from "../Store/ActionName/ActionName";

const EditTrip = () => {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()

    var url = window.location.pathname
    var splitUrl = url.split('/')?.[4]
    var splitRef = url.split('/')?.[4]
    console.log({ splitRef, splitUrl })

    const [fill, setFill] = useState(false)

    useEffect(() => {
        if (!fill) {
            getTripApi()
        }
    }, [])

    const getTripApi = () => {
        var json = {
            page: 1,
            limit: 1,
            search: {
                originalId: splitUrl
            },
            populate: 'originalId',
            ref: splitRef ? splitRef : ''
        }
        ApiHit(json, GetTripWithGeo).then(res => {

            console.log('res', res);

            if (res?.message === 'Success' && res?.status === 200 && res?.doc?.docs?.length === 1) {
                var apiJson = ApiReducer?.apiJson
                Object.assign(apiJson, res.doc.docs[0]?.originalId?.eWayBillDetails[0])
                Object.assign(apiJson, { tollGuruGeo: res.doc.docs[0]?.geometry[0] })
                Object.assign(apiJson, res.doc.docs[0]?.originalId?.locationDetails[0])
                Object.assign(apiJson, { driverName: res.doc.docs[0]?.originalId?.driverDetails?.[0]?.driverName })
                Object.assign(apiJson, { driverContact: res.doc.docs[0]?.originalId?.driverDetails?.[0]?.driverContact })
                Object.assign(apiJson, { vehicleNumber: res.doc.docs[0]?.originalId?.driverDetails?.[0]?.vehicleNumber })
                dispatch(setDataAction(apiJson, SET_API_JSON))
                var createTripJson = ApiReducer?.createTripJson
                Object.assign(createTripJson, { driverDetails: res.doc.docs[0]?.originalId?.driverDetails })
                dispatch(setDataAction(createTripJson,SET_CREATE_TRIP_JSON))
                setFill(true)
            }

            console.log('ApiReducer', ApiReducer);
        })
    }

    return (
        <CreateTrip />
    )
}

export default EditTrip;