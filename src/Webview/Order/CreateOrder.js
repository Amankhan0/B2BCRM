import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import { ApiHit, updateProductId, updateProductIdWithAvailablePOPIDispatch } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Active, addOrder, OrderInitiated, searchCustomer, searchLead, searchQuotation, selectClass, updateLead } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import { localLeadData } from '../Lead/localLeadData';
import MyCheckBox from '../../Component/MyCheckBox';
import MyInput from '../../Component/MyInput';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON } from '../../Store/ActionName/ActionName';
import { CrossMark } from '../../SVG/Icons';
import Title from '../../Component/Title';
import DataTable from '../../Component/DataTable';
import toast from 'react-hot-toast';
import MyFileUpload from '../../Component/MyFileUpload';

function CreateOrder() {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const [customer, setCustomer] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [billingAddress, setBillingAddress] = useState(null)
    const [shippingAddress, setShippingAddress] = useState(null)
    const [quotation, setQuotation] = useState(null)
    const [paymentTerm, setPaymentTerm] = useState(null)
    const [loader, setLoader] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (quotation === null) {
            fetchData()
        } else if (customer === null) {
            fetchCustomerData()
        } else if (selectedCustomer === null && ApiReducer?.apiJson?.customerDetails?.billingAddress !== null && ApiReducer?.apiJson?.customerDetails?.shippingAddress !== null) {
            var item = customer.content.find((ele, i) => ele.name + ele.pancardNo === ApiReducer?.apiJson?.customerDetails?.name + ApiReducer?.apiJson?.customerDetails?.pancardNo)
            setSelectedCustomer(item)
        }
    }, [quotation, customer])

    const fetchData = () => {
        var path = window.location.pathname.split('/')[2]
        var json = {
            page: 1,
            limit: 1,
            search: {
                _id: path
            }
        }
        ApiHit(json, searchQuotation).then(res => {
            if (res?.content) {
                var compileRes = res
                delete compileRes.content[0].quotationRefNo
                compileRes.content[0].quotation_id = compileRes.content[0]._id
                delete compileRes?.content?.[0]?._id
                setQuotation(res)
                dispatch(setDataAction(res?.content?.[0], SET_API_JSON))
            }
        })
    }

    const fetchCustomerData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {
            }
        }
        ApiHit(json, searchCustomer).then(res => {
            if (res?.content) {
                setCustomer(res)
            }
        })
    }

    const onChnageCustomer = (value) => {
        var item = customer.content.find((ele, i) => ele._id === value)
        var oldJson = ApiReducer.apiJson
        var leadSource = oldJson.customerDetails.leadSource
        oldJson.customerDetails = {
            ...item,
            billingAddress: item.billingAddresses,
            shippingAddress: item.shippingAddresses,
        }
        console.log('oldJson', oldJson);

        if (!oldJson.customerDetails.leadSource) {
            oldJson.customerDetails.leadSource = leadSource
        }
        setSelectedCustomer(item)
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    const th = ['Product Name', 'HSN No', 'Make', 'Varient Name', 'Price', 'Quantity', 'CGST', 'SGST', 'GST']

    let td;
    if (quotation !== null) {
        td = quotation.content[0].products.map((ele, i) => {
            return (
                <tr>
                    <td className='p-2 border text-black'>{ele?.product_id?.productName || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.hsnNo || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.make || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit || '-'}</td>
                    {/* <td className='p-2 border text-black'>{ele?.productVarient?.varientUnit || '-'}</td> */}
                    <td className='p-2 border text-black'>{ele?.price || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.qty || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.cgst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.sgst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.gst || '-'}</td>
                </tr>
            )
        })
    }

    const onClickSubmit = () => {
        if (billingAddress === null || shippingAddress === null || selectedCustomer === null) {
            toast.error('Please add customer details')
        }
        else if (!ApiReducer?.apiJson?.po || ApiReducer?.apiJson?.po === null) {
            toast.error('PO is required')
        }
        else if (paymentTerm === null) {
            toast.error('Payment term is required')
        }
        else if (paymentTerm !== null && paymentTerm === 'Credit' && !ApiReducer?.apiJson?.days) {
            toast.error('Days term is required')
        }
        else {
            setLoader(true)
            var json = ApiReducer?.apiJson
            var updatedOrderJson = updateProductIdWithAvailablePOPIDispatch(json)
            updatedOrderJson.customerDetails.billingAddress = selectedCustomer.billingAddresses[billingAddress]
            updatedOrderJson.customerDetails.shippingAddress = selectedCustomer.shippingAddresses[shippingAddress]
            updatedOrderJson.paymentTerm = {
                type: paymentTerm,
                days: paymentTerm === 'Credit' ? ApiReducer?.apiJson?.days : 'NA'
            }
            console.log('updatedOrderJson',updatedOrderJson);
            
            ApiHit(updatedOrderJson, addOrder).then(res => {
                if (res.status === 200) {
                    var leadJson = {
                        _id: updatedOrderJson.lead_id,
                        status: OrderInitiated
                    }
                    ApiHit(leadJson, updateLead).then(result => {
                        setLoader(false)
                        if (result.status === 200) {
                            toast.success('Order created successfully')
                            window.location.pathname = '/order'
                        }
                    })
                } else {
                    toast.error(res.message)
                }
            })
        }
    }

    console.log('ApiReducer?.apiJson', ApiReducer?.apiJson);


    return (

        quotation !== null && customer !== null &&
        <div className='mt-10'>
            <div className='grid grid-cols-3 gap-3'>
                <div className='m-2'>
                    <Title color={Colors.BLACK} title={'Select Customer'} size={'base'} />
                    <select onChange={(e) => onChnageCustomer(e.target.value)} className={selectClass}>
                        <option selected={selectedCustomer === null}>Select Customer</option>
                        {
                            customer?.content?.map((ele, i) => {
                                return (
                                    <option selected={selectedCustomer !== null ? selectedCustomer.name + selectedCustomer.pancardNo === ele.name + ele.pancardNo : false} value={ele._id}>{ele.name}{ele.companyName && ele.companyName !== null && `(${ele.companyName})`}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            {
                selectedCustomer !== null &&
                <div className='grid grid-cols-3 gap-3'>
                    <div className='m-2'>
                        <Title color={Colors.BLACK} title={'Select Billing Address'} size={'base'} />
                        <select onChange={(e) => setBillingAddress(Number(e.target.value))} className={selectClass}>
                            <option selected={billingAddress === null}>Select Billing Address</option>
                            {
                                selectedCustomer?.billingAddresses?.map((ele, i) => {
                                    return (
                                        <option selected={billingAddress === i} value={i}>{ele.address}, {ele.landmark}, {ele.city}, {ele.pinCode}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='m-2'>
                        <Title color={Colors.BLACK} title={'Select Shipping Address'} size={'base'} />
                        <select onChange={(e) => setShippingAddress(Number(e.target.value))} className={selectClass}>
                            <option selected={selectedCustomer === null}>Select Shipping Address</option>
                            {
                                selectedCustomer?.shippingAddresses?.map((ele, i) => {
                                    return (
                                        <option selected={shippingAddress === i} value={i}>{ele.address}, {ele.landmark}, {ele.city}, {ele.pinCode}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            }
            <div className='grid grid-cols-3 gap-3 m-2'>
                <div className='m-2'>
                    <MyFileUpload title='Upload PO' name='po' error={false} />
                </div>
                <div className='m-2'>
                    <Title color={Colors.BLACK} title={'Select Payment Term'} size={'base'} />
                    <select onChange={(e) => setPaymentTerm(e.target.value)} className={selectClass}>
                        <option selected={paymentTerm === null} value={null}>Select Payment Term</option>
                        <option>Advance</option>
                        <option>LC</option>
                        <option>BG</option>
                        <option>Credit</option>
                    </select>
                </div>
                {
                    paymentTerm === 'Credit' &&
                    <div className='m-2'>
                        <MyInput title={'Days'} name={'days'} placeholder={'Enter Days'} />
                    </div>
                }
            </div>
            {
                quotation !== null &&
                <div className='mt-5'>
                    <p className='text-black text-lg'>Product Details : </p>
                    <DataTable th={th} td={td} hidePagination={true} />
                </div>
            }

            <div className='mt-5'>
                <MyButton title={'Submit'} onClick={() => onClickSubmit()} />
            </div>
        </div>
    )
}

export default CreateOrder;