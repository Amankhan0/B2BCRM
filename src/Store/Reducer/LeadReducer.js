import { SET_LEAD } from "../Action/LeadAction";


const initialState = {
    doc: null,
    timestamp: Date.now()
}

const LeadReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_LEAD:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default LeadReducer;