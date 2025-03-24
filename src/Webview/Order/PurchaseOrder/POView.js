import React, { useEffect, useState } from 'react'
import DataTable from '../../../Component/DataTable';
import { ApiHit, updateProductId } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../../../Component/MyButton';
import Title from '../../../Component/Title';
import { crossIcon, smallcrossIcon, smalldownloadIcon, smallEyeIcon, smallMoneyIcon } from '../../../Icons/Icon';
import OrderProductsView from '../OrderProductsView';
import { setPo } from '../../../Store/Action/OrderAction';
import { searchPO, updateOrder, updatePO } from '../../../Constants/Constants';
import POPDF from './POPDF';
import { Status } from '../../../Component/status';
import toast from 'react-hot-toast';
import { Colors } from '../../../Colors/color';
import MyFileUpload from '../../../Component/MyFileUpload';
import DispatchOrder from './DispatchOrder';

function POView({ orderData }) {

    const OrderReducer = useSelector(state => state.OrderReducer)
    const ApiReducer = useSelector(state => state.ApiReducer)

    const dispatch = useDispatch()
    const [loader, setLoader] = useState(null)
    const [showProducts, setShowProducts] = useState(null)
    const [dispatchModal, setDispatchModal] = useState(null)
    const [downloadPDF, setDownloadPDF] = useState(null)

    useEffect(() => {
        if (OrderReducer.PO === null) {
            fetchData()
        }
    }, [])

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {
                order_id: orderData._id
            }
        }
        ApiHit(json, searchPO).then(res => {
            if (res?.content) {
                dispatch(setPo(res))
            }
        })
    }

    const th = ['Order Ref No', 'Products', 'Status', 'Action']

    let td;
    if (OrderReducer.PO !== null) {
        if (OrderReducer.PO.content.length !== 0) {
            td = OrderReducer.PO.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.orderRefNo || '-'} /></td>
                        <td className='p-2 border text-black'>
                            <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
                        </td>
                        <td className='p-2 border text-black'>
                            <Status title={ele.status === 'cancel' ? 'cancelled' : ele.status} className={ele.status === 'Active' ? 'bg-green-500' : ele.status === 'cancel' ? 'bg-red-500' : 'bg-green-700'} titleClass={'text-white'} />
                        </td>
                        <td className='p-2 border text-black flex gap-2'>
                            {
                                ele.status === 'cancel' &&
                                <MyButton title={'cancelled'} bg={Colors.DARKRED} className={'h-7 text-xs w-max'} />
                            }
                            {
                                ele.status === 'Active' && ele.status !== 'cancel' &&
                                <MyButton title={'Download PO PDF'} onClick={() => setDownloadPDF(ele)} icon={smalldownloadIcon} className={'h-7 text-xs w-max'} />
                            }
                            {
                                ele.status === 'Active' &&
                                <>
                                    <MyButton type={loader === 'cancelPO'&&'loader'} title={'Cancel PO'} onClick={() => onClickCancelPO(ele, i)} icon={smallcrossIcon} className={'h-7 text-xs w-max'} />
                                    <MyButton title={'Dispatch'} onClick={() => setDispatchModal(JSON.stringify(ele))} icon={smallMoneyIcon} className={'h-7 text-xs w-max'} />
                                </>
                            }
                        </td>

                    </tr>
                )
            })
        }
    }

    const onClickDispatch = () => {
        if (!ApiReducer?.apiJson?.headsupInvoice && !ApiReducer?.apiJson?.vendorInvoice) {
            toast.error('Both invoice are required')
        } else {
            var json = {
                status: 'Dispatched',
                _id: dispatchModal._id,
                headsupInvoice: ApiReducer?.apiJson?.headsupInvoice,
                vendorInvoice: ApiReducer?.apiJson?.vendorInvoice
            }
            // ApiHit(json,updatePO).then(res=>{
            //     if(res.status === 200){
            //         toast.success('Order Dispatched')
            //     }
            // })
        }
    }

    function removeMatchingQty(poData, orderData) {
        if (!poData.products || !orderData.products) return orderData;
        poData.products.forEach(poProduct => {
            orderData.products.forEach(orderProduct => {
                if (orderProduct.productVarient.varientName === poProduct.productVarient.varientName && orderProduct.product_id === poProduct.product_id && orderProduct.availablePO) {
                    let removed = false; // Flag to ensure only one occurrence is removed
                    orderProduct.availablePO = orderProduct.availablePO.filter(qty => {
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


    const onClickCancelPO = (ele, i) => {
        var confirmation = window.confirm('Are you sure to cancel PO')
        if (confirmation) {
            setLoader('cancelPO')
            var PoData = updateProductId(OrderReducer?.PO?.content[i])
            var NewOrderData = updateProductId(orderData)
            if (PoData && NewOrderData) {
                var json = {
                    status: 'cancel',
                    _id: ele?._id
                }
                ApiHit(json, updatePO).then(res => {
                    if (res.status === 200) {
                        var newOrder = removeMatchingQty(PoData, NewOrderData)
                        var orderJson = {
                            products: newOrder.products,
                            _id: newOrder._id
                        }
                        ApiHit(orderJson, updateOrder).then(res => {
                            if (res.status === 200) {
                                toast.success('Order Cancel Successfully')
                                window.location.reload()
                            }else{
                                setLoader(null)
                            }
                        })
                    }else{
                        setLoader(null)
                    }
                })
            }
        }
    }

    return (
        downloadPDF === null ?
            <div className='mt-10'>
                <div className='mt-5 p-5 bg-white'>
                    <DataTable th={th} td={td} totalPages={OrderReducer?.PO?.totalPages} api={fetchData} />
                </div>
                {
                    showProducts !== null &&
                    <OrderProductsView onCloseClick={() => setShowProducts(null)} productsArr={OrderReducer?.PO?.content?.[showProducts]?.products} title={`Order Ref No ${OrderReducer?.PO?.content?.[showProducts]?.orderRefNo}`} />
                }
                {
                    dispatchModal !== null &&
                    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                        <div className={`relative rounded-lg card w-[60%] transition-opacity duration-300`}>
                            <div className='flex justify-between p-2' style={{ background: Colors.ThemeBlue }}>
                                <div>
                                    <Title size={'lg'} color={Colors.WHITE} title={'Dispatch'} />
                                </div>
                                <div onClick={() => setDispatchModal(null)} className='text-white cursor-pointer'>
                                    {crossIcon}
                                </div>
                            </div>
                            <DispatchOrder data={JSON.parse(dispatchModal)}/>
                        </div>
                    </div>
                }
            </div>
            :
            <POPDF onClickBack={() => setDownloadPDF(null)} data={downloadPDF} />
    )
}

export default POView;