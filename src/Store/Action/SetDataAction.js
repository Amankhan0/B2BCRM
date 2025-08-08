export const setDataAction = (data,actionName) => {
    return {
        type: actionName,
        value: data
    }
}