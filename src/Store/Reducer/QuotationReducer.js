import { SET_QUOTATION } from "../Action/QuotationAction";


const initialState = {
    doc: null,
    timestamp: Date.now()
}

const QuotationReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_QUOTATION:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default QuotationReducer;