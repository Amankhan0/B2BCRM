export const SET_PRODUCT = 'SET_PRODUCT'
export const SET_PRODUCT_API_JSON = 'SET_PRODUCT_API_JSON'

export const setProduct = (data) => {
    return {
      type: SET_PRODUCT,
      value: data
    }
}

export const setProductApiJson = (data) => {
    return {
      type: SET_PRODUCT_API_JSON,
      value: data
    }
}