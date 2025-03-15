import { apiJson } from "../../Storage/Storage";
import { SET_CUSTOMER } from "../Action/CustomerAction";
import { SET_CUSTOMER_API_JSON } from "../Action/CustomerAction";


const initialState = {
    doc: null,
    apiJson: {},
    timestamp: Date.now()
}

const CustomerReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_CUSTOMER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        case SET_CUSTOMER_API_JSON:
            return ({ ...state, apiJson: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default CustomerReducer;