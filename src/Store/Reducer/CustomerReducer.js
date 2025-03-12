import { SET_CUSTOMER } from "../Action/CustomerAction";


const initialState = {
    doc: null,
    timestamp: Date.now()
}

const CustomerReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_CUSTOMER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default CustomerReducer;