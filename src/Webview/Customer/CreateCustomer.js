import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInput from '../../Component/MyInput';
import MyCheckBox from '../../Component/MyCheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MySelectProduct from '../../Component/MySelectProduct';
import MyButton from '../../Component/MyButton';
import { CustomerValidation } from './CustomerValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addLead, searchCustomer, selectClass } from '../../Constants/Constants';
import MySelect from '../../Component/MySelect';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import { setCustomerApiJson } from '../../Store/Action/CustomerAction';

function CreateCustomer() {

    const [decision, setDecision] = useState(false)
    const [customers, setCustomers] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const ApiReducer = useSelector(state => state.CustomerReducer)

    const dispatch = useDispatch()

    // useEffect(() => {
    //     if (customers === null) {
    //         fetchData()
    //     }
    // }, [])

    const onSubmit = () => {
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        CustomerValidation(ApiReducer?.apiJson).then(res => {
            var error = !ObjIsEmpty(res)
            if (error) {
                dispatch(setDataAction(res, SET_API_JSON_ERROR))
            } else {
                console.log('ApiReducer?.apiJson', ApiReducer?.apiJson);

                ApiHit(ApiReducer?.apiJson, addLead).then(res => {
                    console.log('res', res);

                    // if(res.status === 200){
                    //   toast.success('Lead created successfully')
                    //   window.location.pathname = '/lead'
                    // }else{
                    //   toast.success(res.message)
                    // }
                })
            }
        })
    }

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: {}
        }
        ApiHit(json, searchCustomer).then(res => {
            if (res.content) {
                setCustomers(res.content)
            }
        })
    }

    const onChangeCustomer = (value) => {
        var item = customers.find((ele, i) => ele.name + ele.gstNo === value)
        var oldJson = ApiReducer.apiJson
        oldJson.customerDetails = {
            name: item.name,
            name: item.phone,
            name: item.email,
        }
        oldJson.companyDetails = {
            companyName: item.name,
            industry: item.industry,
            leadSource: item.leadSource,
            companySize: item.companySize,
        }
    }

    const onChange = (value , index, key) => {
console.log('sdvsdvdsv')
        const json = ApiReducer?.apiJson;
     console.log(json, 'sfsdvdvf');
        json.billingAddresses[index] = {...json?.billingAddresses[index], [key]:value};
dispatch(setCustomerApiJson(json));

    }

    const onRemoveProduct = () => {

    }

    const onAddAddress = (serverKey) => {

        var json = ApiReducer?.apiJson
        if (!json[serverKey]) { json[serverKey] = [{}]; 
        dispatch(setCustomerApiJson(json))
    return}
        json[serverKey].push({});
        dispatch(setCustomerApiJson(json))

    }

    const handleAdd = () => {
       
    }


    console.log(ApiReducer)

    return (
        <div className='m-10'>

            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Basic Information</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInput parent={'companyDetails'} name={'natureOfCompany'} title={'Nature Of Company'} placeholder={'Enter Nature Of Company'} error={!ApiReducer?.apiJson?.companyDetails?.natureOfCompany} />
                    </div>
                    <div>
                        <MyInput parent={'companyDetails'} name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} error={!ApiReducer?.apiJson?.companyDetails?.companyName} />
                    </div>
                    <div>
                        <MyInput parent={'companyDetails'} name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} error={!ApiReducer?.apiJson?.companyDetails?.companySize} />
                    </div>
                    <div>
                        <MyInput parent={'companyDetails'} name={'industry'} title={'Industry'} placeholder={'Enter Industry'} error={!ApiReducer?.apiJson?.companyDetails?.industry} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Person Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInput parent={'customerDetails'} name='designation' title={'Designation'} placeholder={'Enter Designation'} error={!ApiReducer?.apiJson?.customerDetails?.designation} />
                    </div>
                    <div>
                        <MyInput parent={'customerDetails'} name='name' title={'Full Name'} placeholder={'Enter Full Name'} error={!ApiReducer?.apiJson?.customerDetails?.name} />
                    </div>
                    <div>
                        <MyInput parent={'customerDetails'} name='phone' title={'Contact Number'} placeholder={'Enter Contact Number'} error={!ApiReducer?.apiJson?.customerDetails?.phone} />
                    </div>
                    <div>
                        <MyInput parent={'customerDetails'} name='email' title={'Email Address'} placeholder={'Enter Email Address'} error={!ApiReducer?.apiJson?.customerDetails?.email} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Billing Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('billingAddresses')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Billing'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.billingAddresses?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.billingAddresses?.map?.((ele, index) => {
                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5">
                                            <MySelect selectedValue={ele.address} onChange={(e) => onChange(e.target.value, index, 'address')} title={'Address'} options={[]} keyName={'address'} />


                                            <MySelect selectedValue={ele.productVarient?.varientName} onChange={(e) => onChange(e.target.value, index, 'productVarient')} title={'Varient'} options={ele.product_id && ele.product_id.varients?.map((item, i) => item)} keyName='varientName' />

                                            <MyInput value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e)=> { onhange(e.target.value, index, 'address')}} />
                                            <MyInput value={ele.sgst || '0'} title={'SGCT'} name={'sgst'} placeholder={'Enter SGCT'} />


                                            <MyInput value={ele.qty} onChange={(e) => onChange(e.target.value, index, 'qty')} title={'Quantity'} name={'qty'} placeholder={'Enter Quantity'} />
                                            <MyInput value={ele.price !== null ? ele.price : '0'} onChange={(e) => onChange(e.target.value, index, 'price')} title={'Price'} name={'price'} placeholder={'Enter Price'} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => onRemoveProduct(index)} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
                                            </div>
                                    }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            <div className='mt-5'>
                <MyButton title={'Submit'} onClick={() => onSubmit()} />
            </div>
        </div>
    )
}

export default CreateCustomer;