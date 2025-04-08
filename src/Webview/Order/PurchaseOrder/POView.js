import React, { useEffect, useState } from 'react'
import DataTable from '../../../Component/DataTable';
import { ApiHit, updateProductId } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../../../Component/MyButton';
import Title from '../../../Component/Title';
import { crossIcon, smallcrossIcon, smalldownloadIcon, smallEyeIcon, smallMoneyIcon } from '../../../Icons/Icon';
import { setPo } from '../../../Store/Action/OrderAction';
import { searchPO, updateOrder, updatePO } from '../../../Constants/Constants';
import POPDF from './POPDF';
import { Status } from '../../../Component/status';
import toast from 'react-hot-toast';
import { Colors } from '../../../Colors/color';
import DispatchOrder from '../Dispatch/DispatchOrder';
import POProductsView from './POProductView';
import { smallComputerIcon, smallMailIcon, smallPersonIcon, smallPhoneIcon } from '../../../SVG/Icons';
import { getAuthenticatedUserWithRoles } from '../../../Storage/Storage';
import MyInput from '../../../Component/MyInput';
import { updateDispatchedQty } from '../Dispatch/dispatchUtils';

function POView({ orderData }) {

    const OrderReducer = useSelector(state => state.OrderReducer)
    let user = getAuthenticatedUserWithRoles();

    const dispatch = useDispatch()
    const [loader, setLoader] = useState(null)
    const [showProducts, setShowProducts] = useState(null)
    const [dispatchModal, setDispatchModal] = useState(null)
    const [downloadPDF, setDownloadPDF] = useState(null)
    const [closeModal, setCloseModal] = useState(null)
    const [render, setRender] = useState(Date.now)


    useEffect(() => {
        if (OrderReducer.PO === null) {
            fetchData()
        }
    }, [render, closeModal])

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

    const th = ['Order Ref No', 'Supplier Details', 'Products', 'Status', 'Action']

    let td;
    if (OrderReducer.PO !== null) {
        if (OrderReducer.PO.content.length !== 0) {
            td = OrderReducer.PO.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='min-w-[100px] p-2 border text-black'><Title size={'xs'} title={ele?.orderRefNo || '-'} /></td>
                        <td className='min-w-[100px] text-left p-2 border text-black'>
                            <div className='flex gap-2 pb-0.5'>
                                <i>{smallComputerIcon}</i>
                                <Title size={'xs'} title={ele?.supplierDetails?.companyName || '-'} />
                            </div>
                            <div className='flex gap-2 pb-0.5'>
                                {smallPersonIcon}

                                <Title size={'xs'} title={ele?.supplierDetails?.name || '-'} />
                            </div>
                            <div className='flex gap-2 pb-0.5'>
                                {smallPhoneIcon}

                                <Title size={'xs'} title={ele?.supplierDetails?.contact || '-'} />
                            </div>
                            <div className='flex gap-2'>
                                {smallMailIcon}
                                <Title size={'xs'} title={ele?.supplierDetails?.email || '-'} />
                            </div>
                        </td>
                        <td className='min-w-[100px] p-2 border text-black'>
                            <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
                        </td>
                        <td className='min-w-[100px] p-2 border text-black'>
                            <Status title={ele.status === 'cancel' ? 'cancelled' : ele.status} className={ele.status === 'Active' ? 'bg-green-500' : ele.status === 'cancel' ? 'bg-red-500' : 'bg-green-700'} titleClass={'text-white'} />
                        </td>
                        <td className='min-w-[100px] p-2 h-24 items-center border text-black flex gap-2'>
                            {
                                ele.status !== 'cancel' &&
                                <MyButton title={'Download PO PDF'} onClick={() => setDownloadPDF(ele)} icon={smalldownloadIcon} className={'h-7 text-xs w-max'} />
                            }
                            {
                                ele.status === 'cancel' &&
                                <MyButton title={'cancelled'} bg={Colors.DARKRED} className={'h-5 text-xs w-max'} />
                            }
                            {
                                ele.status === 'Active' || ele.status === "partial_dispatched" ?
                                    <>
                                        {
                                            user?.roleObject?.roleType === 'superadmin' ?
                                                <MyButton type={loader === 'cancelPO' && 'loader'} title={'Cancel PO'} onClick={() => onClickCancelPO(ele, i)} icon={smallcrossIcon} className={'h-7 text-xs w-max'} />
                                                :
                                                user?.roleObject?.permission?.[6]?.permission?.[0]?.delete ?
                                                    <MyButton type={loader === 'cancelPO' && 'loader'} title={'Cancel PO'} onClick={() => onClickCancelPO(ele, i)} icon={smallcrossIcon} className={'h-7 text-xs w-max'} />
                                                    :
                                                    ''
                                        }
                                        {
                                            user?.roleObject?.roleType === 'superadmin' ?
                                                <MyButton title={'Dispatch'} onClick={() => setDispatchModal(JSON.stringify(ele))} icon={smallMoneyIcon} className={'h-7 text-xs w-max'} />
                                                :
                                                user?.roleObject?.permission?.[8]?.permission?.[0]?.write ?
                                                    <MyButton title={'Dispatch'} onClick={() => setDispatchModal(JSON.stringify(ele))} icon={smallMoneyIcon} className={'h-7 text-xs w-max'} />
                                                    :
                                                    ''
                                        }
                                        {
                                            user?.roleObject?.roleType === 'superadmin' ?
                                                <MyButton title={'Close mannually'} onClick={() => onClickCloseMannually(ele)} icon={smallMoneyIcon} className={'h-7 text-xs w-max'} />
                                                :
                                                user?.roleObject?.permission?.[6]?.permission?.[0]?.delete ?
                                                    <MyButton title={'Close mannually'} onClick={() => onClickCloseMannually(ele)} icon={smallMoneyIcon} className={'h-7 text-xs w-max'} />
                                                    :
                                                    ''
                                        }
                                    </>
                                    :
                                    ''
                            }
                        </td>

                    </tr>
                )
            })
        }
    }

    const onClickCloseMannually = (ele) => {
        if (ele === 'close') {

            var data = JSON.parse(closeModal)
            var finalData = updateDispatchedQty(data.products)
            if (finalData) {
                var json = {
                    ...data,
                    products: finalData,
                }
                var newFinalJson = updateProductId(json)
                if (newFinalJson) {
                    const userInput = window.prompt("Reason");
                    var poJson = {
                        _id: json._id,
                        status: 'close_mannually',
                        products: newFinalJson.products,
                        closeReason:userInput
                    }
                    // ApiHit(json, updatePO).then(res => {
                    //     if (res.status === 200) {
                    //         toast.success('Mannually close successfully')
                    //     }
                    // })
                }
            }




        } else {
            var confirmation = window.confirm('Are you sure to close this PO')
            if (confirmation) {
                setCloseModal(JSON.stringify(ele))
            }
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
        var confirmation = window.confirm('Are you sure to cancel PI')
        if (confirmation) {
            setLoader('cancelPI')
            var POData = updateProductId(OrderReducer?.PO?.content[i])
            var NewOrderData = updateProductId(orderData)
            if (POData && NewOrderData) {
                var json = {
                    status: 'cancel',
                    _id: ele?._id
                }
                ApiHit(json, updatePO).then(res => {
                    if (res.status === 200) {
                        var newOrder = removeMatchingQty(POData, NewOrderData)
                        var orderJson = {
                            products: newOrder.products,
                            _id: newOrder._id
                        }
                        ApiHit(orderJson, updateOrder).then(res => {
                            if (res.status === 200) {
                                toast.success('PI Cancel Successfully')
                                window.location.reload()
                            }
                            else {
                                setLoader(null)
                            }
                        })
                    } else {
                        setLoader(null)
                    }
                })
            }
        }
    }

    const CloseTH = ['Product Name', 'HSN No', "Make", "Varient/Unit", 'Orderd Quantity', 'Balance Quantity', 'Dispatch Quantity', 'Price', 'GST', 'CGST', 'SGST']
    let closeTD;
    if (JSON.parse(closeModal) !== null) {
        closeTD = JSON.parse(closeModal)?.products?.map((ele, i) => {
            const availableQty = ele.dispatchedQty ? ele.dispatchedQty !== null ? ele.dispatchedQty !== undefined ? ele.dispatchedQty !== 0 ? ele.dispatchedQty !== "0" ? Number(ele.dispatchedQty) > Number(ele.qty) ? Number(ele.dispatchedQty) - Number(ele.qty) : Number(ele.qty) - Number(ele.dispatchedQty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty) : Number(ele.qty);
            return (
                ele.availablePO !== '0' &&
                <tr>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.product_id?.productName || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.product_id?.hsnNo || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.product_id?.make || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.qty || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {availableQty}
                        </div>
                    </td>
                    <td className='min-w-[100px] p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {
                                availableQty !== 0 ?
                                    <MyInput onChange={(e) => onChangeProdcuts(ele, e.target.value, i)} title={'Dispatched here'} value={ele.dummyDispatch || ele.dummyDispatch === "" ? ele.dummyDispatch : "0"} />
                                    :
                                    0
                            }
                        </div>
                    </td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.price || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.productVarient?.gst || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.cgst || '-'}</td>
                    <td className='min-w-[100px] p-2 border text-black'>{ele?.sgst || '-'}</td>
                </tr>
            )
        })
    }

    const onChangeProdcuts = (ele, value, index) => {
        var oldData = JSON.parse(closeModal)
        const availableQty = oldData.products[index].dispatchedQty ? oldData.products[index].dispatchedQty !== null ? oldData.products[index].dispatchedQty !== undefined ? oldData.products[index].dispatchedQty !== 0 ? oldData.products[index].dispatchedQty !== "0" ? Number(oldData.products[index].dispatchedQty) > Number(oldData.products[index].qty) ? Number(oldData.products[index].dispatchedQty) - Number(oldData.products[index].qty) : Number(oldData.products[index].qty) - Number(oldData.products[index].dispatchedQty) : Number(oldData.products[index].qty) : Number(oldData.products[index].qty) : Number(oldData.products[index].qty) : Number(oldData.products[index].qty) : Number(oldData.products[index].qty);
        console.log('availableQty', availableQty);

        if (availableQty >= Number(value)) {
            oldData.products[index].dummyDispatch = value
            setCloseModal(JSON.stringify(oldData))
            setRender(Date.now())
        } else {
            toast.error('Quantity not availble')
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
                    <POProductsView onCloseClick={() => setShowProducts(null)} productsArr={OrderReducer?.PO?.content?.[showProducts]?.products} title={`Order Ref No ${OrderReducer?.PO?.content?.[showProducts]?.orderRefNo}`} />
                }
                {
                    closeModal !== null &&
                    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                        <div className={`relative rounded-lg card transition-opacity duration-300`}>
                            <div className='flex justify-between p-2' style={{ background: Colors.ThemeBlue }}>
                                <div>
                                    <Title size={'lg'} color={Colors.WHITE} title={'Close'} />
                                </div>
                                <div onClick={() => setCloseModal(null)} className='text-white cursor-pointer'>
                                    {crossIcon}
                                </div>
                            </div>
                            <div className='mx-5 p-5'>
                                <div className='mb-5'>
                                    <DataTable td={closeTD} th={CloseTH} hidePagination={true} />
                                </div>
                                <MyButton title={'Close'} onClick={() => onClickCloseMannually('close')} />
                            </div>
                        </div>
                    </div>
                }
                {
                    dispatchModal !== null &&
                    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                        <div className={`relative rounded-lg card transition-opacity duration-300`}>
                            <div className='flex justify-between p-2' style={{ background: Colors.ThemeBlue }}>
                                <div>
                                    <Title size={'lg'} color={Colors.WHITE} title={'Dispatch'} />
                                </div>
                                <div onClick={() => setDispatchModal(null)} className='text-white cursor-pointer'>
                                    {crossIcon}
                                </div>
                            </div>
                            <DispatchOrder data={JSON.parse(dispatchModal)} />
                        </div>
                    </div>
                }
            </div>
            :
            <POPDF onClickBack={() => setDownloadPDF(null)} data={downloadPDF} />
    )
}

export default POView;