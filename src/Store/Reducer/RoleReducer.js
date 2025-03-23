import { SET_ROLE} from "../Action/RoleAction";

const initialState = {
    doc:null,
    timestamp: Date.now(),
}

const RoleReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROLE:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default RoleReducer;