import { SET_ORDER } from "../Action/OrderAction";


const initialState = {
    doc: null,
    timestamp: Date.now()
}

const OrderReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_ORDER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default OrderReducer;