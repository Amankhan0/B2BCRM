import React, { useEffect, useState } from 'react'
import DataTable from '../../../Component/DataTable';
import { ApiHit, updateProductId } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../../../Component/MyButton';
import Title from '../../../Component/Title';
import { crossIcon, downloadIcon, smallcrossIcon, smalldownloadIcon, smallEyeIcon } from '../../../Icons/Icon';
import OrderProductsView from '../OrderProductsView';
import { setDispatch } from '../../../Store/Action/OrderAction';
import { Colors } from '../../../Colors/color';
import PI from '../PI';
import { searchDispatch, searchPO, updateOrder, updateDispatch } from '../../../Constants/Constants';
import { Status } from '../../../Component/status';
import toast from 'react-hot-toast';
import DispatchData from './DispatchPDF';

function DispatchView({ orderData }) {

    const OrderReducer = useSelector(state => state.OrderReducer)

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [downloadPDF, setDownloadPDF] = useState(null)

    useEffect(() => {
        if (OrderReducer.Dispatch === null) {
            fetchData()
        }
    }, [])

    console.log('orderData',orderData);
    

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {
                order_id: orderData._id
            }
        }
        console.log('json',json);
        
        ApiHit(json, searchDispatch).then(res => {
            if (res?.content) {
                dispatch(setDispatch(res))
            }
        })
    }

    const th = ['Order Ref No', 'Products', 'Status', 'Action']

    let td;
    if (OrderReducer.Dispatch !== null) {
        if (OrderReducer.Dispatch.content.length !== 0) {
            td = OrderReducer.Dispatch.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='min-w-[100px] p-2 border text-black'><Title size={'xs'} title={ele?.orderRefNo || '-'} /></td>
                        <td className='min-w-[100px] p-2 border text-black'>
                            <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
                        </td>
                        <td className='min-w-[100px] p-2 border text-black'>
                            <Status title={ele.status} className={ele.status === 'Active' ? 'bg-green-500' : 'bg-orange-600'} titleClass={'text-white'} />
                        </td>
                        {
                            ele.status === 'Active' &&
                            <td className='min-w-[100px] p-2 border text-black flex gap-2'>
                                <MyButton title={'Download PDF'} onClick={() => setDownloadPDF(ele)} icon={smalldownloadIcon} className={'h-7 text-xs w-max'} />
                                {/* <MyButton title={'Cancel PO'} onClick={() => onClickCancelPO(ele, i)} icon={smallcrossIcon} className={'h-7 text-xs w-max'} /> */}
                            </td>
                        }
                    </tr>
                )
            })
        }
    }

    function removeMatchingQty(DispatchData, orderData) {
        if (!DispatchData.products || !orderData.products) return orderData;

        DispatchData.products.forEach(poProduct => {
            orderData.products.forEach(orderProduct => {
                if (orderProduct.productVarient.varientName === poProduct.productVarient.varientName && orderProduct.product_id === poProduct.product_id && orderProduct.availableDispatch) {
                    let removed = false; // Flag to ensure only one occurrence is removed
                    orderProduct.availableDispatch = orderProduct.availableDispatch.filter(qty => {
                        if (!removed && qty === poProduct.qty) {
                            removed = true;
                            return false; // Remove only one occurrence
                        }
                        return true;
                    });
                }
            });
        });

        return orderData;
    }


    const onClickCancelDispatch = (ele, i) => {
        var confirmation = window.confirm('Are you sure to cancel PO')
        if (confirmation) {
            var DispatchData = updateProductId(OrderReducer?.Dispatch?.content[i])
            var NewOrderData = updateProductId(orderData)

            if (DispatchData && NewOrderData) {
                var json = {
                    status: 'cancel',
                    _id: ele?._id
                }
                ApiHit(json, updateDispatch).then(res => {
                    if (res.status === 200) {
                        var newOrder = removeMatchingQty(DispatchData, NewOrderData)
                        var orderJson = {
                            products: newOrder.products,
                            _id: newOrder._id
                        }
                        ApiHit(orderJson, updateOrder).then(res => {
                            if (res.status === 200) {
                                toast.success('Order Cancel Successfully')
                            }
                        })
                    }
                })
            }
        }
    }

    return (
        downloadPDF === null ?
            <div className='mt-10'>
                <div className='mt-5 p-5 bg-white'>
                    <DataTable th={th} td={td} totalPages={OrderReducer?.Dispatch?.totalPages} api={fetchData} />
                </div>
                {
                    showProducts !== null &&
                    <OrderProductsView onCloseClick={() => setShowProducts(null)} productsArr={OrderReducer?.Dispatch?.content?.[showProducts]?.products} title={`Order Ref No ${OrderReducer?.Dispatch?.content?.[showProducts]?.orderRefNo}`} />
                }
            </div>
            :
            <DispatchData onClickBack={() => setDownloadPDF(null)} data={downloadPDF} />
    )
}

export default DispatchView;