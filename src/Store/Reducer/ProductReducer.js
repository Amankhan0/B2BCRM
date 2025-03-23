import { apiJson } from "../../Storage/Storage";
import { SET_PRODUCT } from "../Action/ProductAction";
import { SET_PRODUCT_API_JSON } from "../Action/ProductAction";


const initialState = {
    doc: null,
    apiJson: {},
    timestamp: Date.now()
}

const CustomerReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_PRODUCT:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        case SET_PRODUCT_API_JSON:
            return ({ ...state, apiJson: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default CustomerReducer;