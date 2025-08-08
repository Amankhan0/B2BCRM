import { SET_PAGINATION } from "../Action/PaginationAction";


const initialState = {
    pagination: {
        page: 1,
        limit: 10,
        search: {}
    },
    timestamp: Date.now()
}

const PaginationReducer = (state = initialState, action) => {


    switch (action.type) {
        case SET_PAGINATION:
            return ({ ...state, pagination: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default PaginationReducer;