import React, { useEffect, useState } from 'react'
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { InActive, QuotationInitiated, searchOrder, tableTdClass, updateLead, updateOrder } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { crossIcon, smallEyeIcon } from '../../Icons/Icon';
import OrderProductsView from './OrderProductsView';
import { setDispatch, setOrder, setPi, setPo } from '../../Store/Action/OrderAction';
import { Colors } from '../../Colors/color';
import AddPO from './PurchaseOrder/AddPO';
import AddDispatch from './Dispatch/AddDispatch';
import AddPI from './ProformaInvoice/AddPI';
import toast from 'react-hot-toast';
import MyLoader from '../../Component/MyLoader';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';
import CustomerView from '../../Component/CustomerView';
import { Status } from '../../Component/status';
import FileRenderer from '../Customer/FileRenderer';

function Order() {

    const OrderReducer = useSelector(state => state.OrderReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)

    let user = getAuthenticatedUserWithRoles();

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [modal, setModal] = useState(null)
    const [singleOrderData, setSingleOrderData] = useState(null)
    const [loader, setLoader] = useState(null)
    const width = window.innerWidth
    const [costomerModal, setCustomerModal] = useState(null)
    const [clientPOModal, setClientPOModal] = useState(null)

    useEffect(() => {
        if (OrderReducer.doc === null) {
            fetchData()
        }
    }, [])

    const fetchData = () => {
        var search = user?.roleObject?.roleType === 'superadmin' ? {} : {}
        var json = {
            page: PaginationReducer.pagination.page,
            limit: PaginationReducer.pagination.limit,
            search: search
        }
        ApiHit(json, searchOrder).then(res => {
            if (res?.content) {
                dispatch(setOrder(res))
            }
        })
    }

    const th = ['Order Ref No', 'Comapny Name', 'Lead Source', 'Client PO', 'Customer', 'Products', 'Action']

    let td;
    if (OrderReducer.doc !== null) {
        if (OrderReducer.doc.content.length !== 0) {
            td = OrderReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.orderRefNo || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.customerDetails?.companyName || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.customerDetails?.leadSource || '-'} /></td>
                        <td className={tableTdClass}>
                            <div className='flex justify-center'>
                                <MyButton onClick={() => setClientPOModal(JSON.stringify(ele))} title={'View Client PO'} />
                            </div>
                        </td>
                        <td className={tableTdClass}>
                            <div className='flex justify-center'>
                                <MyButton onClick={() => setCustomerModal(JSON.stringify(ele?.customerDetails))} icon={smallEyeIcon} title={'View Customer'} className={'text-xs w-max'} />
                            </div>
                        </td>
                        <td className={tableTdClass}>
                            <div className='flex justify-center'>
                                <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'text-xs w-max'} />
                            </div>
                        </td>
                        <td className={tableTdClass}>
                            <div className='flex justify-center'>
                                {
                                    ele.status !== InActive ?
                                        <div className='flex gap-2'>
                                            {
                                                user?.roleObject?.roleType === 'superadmin' ?
                                                    <div onClick={() => setModalType('PI', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                        <p className='p-2 rounded-lg w-10' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PI</p>
                                                    </div>
                                                    :
                                                    user?.roleObject?.permission?.[7]?.permission?.[0]?.read &&
                                                    <div onClick={() => setModalType('PI', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                        <p className='p-2 rounded-lg w-10' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PI</p>
                                                    </div>
                                            }
                                            {
                                                user?.roleObject?.roleType === 'superadmin' ?
                                                    <div onClick={() => setModalType('PO', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                        <p className={`p-2 rounded-lg w-10 `} style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PO</p>
                                                    </div>
                                                    :
                                                    user?.roleObject?.permission?.[6]?.permission?.[0]?.read &&
                                                    <div onClick={() => setModalType('PO', ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                        <p className={`p-2 rounded-lg w-10 `} style={{ border: `1px solid ${Colors.ThemeBlue}` }}>PO</p>
                                                    </div>
                                            }
                                            {
                                                user?.roleObject?.roleType === 'superadmin' ?
                                                    loader === 'cancelOrder' ?
                                                        <div className='p-2'>
                                                            <MyLoader />
                                                        </div>
                                                        :
                                                        <div onClick={() => onClickCancelOrder(ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                            <p className='p-2 rounded-lg' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>Cancel Order</p>
                                                        </div>
                                                    :
                                                    user?.roleObject?.permission?.[2]?.permission?.[0]?.write ?
                                                        loader === 'cancelOrder' ?
                                                            <div className='p-2'>
                                                                <MyLoader />
                                                            </div>
                                                            :
                                                            <div onClick={() => onClickCancelOrder(ele)} className='cursor-pointer' style={{ color: Colors.ThemeBlue }}>
                                                                <p className='p-2 rounded-lg' style={{ border: `1px solid ${Colors.ThemeBlue}` }}>Cancel Order</p>
                                                            </div>
                                                        :
                                                        ''

                                            }
                                        </div>
                                        :
                                        <Status className={'bg-red-400 text-white p-1'} title={'Cancelled'} />
                                }
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    console.log(user?.roleObject);

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

    const onClickCloseModal = () => {
        setModal(null)
        dispatch(setPo(null))
        dispatch(setPi(null))
        dispatch(setDispatch(null))
    }

    return (
        <div className='mt-10'>
            <div className='card p-4'>
                <Title title={'Order'} size={'lg'} color={Colors.BLACK}/>
            </div>
            <div className='mt-5 p-5 bg-white overflow-scroll' style={{ width: width / 1.3 }}>
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
                            <div onClick={() => onClickCloseModal()}>
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
            {
                clientPOModal !== null &&
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                    <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                    <div className={`relative rounded-lg card w-[80%] transition-opacity duration-300`}>
                        <div className="flex justify-between rounded-tl-lg rounded-tr-lg p-2 text-white" style={{ background: Colors.ThemeBlue }}>
                            <div>
                                <Title size={'lg'} title={'Client PO Details'} />
                            </div>
                            <div onClick={() => setClientPOModal(null)}>
                                {crossIcon}
                            </div>
                        </div>
                        <div className="p-10 text-center">
                            <Title size={'lg'} color={Colors.BLACK} title={'Client PO'} />
                            <center>
                                {
                                    <FileRenderer fileId={JSON.parse(clientPOModal)?.po?.url} />
                                }
                            </center>
                        </div>
                    </div>
                </div>
            }
            {
                costomerModal !== null &&
                <CustomerView data={JSON.parse(costomerModal)} onClickClose={() => setCustomerModal(null)} />
            }
        </div>
    )
}

export default Order;