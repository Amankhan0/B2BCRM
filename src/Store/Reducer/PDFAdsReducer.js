import {SET_PDF_ADS} from "../ActionName/ActionName";


const initialState = {
    doc: null,
    timestamp: Date.now()
}

const PDFAdsReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_PDF_ADS:
            return ({ ...state, doc: action.value, timestamp: Date.now() })
        default:
            return state;
    }
}

export default PDFAdsReducer;