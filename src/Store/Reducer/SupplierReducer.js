import { apiJson } from "../../Storage/Storage";
import { SET_SUPPLIER } from "../Action/SupplierAction";
import { SET_SUPPLIER_API_JSON } from "../Action/SupplierAction";


const initialState = {
    doc: null,
    apiJson: {},
    timestamp: Date.now()
}

const SupplierReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_SUPPLIER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        case SET_SUPPLIER_API_JSON:
            return ({ ...state, apiJson: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default SupplierReducer;