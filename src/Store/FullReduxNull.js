import { setDataAction } from "./Action/SetDataAction"
import { setTripData } from "./Action/TripAction"
import { SET_API_JSON, SET_CREATE_TRIP_JSON } from "./ActionName/ActionName"

export const FullReduxNull = () => dispatch => {
    
    dispatch(setDataAction({}, SET_API_JSON))
    dispatch(setDataAction({ driverDetails: [], epod: [
        { documents: [''] },
    ] }, SET_CREATE_TRIP_JSON))
    dispatch(setTripData(null))

}