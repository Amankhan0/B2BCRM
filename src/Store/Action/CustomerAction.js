export const SET_CUSTOMER = 'SET_CUSTOMER'

export const setCustomer = (data) => {
    return {
      type: SET_CUSTOMER,
      value: data
    }
}