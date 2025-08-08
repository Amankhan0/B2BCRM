import { SET_ORDER, SET_DISPATCH, SET_PI, SET_PO } from "../Action/OrderAction";


const initialState = {
    doc: null,
    PO: null,
    Dispatch: null,
    PI: null,
    timestamp: Date.now()
}

const OrderReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_ORDER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        case SET_DISPATCH:
            return ({ ...state, Dispatch: action.value, timestamp: Date.now() })
        case SET_PI:
            return ({ ...state, PI: action.value, timestamp: Date.now() })
        case SET_PO:
            return ({ ...state, PO: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default OrderReducer;