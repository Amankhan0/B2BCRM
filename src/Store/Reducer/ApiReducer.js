import { SET_API_JSON, SET_API_JSON_ERROR, SET_TRIP_FORM, SET_TRIP_STEP, SET_CREATE_TRIP_JSON, SET_OTP, SET_SUB_MODAL, RETURN_TRIP_JSON, SET_RETURN_TRIP_VIEW } from "../ActionName/ActionName";

const initialState = {
    apiJson: {},
    apiJsonError: {},
    returnTripJson: {},
    returnTripView: null,
    otp: "",
    subModal: false,
    tripForm: false,
    timestamp: Date.now(),
    createTripActiveStep: 1,
    createTripJson: {
        driverDetails: [],
        epod: [
            { documents: [''] },
        ]
    },
}

const ApiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_API_JSON:
            return ({ ...state, apiJson: action.value, timestamp: Date.now() })
        case SET_API_JSON_ERROR:
            return ({ ...state, apiJsonError: action.value, timestamp: Date.now() })
        case SET_TRIP_FORM:
            return ({ ...state, tripForm: action.value, timestamp: Date.now() })
        case SET_TRIP_STEP:
            return ({ ...state, createTripActiveStep: action.value, timestamp: Date.now() })
        case SET_CREATE_TRIP_JSON:
            return ({ ...state, createTripJson: action.value, timestamp: Date.now() })
        case SET_OTP:
            return ({ ...state, otp: action.value, timestamp: Date.now() })
        case SET_RETURN_TRIP_VIEW:
            return ({ ...state, returnTripView: action.value, timestamp: Date.now() })
        case SET_SUB_MODAL:
            return ({ ...state, subModal: action.value, timestamp: Date.now() })
        case RETURN_TRIP_JSON:
            return ({ ...state, returnTripJson: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default ApiReducer;