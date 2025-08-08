import { SET_USER } from "../Action/UserAction";

const initialState = {
    doc:null,
    timestamp: Date.now(),
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default UserReducer;