import React, { useEffect, useState } from 'react'
import DataTable from '../../../Component/DataTable';
import { ApiHit, updateProductId } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../../../Component/MyButton';
import Title from '../../../Component/Title';
import { crossIcon, downloadIcon, smallcrossIcon, smalldownloadIcon, smallEyeIcon } from '../../../Icons/Icon';
import OrderProductsView from '../OrderProductsView';
import { setDispatch, setPi } from '../../../Store/Action/OrderAction';
import { Colors } from '../../../Colors/color';
import PI from '../PI';
import { searchDispatch, searchPO, updateOrder, updateDispatch, searchPI, updatePI } from '../../../Constants/Constants';
import { Status } from '../../../Component/status';
import toast from 'react-hot-toast';
import PIPDF from './PIPDF';

function PIView({ orderData }) {

    const OrderReducer = useSelector(state => state.OrderReducer)

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [loader, setLoader] = useState(null)
    const [downloadPDF, setDownloadPDF] = useState(null)

    useEffect(() => {
        if (OrderReducer.PI === null) {
            fetchData()
        }
    }, [])

    console.log('orderData', orderData);


    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {
                order_id: orderData._id
            }
        }
        console.log('json', json);

        ApiHit(json, searchPI).then(res => {
            if (res?.content) {
                dispatch(setPi(res))
            }
        })
    }

    const th = ['Order Ref No', 'Products', 'Status', 'Action']

    let td;
    if (OrderReducer.PI !== null) {
        if (OrderReducer.PI.content.length !== 0) {
            td = OrderReducer.PI.content.map((ele, i) => {
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
                                <MyButton type={loader==='cancelPI'&&'loader'} title={'Cancel PI'} onClick={() => onClickCancelPI(ele, i)} icon={smallcrossIcon} className={'h-7 text-xs w-max'} />
                            </td>
                        }
                    </tr>
                )
            })
        }
    }

    function removeMatchingQty(PIData, orderData) {
        if (!PIData.products || !orderData.products) return orderData;

        PIData.products.forEach(poProduct => {
            orderData.products.forEach(orderProduct => {
                if (orderProduct.productVarient.varientName === poProduct.productVarient.varientName && orderProduct.product_id === poProduct.product_id && orderProduct.availablePI) {
                    let removed = false; // Flag to ensure only one occurrence is removed
                    orderProduct.availablePI = orderProduct.availablePI.filter(qty => {
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


    const onClickCancelPI = (ele, i) => {
        var confirmation = window.confirm('Are you sure to cancel PI')
        if (confirmation) {
            setLoader('cancelPI')
            var PIData = updateProductId(OrderReducer?.PI?.content[i])
            var NewOrderData = updateProductId(orderData)

            if (PIData && NewOrderData) {
                var json = {
                    status: 'cancel',
                    _id: ele?._id
                }

                var newOrder = removeMatchingQty(PIData, NewOrderData)
                var orderJson = {
                    products: newOrder.products,
                    _id: newOrder._id
                }                

                ApiHit(json, updatePI).then(res => {
                    if (res.status === 200) {
                        var newOrder = removeMatchingQty(PIData, NewOrderData)
                        var orderJson = {
                            products: newOrder.products,
                            _id: newOrder._id
                        }
                        ApiHit(orderJson, updateOrder).then(res => {
                            if (res.status === 200) {
                                toast.success('PI Cancel Successfully')
                                window.location.reload()
                            }
                            else{
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
                    <DataTable th={th} td={td} totalPages={OrderReducer?.PI?.totalPages} api={fetchData} />
                </div>
                {
                    showProducts !== null &&
                    <OrderProductsView onCloseClick={() => setShowProducts(null)} productsArr={OrderReducer?.PI?.content?.[showProducts]?.products} title={`Order Ref No ${OrderReducer?.PI?.content?.[showProducts]?.orderRefNo}`} />
                }
            </div>
            :
            <PIPDF onClickBack={() => setDownloadPDF(null)} data={downloadPDF} />
    )
}

export default PIView;