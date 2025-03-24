import React, { useEffect, useState } from 'react'
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Active, InActive, OrderInitiated, QuotationInitiated, searchOrder, updateLead, updateOrder } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { crossIcon, smallEyeIcon } from '../../Icons/Icon';
import OrderProductsView from './OrderProductsView';
import { setOrder } from '../../Store/Action/OrderAction';
import { Colors } from '../../Colors/color';
import PI from './PI';
import AddPO from './PurchaseOrder/AddPO';
import AddDispatch from './Dispatch/AddDispatch';
import AddPI from './ProformaInvoice/AddPI';
import toast from 'react-hot-toast';
import MyLoader from '../../Component/MyLoader';
import { smallComputerIcon, smallMailIcon, smallPersonIcon, smallPhoneIcon, trashbin } from '../../SVG/Icons';

function Order() {

    const OrderReducer = useSelector(state => state.OrderReducer)

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [modal, setModal] = useState(null)
    const [singleOrderData, setSingleOrderData] = useState(null)
    const [loader, setLoader] = useState(null)

    useEffect(() => {
        if (OrderReducer.doc === null) {
            fetchData()
        }
    }, [])

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {}
        }
        ApiHit(json, searchOrder).then(res => {
            if (res?.content) {
                dispatch(setOrder(res))
            }
        })
    }

    const th = ['Order Ref No', 'Customer Detials', 'Company Size', 'Lead Source', 'Industry', 'Products', 'Action']

    let td;
    if (OrderReducer.doc !== null) {
        if (OrderReducer.doc.content.length !== 0) {
            td = OrderReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.orderRefNo || '-'} /></td>

                        <td className='text-left p-2 border text-black'>
                            <div className='flex gap-2 pb-0.5'>
                                <i>{smallComputerIcon}</i>
                                <Title size={'xs'} title={ele?.customerDetails?.companyName || '-'} />
                            </div>
                            <div className='flex gap-2 pb-0.5'>
                                {smallPersonIcon}

                                <Title size={'xs'} title={ele?.customerDetails?.name || '-'} />
                            </div>
                            <div className='flex gap-2 pb-0.5'>
                                {smallPhoneIcon}

                                <Title size={'xs'} title={ele?.customerDetails?.contact || '-'} />
                            </div>
                            <div className='flex gap-2'>
                                {smallMailIcon}
                                <Title size={'xs'} title={ele?.customerDetails?.email || '-'} />
                            </div>
                        </td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.companySize || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.leadSource || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.industry || '-'} /></td>
                        <td className='p-2 border text-black'>
                            <div className='flex justify-center'>
                                <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'text-xs w-max'} />
                            </div>
                        </td>
                        <td className='p-2 border text-black'>
                            <div className='flex justify-center'>
                                {
                                    ele.status !== InActive &&
                                    <div className='flex gap-2'>
                                        <div onClick={() => setModalType('PI', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                            <p className='p-2 rounded-lg w-10' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PI</p>
                                        </div>
                                        <div onClick={() => setModalType('PO', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                            <p className={`p-2 rounded-lg w-10 `} style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PO</p>
                                        </div>
                                        {
                                            loader === 'cancelOrder' ?
                                                <div className='p-2'>
                                                    <MyLoader />
                                                </div>

                                                :
                                                <div onClick={() => onClickCancelOrder(ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                    <p className='p-2 rounded-lg' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>Cancel Order</p>
                                                </div>

                                        }
                                    </div>
                                }
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    const onClickCancelOrder = (ele) => {
        var confirmation = window.confirm('Are you sure to cancel this order')
        if (confirmation) {
            var json = {
                status: InActive,
                _id: ele._id
            }
            setLoader('cancelOrder')
            ApiHit(json, updateOrder).then(res => {
                if (res.status === 200) {
                    var leadJson = {
                        _id: ele?.lead_id,
                        status: QuotationInitiated
                    }
                    ApiHit(leadJson, updateLead).then(result => {
                        if (result.status === 200) {
                            setLoader(null)
                            toast.success('Order Canceld')
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

    const setModalType = (type, data) => {
        setModal(type)
        setSingleOrderData(data)
    }

    return (
        <div className='mt-10'>
            <div className='mt-5 p-5 bg-white'>
                <DataTable th={th} td={td} totalPages={OrderReducer?.doc?.totalPages} api={fetchData} />
            </div>
            {
                showProducts !== null &&
                <OrderProductsView onCloseClick={() => setShowProducts(null)} productsArr={OrderReducer?.doc?.content?.[showProducts]?.products} title={`Order Ref No ${OrderReducer?.doc?.content?.[showProducts]?.orderRefNo}`} />
            }
            {
                modal !== null && singleOrderData !== null &&
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                    <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                    <div className={`relative rounded-lg card w-[80%] transition-opacity duration-300`}>
                        <div className="flex justify-between rounded-tl-lg rounded-tr-lg p-2 text-white" style={{ background: Colors.ThemeBlue }}>
                            <div>
                                <Title size={'lg'} title={modal + ' Details'} />
                            </div>
                            <div onClick={() => setModal(null)}>
                                {crossIcon}
                            </div>
                        </div>
                        {
                            modal === 'PO' ?
                                <AddPO orderData={singleOrderData} />
                                :
                                modal === 'PI' ?
                                    <AddPI orderData={singleOrderData} />
                                    :
                                    <AddDispatch orderData={singleOrderData} />
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Order;