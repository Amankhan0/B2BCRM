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
import { addOrder, addPO, selectClass, updateOrder } from '../../../Constants/Constants';
import POView from './POView';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../../Store/Action/SetDataAction';
import { SET_API_JSON } from '../../../Store/ActionName/ActionName';

function AddPO({ orderData }) {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const [data, setData] = useState(null)
    const [render, setRender] = useState(Date.now())
    const [page, setPage] = useState(0)
    const [paymentTerm, setPaymentTerm] = useState(null)

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
        console.log('page',page);
        
        if (page === 1 && !removePOAvailableOrNOt) {
            console.log('call');
            
            var orderNewData = updateProductPOAvailableOrNot(orderData,'availablePO')
            setData(orderNewData)
            setRemovePOAvailableOrNot(true)
        }
    }, [data, render,page,removePOAvailableOrNOt])

    const onChangeAddress = (value, name) => {
        var oldData = data
        oldData.customerDetails.shippingAddress[name] = value
        setData(oldData)
        setRender(Date.now())
    }

    console.log('data --- >>', data);


    const th = ['Product Name', 'HSN No', "Make", "Varient/Unit", 'Quantity', 'Available Quantity', 'Price', 'GST', 'CGST', 'SGST']
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
                    <td className='p-2 border text-black'>{ele?.product_id?.productName || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.hsnNo || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.make || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.qty || '-'}</td>
                    <td className='p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {
                                availableQty !== Number(ele?.qty) ?
                                    <MyInput onChange={(e) => onChangeProdcuts(e.target.value, i, 'useQty', availableQty === 0 ? Number(ele.qty) : availableQty)} title={'Available Quantity'} value={ele?.useQty || ele?.useQty === "" ? ele?.useQty : ele?.availablePO?.length === 0 ? ele.qty : Number(ele.qty) - availableQty} />
                                    :
                                    0
                            }
                        </div>
                    </td>
                    <td className='p-2 border text-black text-left'>
                        <div className='flex justify-center'>
                            {
                                availableQty !== Number(ele?.qty) ?
                                    <MyInput onChange={(e) => onChangeProdcuts(e.target.value, i, 'price')} title={'Price Quantity'} value={ele.price} />
                                    :
                                    ele.price
                            }
                        </div>
                    </td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.gst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.cgst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.sgst || '-'}</td>
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
            oldData.products[index].cgst = Number(oldData.products[index].availablePO) * Number(oldData.products[index].productVarient.gst) * Number(value) / 200
            oldData.products[index].sgst = Number(oldData.products[index].availablePO) * Number(oldData.products[index].productVarient.gst) * Number(value) / 200
        }
        setData(oldData)
        setRender(Date.now())
    }

    const onClickNext = (disable) => {
        var confirmation = window.confirm('Are you agree for this details')
        if (confirmation) {
            setPage(2)
        }
    }
    const onClickBack = (page) => {
        setPage(page)
    }

    const onChangetermsAndConditions = (i, value) => {
        var oldData = data
        if (i !== 'additionalNotes') {
            if (oldData.termsAndConditions[i].status) {
                oldData.termsAndConditions[i].status = false
            } else {
                oldData.termsAndConditions[i].status = true
            }
            setData(oldData)
        } else {
            oldData[i] = value
        }
        setData(oldData)
        setRender(Date.now())
    }

    const onSubmit = () => {
        var newData = updateProductIdWithPO(data,'availablePO')
        newData.order_id = data._id
        delete newData._id
        newData.status = 'Active'
        newData.paymentTerm = { type: paymentTerm, days: paymentTerm === 'Credit' ? ApiReducer?.apiJson?.days : null }

        console.log('newData', newData);
        // var json = updateAvaialblePO(newData)
        // console.log('json', json);


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
                    }
                })
            } else {
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
                            <div className='flex justify-end'>
                                <MyButton title={'Generate New PO'} onClick={() => setPage(1)} />
                            </div>
                            <POView orderData={orderData} />
                        </div>
                        :
                        page === 1 ?
                            <div>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div>
                                        <div className='mb-1'>
                                            <Title title={'Billing Address'} size={'lg'} color={Colors.BLACK} />
                                        </div>
                                        <Title title={'A-4 Second Floor, Sarvodaya Enclave'} size={'md'} />
                                        <Title title={'New Delhi 110017, India'} size={'md'} />
                                    </div>
                                    <div>
                                        <div className='mb-1'>
                                            <Title title={'Shipping Address'} size={'lg'} color={Colors.BLACK} />
                                        </div>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'address')} title={"Address"} value={data?.customerDetails?.shippingAddress?.address} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'city')} title={"City"} value={data?.customerDetails?.shippingAddress?.city} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'pinCode')} title={"PinCode"} value={data?.customerDetails?.shippingAddress?.pinCode} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'landmark')} title={"Landmark"} value={data?.customerDetails?.shippingAddress?.landmark} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'state')} title={"state"} value={data?.customerDetails?.shippingAddress?.state} />
                                            <MyInput onChange={(e) => onChangeAddress(e.target.value, 'country')} title={"County"} value={data?.customerDetails?.shippingAddress?.country} />
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-3 gap-3'>
                                    <div className='m-2'>
                                        <Title color={Colors.BLACK} title={'Select Payment Term'} size={'base'} />
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
                                    <div className='text-left'>
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
                                    </div>
                                </div>
                                <div className='flex gap-2 mt-10'>
                                    <MyButton className={'w-20'} title={'Back'} onClick={() => onClickBack(1)} />
                                    <MyButton className={'w-20'} title={'Submit'} onClick={() => onSubmit()} />
                                </div>
                            </div>
                }


                {/* <POPDF data={orderData} /> */}
            </div>
        </div>
    )
}

export default AddPO;