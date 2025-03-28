import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MyButton from '../../Component/MyButton';
import { ApiHit } from '../../utils';
import { addCustomer, searchCustomer, updateCustomer } from '../../Constants/Constants';
import MySelectCommon from '../../Component/MySelectCommon';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import useCountryStateCityOptions from '../../Hooks/useCountryStateCityoptions';
import toast from 'react-hot-toast';
import MyFileUploadCommon from '../../Component/MyFileUploadCommon';
import { CustomerValidationSchema } from './CustomerValidation';
import useYupValidation from '../../Hooks/useYupValidation';
import { useParams } from 'react-router-dom';

function CreateCustomer() {

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const { errors, validateJson, validateField } = useYupValidation(CustomerValidationSchema);


    const dispatch = useDispatch()

    const params = useParams();
    useLayoutEffect(() => {
        if (params?.id) {
            fetchData()
        }
    }, [params])


    useEffect(() => {

        const state = options.find((item) => {
            console.log(item?.label === 'India', 'bool val');
            if ('India' === item?.label) {
                return item;
            }
            return false;
        })?.state;

        setState(state)

        return () => {
            let json = ApiReducer?.apiJson;
            json = {};
            dispatch(setDataAction(json, SET_API_JSON));
        }
    }, [options])

    const natureOfCompanyOptions = [
        { label: "Sole Proprietorship", value: "Sole Proprietorship" },
        { label: "Partnership", value: "Partnership" },
        { label: "Limited Liability Company (LLC)", value: "Limited Liability Company (LLC)" },
        { label: "Corporation", value: "Corporation" },
        { label: "Non-Profit Organization", value: "Non-Profit Organization" },
        { label: "Cooperative", value: "Cooperative" },
        { label: "Joint Venture", value: "Joint Venture" },
        { label: "Subsidiary", value: "Subsidiary" },
        { label: "Franchise", value: "Franchise" },
        { label: "Public Limited Company", value: "Public Limited Company" },
        { label: "Private Limited Company", value: "Private Limited Company" },
        { label: "Other", value: "Other" },
    ];

    const onSubmit = () => {
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        validateJson(ApiReducer?.apiJson).then(res => {
            if (res?.inner) {
                dispatch(setDataAction(res?.inner, SET_API_JSON_ERROR))
                res.inner.forEach((error) => {
                    if (['billingAddresses', 'shippingAddresses'].includes(error.path)) {
                        toast.error(error.message);
                    }
                });
            } else {
                const api = params?.id ? updateCustomer : addCustomer;
                ApiHit(ApiReducer?.apiJson, api).then(res => {
                    if (res.status === 200) {
                        toast.success(`Customer ${params?.id ? 'updated' : 'created'} successfully`)
                        window.location.pathname = '/customer'
                    } else {
                        toast.success(res.message)
                    }
                })
            }
        })
    }

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: { _id: params?.id }
        }
        ApiHit(json, searchCustomer).then(res => {
            if (res?.content) {
                dispatch(setDataAction(res?.content?.[0], SET_API_JSON))
            }
        })
    }

    const onChange = (value, index, key, parent) => {
        const json = ApiReducer?.apiJson;
        json[parent][index] = { ...json[parent][index], [key]: value };
        validateField(`${parent}[${index}].${key}`, value);
        dispatch(setDataAction(json, SET_API_JSON));

    }

    const onAddAddress = (serverKey) => {

        var json = ApiReducer?.apiJson
        if (!json[serverKey]) {
            json[serverKey] = [{}];
            dispatch(setDataAction(json, SET_API_JSON))
            return
        }
        json[serverKey].push({});
        dispatch(setDataAction(json, SET_API_JSON))

    }

    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [pincode, setPincode] = useState(null);

    const handleChange = (e, loadType, index, parent) => {

        var json = ApiReducer?.apiJson

        console.log(e, loadType);

        if (loadType === 'state') {
            // const state = options.find((item) => {
            //     if (e.value === item?.label) {
            //         return item;
            //     }
            //     return false;
            // })?.state;

            // setState(state)
            setCity(null)

            onChange(e.value, index, 'country', parent)
            delete json?.[parent]?.[index].state //

        } else if (loadType === 'city') {

            const city = state?.find((item) => {
                return e.value === item?.label;

            })?.city;

            setCity(city)
            setPincode(null)
            onChange(e.value, index, 'state', parent)
            delete json?.[parent]?.[index].city //
        } else if (loadType === 'pincode') {
            setPincode(e.pincode)
            onChange(e.value, index, 'city', parent)
            delete json?.[parent]?.[index].pincode //
        }
        dispatch(setDataAction(json, SET_API_JSON))
    }

    const handleRemove = (index, serverKey) => {
        var json = ApiReducer?.apiJson
        json[serverKey].splice(index, 1)
        dispatch(setDataAction(json, SET_API_JSON))
    }

    return (
        <div className='m-10'>

            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Basic Information</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MySelectCommon selectedValue={ApiReducer?.apiJson?.natureOfCompany} name={'natureOfCompany'} title={'Nature of Company'} placeholder={'Enter Nature of Company'} options={natureOfCompanyOptions}
                            validate={validateField} errorMsg={errors[`natureOfCompany`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} validate={validateField} errorMsg={errors[`companyName`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} validate={validateField} errorMsg={errors[`companySize`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'industry'} title={'Industry'} placeholder={'Enter Industry'} validate={validateField} errorMsg={errors[`industry`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'leadSource'} title={'Lead Source'} placeholder={'Enter Lead Source'} validate={validateField} errorMsg={errors[`leadSource`]} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Person Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon name='designation' title={'Designation'} placeholder={'Enter Designation'} validate={validateField} errorMsg={errors[`designation`]} />
                    </div>
                    <div>
                        <MyInputCommon name='name' title={'Full Name'} placeholder={'Enter Full Name'} validate={validateField} errorMsg={errors[`name`]} />
                    </div>
                    <div>
                        <MyInputCommon name='contact' title={'Contact Number'} placeholder={'Enter Contact Number'} validate={validateField} errorMsg={errors[`contact`]} />
                    </div>
                    <div>
                        <MyInputCommon name='email' title={'Email Address'} placeholder={'Enter Email Address'} validate={validateField} errorMsg={errors[`email`]} />
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
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>
                                            <MyInputCommon value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].address`]} />
                                            <MyInputCommon value={ele.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].landmark`]} />
                                            <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'billingAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`billingAddresses[${index}].country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'billingAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`billingAddresses[${index}].state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'billingAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`billingAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pinCode} title={'Pin Code'} name={'pinCode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pinCode', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].pinCode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'billingAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Shipping Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('shippingAddresses')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Shipping'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.shippingAddresses?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.shippingAddresses?.map?.((ele, index) => {

                                    console.log(ele);

                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>

                                            <MyInputCommon value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'shippingAddresses') }} errorMsg={errors[`shippingAddresses[${index}].address`]} />
                                            <MyInputCommon value={ele.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'shippingAddresses') }} errorMsg={errors[`shippingAddresses[${index}].landmark`]} />
                                            <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'shippingAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`shippingAddresses[${index}].country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'shippingAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`shippingAddresses[${index}].state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'shippingAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`shippingAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pinCode} title={'Pin Code'} name={'pinCode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pinCode', 'shippingAddresses') }} errorMsg={errors[`shippingAddresses[${index}].pinCode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'shippingAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>

            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Upload Documents</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon name={'pancardNo'} title={'PAN Card No.'} placeholder={'Enter PAN Card No.'} validate={validateField} errorMsg={errors[`pancardNo`]} />
                    </div>
                    <div>
                        <MyFileUploadCommon name={'pancard'} title={'Upload PAN Card'} error={errors['pancard']} validate={validateField} uppercase fileType={"array"} />
                    </div>
                    <div>
                        <MyInputCommon name={'gstNo'} title={'GST No.'} placeholder={'Enter GST No.'} validate={validateField} errorMsg={errors[`gstNo`]} />
                    </div>
                    <div>
                        <MyFileUploadCommon name={'gst'} title={'Upload GST Card'} error={errors['gst']} validate={validateField} fileType={'array'} uppercase />
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <MyButton title={params?.id ? 'Update' : 'Submit'} onClick={() => onSubmit()} />
            </div>
        </div>
    )
}

export default CreateCustomer;