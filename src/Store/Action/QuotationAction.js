export const SET_QUOTATION = 'SET_QUOTATION'

export const setQuotation = (data) => {
    return {
      type: SET_QUOTATION,
      value: data
    }
}