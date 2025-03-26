import React, { useEffect, useState } from "react";
import MyFileUpload from "../../../Component/MyFileUpload";
import MyButton from "../../../Component/MyButton";
import { smallMoneyIcon } from "../../../Icons/Icon";
import MyInput from "../../../Component/MyInput";
import DataTable from "../../../Component/DataTable";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ApiHit, updateProductId } from "../../../utils";
import { addDispatch, updatePO } from "../../../Constants/Constants";
import { checkDispatchedQty, updateDispatchedQty } from "./dispatchUtils";

const AddDispatchOrder = ({ data }) => {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const [loader, setLoader] = useState(null)
    const [render, setRender] = useState(Date.now())
    const [newData, setNewData] = useState(null)

    useEffect(() => {
        if (newData === null) {
            setNewData(data)
        }
    }, [render])

    const onClickDispatch = () => {
        if (!ApiReducer.apiJson.vendorInvoice || ApiReducer.apiJson.vendorInvoice === "" || ApiReducer.apiJson.vendorInvoice === null) {
            toast.error('Vendor invoice is required')
        } else if (!ApiReducer.apiJson.ourInvoice || ApiReducer.apiJson.ourInvoice === "" || ApiReducer.apiJson.ourInvoice === null) {
            toast.error('Headsup invoice is required')
        } else {
            var oldJson = newData
            var finalData = updateDispatchedQty(newData.products)
            var poID = oldJson._id
            delete oldJson._id
            if (finalData) {
                var json = {
                    ...oldJson,
                    po_id: poID,
                    products: finalData,
                    vendorInvoice: ApiReducer?.apiJson?.vendorInvoice,
                    ourInvoice: ApiReducer?.apiJson?.ourInvoice
                }
                var newFinalJson = updateProductId(json)
                ApiHit(newFinalJson, addDispatch).then(res => {
                    if (res.status === 200) {
                        newFinalJson._id = poID
                        var manageStatus = checkDispatchedQty(newFinalJson)
                        if (manageStatus) {
                            newFinalJson.status = 'dispatched'
                        }else{
                            newFinalJson.status = 'partial_dispatched'
                        }
                        ApiHit(newFinalJson, updatePO).then(res => {
                            if (res.status === 200) {
                                toast.success('Dispatched Sussessfully')
                                window.location.reload()
                            }
                        })
                    }
                })
            }
        }
    }

    const th = ['Product Name', 'HSN No', "Make", "Varient/Unit", 'Quantity', 'Available Quantity', 'Price', 'GST', 'CGST', 'SGST']
    let td;
    if (newData !== null) {
        td = newData?.products?.map((ele, i) => {
            const availableQty = ele.dispatchedQty ? ele.dispatchedQty !== null ? ele.dispatchedQty !== undefined ? ele.dispatchedQty !== 0 ? ele.dispatchedQty !== "0" ? Number(ele.dispatchedQty) > Number(ele.qty) ? Number(ele.dispatchedQty) - Number(ele.qty) : Number(ele.qty) - Number(ele.dispatchedQty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty);
            return (
                ele.availablePO !== '0' &&
                <tr>
                    <td className='p-2 border text-black'>{ele?.product_id?.productName || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.hsnNo || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.make || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.qty || '-'}</td>
                    <td className='p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {
                                availableQty !== 0 ?
                                    <MyInput onChange={(e) => onChangeProdcuts(ele, e.target.value, i)} title={'Available Quantity'} value={ele.dummyDispatch || ele.dummyDispatch == "" ? ele.dummyDispatch : availableQty} />
                                    :
                                    0
                            }
                        </div>
                    </td>
                    <td className='p-2 border text-black'>{ele?.price || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.gst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.cgst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.sgst || '-'}</td>
                </tr>
            )
        })
    }

    const onChangeProdcuts = (ele, value, index) => {
        var oldData = newData
        const availableQty = newData.products[index].dispatchedQty ? newData.products[index].dispatchedQty !== null ? newData.products[index].dispatchedQty !== undefined ? newData.products[index].dispatchedQty !== 0 ? newData.products[index].dispatchedQty !== "0" ? Number(newData.products[index].dispatchedQty) > Number(newData.products[index].qty) ? Number(newData.products[index].dispatchedQty) - Number(newData.products[index].qty) : Number(newData.products[index].qty) - Number(newData.products[index].dispatchedQty) : Number(newData.products[index].qty) : Number(newData.products[index].qty) : Number(newData.products[index].qty) : Number(newData.products[index].qty) : Number(newData.products[index].qty);
        if (availableQty >= value) {
            newData.products[index].dummyDispatch = value
            setNewData(oldData)
            setRender(Date.now())
        } else {
            toast.error('Quantity not availble')
        }
    }

    return (
        newData &&
        <div className='mt-7'>
            <div className='mx-5'>
                <MyFileUpload title={'Vendor Invoice'} name={'vendorInvoice'} />
            </div>
            <div className='m-5'>
                <MyFileUpload title={'Headsup Invoice'} name={'ourInvoice'} />
            </div>
            <div className='mx-5'>
                <DataTable td={td} th={th} hidePagination={true} />
            </div>
            <div className='m-5'>
                <MyButton type={loader === 'dispatch' && 'loader'} title={'Dispatch'} onClick={() => onClickDispatch()} icon={smallMoneyIcon} className={'h-10 text-xs w-max'} />
            </div>
        </div>
    )
}

export default AddDispatchOrder;