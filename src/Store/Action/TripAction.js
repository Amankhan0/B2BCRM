export const SET_TRIP_DATA = 'SET_TRIP_DATA'

export const setTripData = (data) => {
    return {
      type: SET_TRIP_DATA,
      value: data
    }
}