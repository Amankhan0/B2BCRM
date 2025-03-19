import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MyButton from '../../Component/MyButton';
import { CustomerValidation } from './CustomerValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addCustomer, searchCustomer } from '../../Constants/Constants';
import MySelectCommon from '../../Component/MySelectCommon';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import useCountryStateCityOptions from '../../Hooks/useCountryStateCityoptions';
import toast from 'react-hot-toast';
import MyFileUpload from '../../Component/MyFileUpload';
import * as Yup from 'yup';
import useYupValidation from '../../Hooks/useYupValidation';

function CreateCustomer() {

    const [decision, setDecision] = useState(false)
    const [customers, setCustomers] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const validationSchema = Yup.object().shape({
        natureOfCompany: Yup.string().required('Nature of company is required'),
        companyName: Yup.string().required('Company name is required'),
        companySize: Yup.string().required('Company size is required'),
        industry: Yup.string().required('Industry is required'),
        designation: Yup.string().required('Designation is required'),
        name: Yup.string().required('Name is required'),
        contact: Yup.string()
          .matches(/^[0-9]{10}$/, 'Contact must be 10 digits')
          .required('Contact is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        billingAddresses: Yup.array().of(
          Yup.object().shape({
            address: Yup.string().required('Billing address is required'),
            landmark: Yup.string().required('Billing landmark is required'),
            country: Yup.string().required('Billing country is required'),
            state: Yup.string().required('Billing state is required'),
            city: Yup.string().required('Billing city is required'),
            pincode: Yup.string()
              .required('Billing pincode is required')
              .matches(/^[1-9][0-9]{5}$/, 'Billing pincode must be 6 digits'),
          })
        ),
        shippingAddresses: Yup.array().of(
          Yup.object().shape({
            address: Yup.string().required('Shipping address is required'),
            landmark: Yup.string().required('Shipping landmark is required'),
            country: Yup.string().required('Shipping country is required'),
            state: Yup.string().required('Shipping state is required'),
            city: Yup.string().required('Shipping city is required'),
            pincode: Yup.string()
              .required('Shipping pincode is required')
              .matches(/^[1-9][0-9]{5}$/, 'Shipping pincode must be 6 digits'),
          })
        ),
        pancardNo: Yup.string().required('PAN card number is required'),
        gstNo: Yup.string().required('GST number is required'),
        gst: Yup.object().shape({
          title: Yup.string().required('GST title is required'),
          url: Yup.string().required('GST URL is required'),
        }),
        pancard: Yup.object().shape({
          title: Yup.string().required('PAN card title is required'),
          url: Yup.string().required('PAN card URL is required'),
        }),
      });

    const { errors, validateJson, validateField } = useYupValidation(validationSchema);


    const dispatch = useDispatch()

    useEffect(() => {
        // if (Object.keys(ApiReducer?.apiJson)?.length > 0) {
        //     fetchData()
        // }

        return () => {
            let json = ApiReducer?.apiJson;
            json = {};
            dispatch(setDataAction(json, SET_API_JSON));
        }
    }, [])

    const natureOfCompanyOptions = [
        { label: "Sole Proprietorship", value: "sole_proprietorship" },
        { label: "Partnership", value: "partnership" },
        { label: "Limited Liability Company (LLC)", value: "llc" },
        { label: "Corporation", value: "corporation" },
        { label: "Non-Profit Organization", value: "non_profit" },
        { label: "Cooperative", value: "cooperative" },
        { label: "Joint Venture", value: "joint_venture" },
        { label: "Subsidiary", value: "subsidiary" },
        { label: "Franchise", value: "franchise" },
        { label: "Public Limited Company", value: "public_limited_company" },
        { label: "Private Limited Company", value: "private_limited_company" },
        { label: "Other", value: "other" },
      ];

      console.log('errors', errors);
    const onSubmit = () => {
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        validateJson(ApiReducer?.apiJson);
        CustomerValidation(ApiReducer?.apiJson).then(res => {
            var error = !ObjIsEmpty(res)
            console.log('apiJson', ApiReducer?.apiJson);
            console.log('ApiReducer?.apiJson Error', error);
            if (error) {
                dispatch(setDataAction(res, SET_API_JSON_ERROR))
            } else {


                // ApiHit(ApiReducer?.apiJson, addCustomer).then(res => {
                //     console.log('res', res);

                //     if (res.status === 200) {
                //         toast.success('Lead created successfully')
                //         window.location.pathname = '/lead'
                //     } else {
                //         toast.success(res.message)
                //     }
                // })
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
            const state = options.find((item) => {
                if (e.value === item?.label) {
                    return item;
                }
                return false;
            })?.state;

            setState(state)
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
                        <MySelectCommon selectedValue={ApiReducer?.apiJson?.natureOfCompany}  name={'natureOfCompany'} title={'Nature of Company'} placeholder={'Enter Nature of Company'} options={natureOfCompanyOptions}  
                        validate={validateField} errorMsg={errors[`natureOfCompany`]}/>
                    </div>
                    <div>
                        <MyInputCommon name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} validate={validateField} errorMsg={errors[`companyName`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} validate={validateField} errorMsg={errors[`companySize`]} />
                    </div>
                    <div>
                        <MyInputCommon  name={'industry'} title={'Industry'} placeholder={'Enter Industry'} validate={validateField} errorMsg={errors[`industry`]} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Person Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon  name='designation' title={'Designation'} placeholder={'Enter Designation'} validate={validateField} errorMsg={errors[`designation`]} />
                    </div>
                    <div>
                        <MyInputCommon  name='name' title={'Full Name'} placeholder={'Enter Full Name'} validate={validateField} errorMsg={errors[`name`]} />
                    </div>
                    <div>
                        <MyInputCommon  name='contact' title={'Contact Number'} placeholder={'Enter Contact Number'} validate={validateField} errorMsg={errors[`contact`]} />
                    </div>
                    <div>
                        <MyInputCommon  name='email' title={'Email Address'} placeholder={'Enter Email Address'} validate={validateField} errorMsg={errors[`email`]} />
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
                                            <MyInputCommon value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].address`]}/>
                                            <MyInputCommon value={ele.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].landmark`]}/>
                                            <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'billingAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`billingAddresses[${index}].country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'billingAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`billingAddresses[${index}].state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'billingAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`billingAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pincode} title={'Pin Code'} name={'pincode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pincode', 'billingAddresses') }} errorMsg={errors[`billingAddresses[${index}].pincode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'billingAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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
                                            <MyInputCommon value={ele.pincode} title={'Pin Code'} name={'pincode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pincode', 'shippingAddresses') }} errorMsg={errors[`shippingAddresses[${index}].pincode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'shippingAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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

            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Upload Documents</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon  name={'pancardNo'} title={'PAN Card No.'} placeholder={'Enter PAN Card No.'} validate={validateField} errorMsg={errors[`pancardNo`]} />
                    </div>
                    <div>
                        <MyFileUpload name={'pancard'} title={'Upload PAN Card'} error={!ApiReducer?.apiJson?.pancard} uppercase fileType={"application/pdf"}/>
                    </div>
                    <div>
                        <MyInputCommon  name={'gstNo'} title={'GST No.'} placeholder={'Enter GST No.'} validate={validateField} errorMsg={errors[`gstNo`]} />
                    </div>
                    <div>
                        <MyFileUpload name={'gst'} title={'Upload GST Card'} error={!ApiReducer?.apiJson?.gst} uppercase />
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <MyButton title={'Submit'} onClick={() => onSubmit()} />
            </div>
        </div>
    )
}

export default CreateCustomer;