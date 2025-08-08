import React, { useEffect, useState } from 'react'
// import POPDF from '..';
import Title from '../../../Component/Title';
import { Colors } from '../../../Colors/color';
import MyInput from '../../../Component/MyInput';
import DataTable from '../../../Component/DataTable';
import toast from 'react-hot-toast';
import MyButton from '../../../Component/MyButton';
import MyCheckBox from '../../../Component/MyCheckBox';
import { ApiHit, updateAvaialblePO, updateProductId, updateProductIdWithPO, updateProductPOAvailableOrNot } from '../../../utils';
import { addOrder, addPO, B2BBillingAddress, searchSupplier, selectClass, updateOrder } from '../../../Constants/Constants';
import POView from './POView';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../../Store/Action/SetDataAction';
import { SET_API_JSON } from '../../../Store/ActionName/ActionName';
import { search } from '../../../SVG/Icons';
import ReactQuill from 'react-quill';
import { getAuthenticatedUserWithRoles } from '../../../Storage/Storage';
import { OrderInvoiceDetails } from '../../OrderInvoiceDetails';

function AddPO({ orderData }) {

    const ApiReducer = useSelector(state => state.ApiReducer)
    let user = getAuthenticatedUserWithRoles();
    const [content, setContent] = useState(OrderInvoiceDetails.companyDetails.permissions);

    const [data, setData] = useState(null)
    const [loader, setLoader] = useState(null)
    const [render, setRender] = useState(Date.now())
    const [page, setPage] = useState(0)
    const [paymentTerm, setPaymentTerm] = useState(null)
    const [vendorData, setVendorData] = useState(null)
    const [selectedVendor, setSelectedVendor] = useState(null)
    const [warehouseAddresses, setWarehouseAddresses] = useState(null)
    const [gstAddresses, setGstAddresses] = useState(null)

    const [removePOAvailableOrNOt, setRemovePOAvailableOrNot] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (orderData && data === null) {
            setData(orderData)
            setPaymentTerm(orderData.paymentTerm.type)
            var oldJson = ApiReducer.apiJson
            oldJson.days = orderData.paymentTerm.days
            dispatch(setDataAction(oldJson, SET_API_JSON))
        }
        if (vendorData === null) {
            fetchVendorData()
        }

        if (page === 1 && !removePOAvailableOrNOt) {
            var orderNewData = updateProductPOAvailableOrNot(orderData, 'availablePO')
            setData(orderNewData)
            setRemovePOAvailableOrNot(true)
        }
    }, [data, render, page, removePOAvailableOrNOt])

    const onChangeAddress = (value, name) => {
        var oldData = data
        oldData.customerDetails.shippingAddress[name] = value
        setData(oldData)
        setRender(Date.now())
    }

    const fetchVendorData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {

            }
        }
        ApiHit(json, searchSupplier).then(res => {
            if (res.content) {
                setVendorData(res.content)
            }
        })
    }

    console.log('vendor', vendorData);


    const th = ['Product Name', 'HSN No', "Make", "Varient/Unit", 'Quantity', 'Available Quantity', 'Vendor Price', 'Price', 'GST', 'CGST', 'SGST']
    let td;
    if (data !== null) {
        td = data?.products?.map((ele, i) => {

            console.log('ele', ele);

            const numbers = ele?.availablePO;
            const availableQty = numbers.reduce((acc, num) => acc + Number(num), 0);

            console.log('availableQty', availableQty);


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
                            {
                                availableQty !== Number(ele?.qty) ?
                                    <MyInput onChange={(e) => onChangeProdcuts(e.target.value, i, 'useQty', availableQty === 0 ? Number(ele.qty) : availableQty)} title={'Available Quantity'} value={ele?.useQty || ele?.useQty === "" ? ele?.useQty : ele?.availablePO?.length === 0 ? ele.qty : Number(ele.qty) - availableQty} />
                                    :
                                    0
                            }
                        </div>
                    </td>
                    <td className='min-w-[100px] p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {
                                availableQty !== Number(ele?.qty) ?
                                    <MyInput onChange={(e) => onChangeProdcuts(e.target.value, i, 'vendorPrice')} title={'Vendor Price'} value={ele.vendorPrice || ''} placeholder={'Enter vendor price'} />
                                    :
                                    ele.price
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

    const onChangeProdcuts = (value, index, name, availableQty) => {
        const oldData = data
        if (name === 'useQty') {
            if (Number(value) > availableQty) {
                oldData.products[index][name] = availableQty
                toast.error(`You have only ${availableQty} quantity available`)
            } else {
                oldData.products[index][name] = value
            }
        }
        else {
            oldData.products[index][name] = value
        }
        if (name === 'useQty') {
            oldData.products[index].cgst = Number(value) * Number(oldData.products[index].productVarient.gst) * Number(oldData.products[index].price) / 200
            oldData.products[index].sgst = Number(value) * Number(oldData.products[index].productVarient.gst) * Number(oldData.products[index].price) / 200
        } else {
            // oldData.products[index].cgst = Number(oldData.products[index].availablePO) * Number(oldData.products[index].productVarient.gst) * Number(value) / 200
            // oldData.products[index].sgst = Number(oldData.products[index].availablePO) * Number(oldData.products[index].productVarient.gst) * Number(value) / 200
        }
        setData(oldData)
        setRender(Date.now())
    }

    console.log(data);


    const onClickNext = () => {
        if (selectedVendor === null || gstAddresses === null || warehouseAddresses === null) {
            toast.error('Vendor Details is Required')
        } else {
            var isVendorPriceMissingOrEmpty = data.products.some(item => item.vendorPrice && item.vendorPrice !== undefined && item.vendorPrice !== null && item.vendorPrice !== "");
            if (isVendorPriceMissingOrEmpty) {
                var confirmation = window.confirm('Are you agree for this details')
                if (confirmation) {
                    setPage(2)
                }
            } else {
                toast.error('Vendor price is required')
            }
        }
    }
    const onClickBack = (page) => {
        setPage(page)
    }

    const onChangetermsAndConditions = (e) => {
        var oldData = data
        oldData.termsAndConditions = e
        setData(oldData)
        setRender(Date.now())
    }

    const onSubmit = () => {
        setLoader(true)
        var newData = updateProductIdWithPO(data, 'availablePO')
        newData.order_id = data._id
        delete newData._id
        newData.status = 'Active'
        newData.paymentTerm = { type: paymentTerm, days: paymentTerm === 'Credit' ? ApiReducer?.apiJson?.days : null }
        var vendroDetails = {
            ...vendorData[Number(selectedVendor)],
            gstAddresses: vendorData[Number(selectedVendor)].gstAddresses[gstAddresses],
            warehouseAddresses: vendorData[Number(selectedVendor)].warehouseAddresses[warehouseAddresses]
        }
        newData.supplierDetails = vendroDetails
        newData.termsAndConditions = content

        if (data?.ownAddress && data?.ownAddress !== null) {
            newData.ownAddress = data?.ownAddress
        } else {
            newData.ownAddress = B2BBillingAddress?.[0]
        }

        ApiHit(newData, addPO).then(res => {
            if (res.status === 201) {
                var json = updateAvaialblePO(newData)
                var OrderJson = {
                    "_id": json.order_id,
                    "products": json.products,
                }
                ApiHit(OrderJson, updateOrder).then(result => {
                    if (result.status === 200) {
                        toast.success('PO Generated successfully')
                        window.location.pathname = '/order'
                        setLoader(false)
                    } else {
                        setLoader(false)
                    }
                })
            } else {
                setLoader(false)
                toast.error(res.message)
            }
        })
    }

    console.log('data', data);


    return (
        data &&
        <div className='p-5'>
            <div className='h-[80vh] overflow-scroll'>
                {
                    page === 0 ?
                        <div>
                            {
                                user?.roleObject?.permission?.[6]?.permission?.[0]?.write &&
                                <div className='flex justify-end'>
                                    <MyButton title={'Generate New PO'} onClick={() => setPage(1)} />
                                </div>
                            }
                            <POView orderData={orderData} />
                        </div>
                        :
                        page === 1 && vendorData !== null ?
                            <div>
                                <div className='grid grid-cols-1 gap-6'>
                                    <div>
                                        <div className='mb-1'>
                                            <Title title={'Billing Address'} size={'lg'} color={Colors.BLACK} />
                                        </div>
                                        <Title title={data?.ownAddress && data?.ownAddress !== null ? data?.ownAddress?.address + ', ' + data?.ownAddress?.city : OrderInvoiceDetails?.companyDetails?.address?.address + ', ' + OrderInvoiceDetails?.companyDetails?.address?.city} size={'md'} />
                                        <Title title={data?.ownAddress && data?.ownAddress !== null ? data?.ownAddress?.state + ' - ' + data?.ownAddress?.pinCode + ', ' + data?.ownAddress?.country : OrderInvoiceDetails?.companyDetails?.address?.state + ' - ' + OrderInvoiceDetails?.companyDetails?.address?.pinCode + ', ' + OrderInvoiceDetails?.companyDetails?.address?.country} size={'md'} />
                                    </div>
                                    <div className='border'>
                                        <div className='mb-1 p-2' style={{ background: Colors.ThemeBlue }}>
                                            <Title title={'Shipping Address'} size={'lg'} color={Colors.WHITE} />
                                        </div>
                                        <div className='grid grid-cols-6 gap-2 p-5'>
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'address')} title={"Address"} value={data?.customerDetails?.shippingAddress?.address} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'city')} title={"City"} value={data?.customerDetails?.shippingAddress?.city} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'pinCode')} title={"PinCode"} value={data?.customerDetails?.shippingAddress?.pinCode} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'landmark')} title={"Landmark"} value={data?.customerDetails?.shippingAddress?.landmark} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'state')} title={"state"} value={data?.customerDetails?.shippingAddress?.state} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'country')} title={"County"} value={data?.customerDetails?.shippingAddress?.country} />
                                        </div>
                                    </div>
                                </div>

                                <div className='border mt-5'>
                                    <div className='mb-1 p-2' style={{ background: Colors.ThemeBlue }}>
                                        <Title color={Colors.WHITE} title={'Vendor Details'} size={'base'} />
                                    </div>
                                    <div className='m-2 grid grid-cols-3 gap-4'>
                                        <div>
                                            <Title color={Colors.BLACK} title={'Select Vendor'} size={'base'} />
                                            <select onChange={(e) => setSelectedVendor(e.target.value)} className={selectClass}>
                                                <option selected={selectedVendor === null} value={null}>Select Payment Term</option>
                                                {
                                                    vendorData.map((vendor, vendorIndex) => {
                                                        return (
                                                            <option selected={selectedVendor === vendorIndex} value={vendorIndex}>{vendor?.companyName}({vendor?.name})</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        {
                                            selectedVendor !== null &&
                                            <>
                                                <div>
                                                    <Title color={Colors.BLACK} title={'Select Billing Address'} size={'base'} />
                                                    <select onChange={(e) => setGstAddresses(e.target.value)} className={selectClass}>
                                                        <option selected={gstAddresses === null} value={null}>Select Billing Address</option>
                                                        {
                                                            vendorData?.[selectedVendor]?.gstAddresses?.map((ele, i) => {
                                                                return (
                                                                    <option selected={gstAddresses === i} value={i}>{ele.address}, {ele.city}, {ele.pinCode}, {ele.landmark}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    <Title color={Colors.BLACK} title={'Select Shipping Address'} size={'base'} />
                                                    <select onChange={(e) => setWarehouseAddresses(e.target.value)} className={selectClass}>
                                                        <option selected={warehouseAddresses === null} value={null}>Select Shipping Address</option>
                                                        {
                                                            vendorData?.[selectedVendor]?.warehouseAddresses?.map((ele, i) => {
                                                                return (
                                                                    <option selected={warehouseAddresses === i} value={i}>{ele.address}, {ele.city}, {ele.pinCode}, {ele.landmark}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className='mt-5 border'>
                                    <div className='mb-1 p-2' style={{ background: Colors.ThemeBlue }}>
                                        <Title color={Colors.WHITE} title={'Select Payment Term'} size={'base'} />
                                    </div>
                                    <div className='grid grid-cols-3 gap-3'>
                                        <div className='m-2'>
                                            <div className='mb-0.5'>
                                                <Title title={'Select Payment Term'} size={'md'} color={Colors.BLACK} />
                                            </div>
                                            <select onChange={(e) => setPaymentTerm(e.target.value)} className={selectClass}>
                                                <option selected={paymentTerm === null} value={null}>Select Payment Term</option>
                                                <option selected={paymentTerm === 'Advance'}>Advance</option>
                                                <option selected={paymentTerm === 'LC'}>LC</option>
                                                <option selected={paymentTerm === 'BG'}>BG</option>
                                                <option selected={paymentTerm === 'Advance Delivery'}>Advance Delivery</option>
                                                <option selected={paymentTerm === 'Against Dispatch'}>Against Dispatch</option>
                                                <option selected={paymentTerm === 'Credit'}>Credit</option>
                                            </select>
                                        </div>
                                        {
                                            paymentTerm === 'Credit' &&
                                            <div className='m-2'>
                                                <MyInput title={'Days'} name={'days'} placeholder={'Enter Days'} />
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <div className='mb-1'>
                                        <Title title={'Products'} size={'lg'} color={Colors.BLACK} />
                                    </div>
                                    <DataTable td={td} th={th} hidePagination={true} />
                                </div>
                                <div className='flex gap-2 mt-10'>
                                    <MyButton className={'w-20'} title={'Back'} onClick={() => onClickBack(0)} />
                                    <MyButton disable={data?.products?.length === 0} className={'w-20'} title={'Next'} onClick={() => onClickNext()} />
                                </div>
                            </div>
                            :
                            <div>
                                <div className='mb-1'>
                                    <Title title={'Terms and conditions'} size={'lg'} color={Colors.BLACK} />
                                    <ReactQuill
                                        value={content}
                                        style={{ height: '60vh' }}
                                        onChange={setContent}
                                        modules={{
                                            toolbar: [
                                                ["bold", "italic", "underline"], // Formatting options
                                                [{ list: "ordered" }, { list: "bullet" }], // Lists
                                                ["link", "blockquote", "code-block"], // Other options
                                                ["clean"], // Remove Formatting
                                            ],
                                        }}
                                    />

                                    {/* <div className='text-left'>
                                        {
                                            data?.termsAndConditions?.map((ele, i) => {
                                                return (
                                                    <div className='flex gap-2 p-1'>
                                                        <div>
                                                            <MyCheckBox onChange={() => onChangetermsAndConditions(i)} checked={ele.status} />
                                                        </div>
                                                        <p className='mt-3 text-black'>{ele.title}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className='mt-5'>
                                            <MyInput title={'Additional Notes:'} onChange={(e) => onChangetermsAndConditions('additionalNotes', e.target.value)} value={data?.additionalNotes} />
                                        </div>
                                    </div> */}
                                </div>
                                <div className='flex gap-2 mt-20'>
                                    <MyButton className={'w-20'} title={'Back'} onClick={() => onClickBack(1)} />
                                    <MyButton type={loader && 'loader'} className={'w-20'} title={'Submit'} onClick={() => onSubmit()} />
                                </div>
                            </div>
                }
            </div>
        </div>
    )
}

export default AddPO;