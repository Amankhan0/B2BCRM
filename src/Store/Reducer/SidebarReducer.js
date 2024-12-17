
import { SET_SIDE_BAR } from '../Action/SidebarAction'

const initialState = {
    doc: false,
    timestamp: Date.now()
}

const SidebarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIDE_BAR:
            return ({ doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}
export default SidebarReducer;