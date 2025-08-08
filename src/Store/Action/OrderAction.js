export const SET_ORDER = 'SET_ORDER'
export const SET_PO = 'SET_PO'
export const SET_PI = 'SET_PI'
export const SET_DISPATCH = 'SET_DISPATCH'

export const setOrder = (data) => {
    return {
      type: SET_ORDER,
      value: data
    }
}


export const setPo = (data) => {
    return {
      type: SET_PO,
      value: data
    }
}

export const setPi = (data) => {
  return {
    type: SET_PI,
    value: data
  }
}

export const setDispatch = (data) => {
  return {
    type: SET_DISPATCH,
    value: data
  }
}