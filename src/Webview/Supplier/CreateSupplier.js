import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import MyCheckBox from '../../Component/MyCheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MySelectProduct from '../../Component/MySelectProduct';
import MyButton from '../../Component/MyButton';
import { SupplierValidation } from './SupplierValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addCustomer, addLead, searchCustomer, selectClass } from '../../Constants/Constants';
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
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [pincode, setPincode] = useState(null);

    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required('Company name is required'),
        natureOfCompany: Yup.string().required('Nature of company is required'),
        companySize: Yup.string().required('Company size is required'),
        industry: Yup.string().required('Industry is required'),
        designation: Yup.string().required('Designation is required'),
        name: Yup.string().required('Name is required'),
        contact: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        gstAddresses: Yup.array().of(
            Yup.object().shape({
                address: Yup.string().required('GST address is required'),
                landmark: Yup.string().required('GST landmark is required'),
                country: Yup.string().required('GST country is required'),
                state: Yup.string().required('GST state is required'),
                city: Yup.string().required('GST city is required'),
                pincode: Yup.string()
                    .matches(/^[1-9][0-9]{5}$/, 'GST pincode must be 6 digits')
                    .required('GST pincode is required'),
            })
        ),
        warehouseAddresses: Yup.array().of(
            Yup.object().shape({
                address: Yup.string().required('Warehouse address is required'),
                landmark: Yup.string().required('Warehouse landmark is required'),
                country: Yup.string().required('Warehouse country is required'),
                state: Yup.string().required('Warehouse state is required'),
                city: Yup.string().required('Warehouse city is required'),
                pincode: Yup.string()
                    .matches(/^[1-9][0-9]{5}$/, 'Warehouse pincode must be 6 digits')
                    .required('Warehouse pincode is required'),
            })
        ),
        bankDetails: Yup.object().shape({
            beneficiaryName: Yup.string().required('Beneficiary name is required'),
            bankName: Yup.string().required('Bank name is required'),
            branchName: Yup.string().required('Branch name is required'),
            ifscCode: Yup.string().required('IFSC code is required'),
            accountNo: Yup.string().required('Account number is required'),
        }),
        cancelledCheque: Yup.object().shape({
            title: Yup.string().required('Cancelled cheque title is required'),
            url: Yup.string().required('Cancelled cheque URL is required'),
        }),
        pancardNo: Yup.string()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card number format')
            .required('PAN card number is required'),
        gstNo: Yup.string()
            .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
            .required('GST number is required'),
        pancard: Yup.object().shape({
            title: Yup.string().required('PAN card title is required'),
            url: Yup.string().required('PAN card URL is required'),
        }),
        gst: Yup.object().shape({
            title: Yup.string().required('GST title is required'),
            url: Yup.string().required('GST URL is required'),
        }),
        msmeNo: Yup.string()
            .matches(/^UDYAM-[A-Z0-9]{2}-[0-9]{2}-[0-9]{7}$/, 'Invalid MSME number format')
            .required('MSME number is required'),
        msme: Yup.object().shape({
            title: Yup.string().required('MSME title is required'),
            url: Yup.string().required('MSME URL is required'),
        }),
        tdstcs: Yup.object().shape({
            title: Yup.string().required('TDS/TCS title is required'),
            url: Yup.string().required('TDS/TCS URL is required'),
        }),
    });

    const { errors, validateField, validateJson } = useYupValidation(validationSchema);

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

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

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

    const onSubmit = () => {
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        validateJson(ApiReducer?.apiJson);
        SupplierValidation(ApiReducer?.apiJson).then(res => {
            var error = !ObjIsEmpty(res)
            console.log('ApiReducer?.apiJson', ApiReducer?.apiJson);
            if (error && Object.keys(errors)?.length > 0) {
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
                        <MyInputCommon name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} validate={validateField} errorMsg={errors[`companyName`]} />
                    </div>
                    <div>
                        <MySelectCommon selectedValue={ApiReducer?.apiJson?.natureOfCompany} name={'natureOfCompany'} title={'Nature of Company'} placeholder={'Enter Nature of Company'} options={natureOfCompanyOptions} validate={validateField} errorMsg={errors[`natureOfCompany`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} validate={validateField} errorMsg={errors[`companySize`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'industry'} title={'Industry'} placeholder={'Enter Industry'} validate={validateField} errorMsg={errors[`industry`]} />
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
                    <p className='text-white p-2'>GST Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('gstAddresses')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add GST Address'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.gstAddresses?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.gstAddresses?.map?.((ele, index) => {
                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>


                                            <MyInputCommon value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].address`]} />
                                            <MyInputCommon value={ele.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].landmark`]} />
                                            <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'gstAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`gstAddresses[${index}].country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'gstAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`gstAddresses[${index}].state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'gstAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`gstAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pincode} title={'Pin Code'} name={'pincode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pincode', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].pincode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'gstAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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
                    <p className='text-white p-2'>Warehouse Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('warehouseAddresses')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Warehouse'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.warehouseAddresses?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.warehouseAddresses?.map?.((ele, index) => {

                                    console.log(ele);

                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>

                                            <MyInputCommon value={ele.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'warehouseAddresses') }} errorMsg={errors[`warehouseAddresses[${index}].address`]} />
                                            <MyInputCommon value={ele.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'warehouseAddresses') }} errorMsg={errors[`warehouseAddresses[${index}].landmark`]} />
                                            <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'warehouseAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`warehouseAddresses[${index}].country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'warehouseAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`warehouseAddresses[${index}].state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'warehouseAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`warehouseAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pincode} title={'Pin Code'} name={'pincode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pincode', 'warehouseAddresses') }} errorMsg={errors[`warehouseAddresses[${index}].pincode`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'warehouseAddresses')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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
                    <p className='text-white p-2'>Bank Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon parent={'bankDetails'} name='beneficiaryName' title={'Beneficiary Name'} placeholder={'Enter Beneficiary Name'} validate={validateField} errorMsg={errors[`bankDetails.beneficiaryName`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'bankDetails'} name='bankName' title={'Bank Name'} placeholder={'Enter Bank Name'} validate={validateField} errorMsg={errors[`bankDetails.bankName`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'bankDetails'} name='branchName' title={'Branch Name'} placeholder={'Enter Branch Name'} validate={validateField} errorMsg={errors[`bankDetails.branchName`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'bankDetails'} name='ifscCode' title={'IFSC Code'} placeholder={'Enter IFSC Code'} validate={validateField} errorMsg={errors[`bankDetails.ifscCode`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'bankDetails'} name='accountNo' title={'Account No.'} placeholder={'Enter Account No.'} validate={validateField} errorMsg={errors[`bankDetails.accountNo`]} />
                    </div>
                    <div>
                        <MyFileUpload name={'cancelledCheque'} title={'Upload Cancelled Cheque Doc'} error={!ApiReducer?.apiJson?.kycDetails?.cancelledCheque} fileType={'array'} uppercase />
                    </div>
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
                        <MyFileUpload name={'pancard'} title={'Upload PAN Card'} error={!ApiReducer?.apiJson?.pancard} fileType={'array'} uppercase />
                    </div>
                    <div>
                        <MyInputCommon name={'gstNo'} title={'GST No.'} placeholder={'Enter GST No.'} validate={validateField} errorMsg={errors[`gstNo`]} />
                    </div>
                    <div>
                        <MyFileUpload name={'gst'} title={'Upload GST Card'} error={!ApiReducer?.apiJson?.gst} fileType={'array'} uppercase />
                    </div>
                    <div>
                        <MyInputCommon name={'msmeNo'} title={'MSME No.'} placeholder={'Enter MSME No.'} validate={validateField} errorMsg={errors[`msmeNo`]} />
                    </div>
                    <div>
                        <MyFileUpload name={'msme'} title={'Upload MSME Doc'} error={!ApiReducer?.apiJson?.msme} fileType={'array'} uppercase />
                    </div>
                    <div>
                        <MyFileUpload name={'tdstcs'} title={'Upload TDS & TCS Doc'} error={!ApiReducer?.apiJson?.tdstcs} fileType={'array'} uppercase />
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