export const SET_CUSTOMER = 'SET_CUSTOMER'
export const SET_CUSTOMER_API_JSON = 'SET_CUSTOMER_API_JSON'

export const setCustomer = (data) => {
    return {
      type: SET_CUSTOMER,
      value: data
    }
}

export const setCustomerApiJson = (data) => {
    return {
      type: SET_CUSTOMER_API_JSON,
      value: data
    }
}