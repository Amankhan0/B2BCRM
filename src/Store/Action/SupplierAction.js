export const SET_SUPPLIER = 'SET_SUPPLIER'
export const SET_SUPPLIER_API_JSON = 'SET_SUPPLIER_API_JSON'

export const setSupplier = (data) => {
    return {
      type: SET_SUPPLIER,
      value: data
    }
}

export const setSupplierApiJson = (data) => {
    return {
      type: SET_SUPPLIER_API_JSON,
      value: data
    }
}