
import { SET_TRIP_DATA } from '../Action/TripAction'

const initialState = {
    doc: null,
    timestamp: Date.now()
}

const TripReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TRIP_DATA:
            return ({ doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}
export default TripReducer;