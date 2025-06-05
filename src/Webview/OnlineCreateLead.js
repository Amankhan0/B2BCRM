import React, { useEffect, useState } from "react";
import CreateLead from "./Lead/CreateLead";
import { useDispatch, useSelector } from "react-redux";
import { setDataAction } from "../Store/Action/SetDataAction";
import { SET_API_JSON } from "../Store/ActionName/ActionName";
import { ApiHit } from "../utils";
import { searchWebsiteLead } from "../Constants/Constants";

const OnlineCreateLead = () => {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    var path = window.location.pathname;
    var id = path.split('/')[3];

    useEffect(() => {
        if (data === null) {
            fetchData()
        }
    }, [data])

    const fetchData = (page, limit) => {
        var json = {
            page: page ? page : 1,
            limit: limit ? limit : 10,
            search: {
                _id: id
            }
        }
        ApiHit(json, searchWebsiteLead).then((res) => {
            console.log('res website lead ---- ', res);
            if (res?.content && res?.content?.length > 0) {
                setData(res);
                var oldJson = ApiReducer.apiJson
                oldJson.customerDetails = {
                    name: res?.content?.[0]?.name,
                    contact: res?.content?.[0]?.contactNo,
                    leadSource: res?.content?.[0]?.adsSource
                }
                dispatch(setDataAction(oldJson, SET_API_JSON))
            }
        })
    }

    return (
        data !== null && data?.content?.length > 0 &&
        <div className='mt-10'>
            <CreateLead isOnlineLead={true} onLineLeadId={data?.content?.[0]?._id} />
        </div>
    );
}

export default OnlineCreateLead;

