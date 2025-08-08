export function checkDispatchedQty(data) {
    return data.products.every(item => Number(item.dispatchedQty) === Number(item.qty));
}
export function updateDispatchedQty(products) {
    return products.map(product => {
        if (product.dummyDispatch) {
            if (product.dispatchedQty === null) {
                product.dispatchedQty = product.dummyDispatch
            } else {
                product.dispatchedQty = Number(product.dispatchedQty) + Number(product.dummyDispatch)
            }
        } else {
            if (product.dispatchedQty === null) {
                product.dispatchedQty = 0
            } else {
                if (Number(product.dispatchedQty) === Number(product.qty)) {

                } else {
                    var availableQty = Number(product.qty) - Number(product.dispatchedQty)
                    product.dispatchedQty = Number(product.dispatchedQty)
                }
            }
        }
        return product;
    });
}