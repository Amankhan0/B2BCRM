import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import MyCheckBox from '../../Component/MyCheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MyButton from '../../Component/MyButton';
import { SupplierValidation } from './SupplierValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addCustomer, addLead, addSupplier, searchCustomer, searchSupplier, selectClass, updateSupplier } from '../../Constants/Constants';
import MySelectCommon from '../../Component/MySelectCommon';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import useCountryStateCityOptions from '../../Hooks/useCountryStateCityoptions';
import toast from 'react-hot-toast';
import MyFileUpload from '../../Component/MyFileUpload';
import MyFileUploadCommon from '../../Component/MyFileUploadCommon';
import * as Yup from 'yup';
import useYupValidation from '../../Hooks/useYupValidation';
import { useParams } from 'react-router-dom';

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
        email: Yup.string()
          .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Invalid email format'
          )
          .required('Email is required'),
        gstAddresses: Yup.array().of(
            Yup.object().shape({
                address: Yup.string().required('GST address is required'),
                landmark: Yup.string().required('GST landmark is required'),
                country: Yup.string().required('GST country is required'),
                state: Yup.string().required('GST state is required'),
                city: Yup.string().required('GST city is required'),
                pinCode: Yup.string()
                    .matches(/^[1-9][0-9]{5}$/, 'GST pincode must be 6 digits')
                    .required('GST pincode is required'),
            })
        ).min(1, 'At least one GST address is required').required('At least one GST address is required'),
        warehouseAddresses: Yup.array().of(
            Yup.object().shape({
                address: Yup.string().required('Warehouse address is required'),
                landmark: Yup.string().required('Warehouse landmark is required'),
                country: Yup.string().required('Warehouse country is required'),
                state: Yup.string().required('Warehouse state is required'),
                city: Yup.string().required('Warehouse city is required'),
                pinCode: Yup.string()
                    .matches(/^[1-9][0-9]{5}$/, 'Warehouse pincode must be 6 digits')
                    .required('Warehouse pincode is required'),
            })
        ).min(1, 'At least one warehouse address is required').required('At least one warehouse address is required'),
        bankDetails: Yup.array().of(  // Changed to array().of() to handle the array
            Yup.object().shape({
                beneficiaryName: Yup.string().required('Beneficiary name is required'),
                bankName: Yup.string().required('Bank name is required'),
                branchName: Yup.string().required('Branch name is required'),
                ifscCode: Yup.string().required('IFSC code is required'),
                accountNo: Yup.string().required('Account number is required'),
                cancelledCheque: Yup.object().required('Cancelled Cheque is Required'),
            })
        ).min(1, 'At least one bank detail is required').required('At least one bank detail is required'),
        pancardNo: Yup.string()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card number format')
            .required('PAN card number is required'),
        pancard: Yup.array().of(
            Yup.object().shape({
                title: Yup.string(),
                url: Yup.string(),
            })
        ).required('PAN card document is required'),
        gstNo: Yup.string()
            .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
            .required('GST number is required'),
        gst: Yup.array().of(
            Yup.object().shape({
                title: Yup.string(),
                url: Yup.string(),
            })
        ).required('GST document is required'),
        msmeNo: Yup.string().nullable(true)
            // .matches(/^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/, 'Invalid MSME number format')
            ,
        msme: Yup.array().of(
            Yup.object().shape({
                title: Yup.string(),
                url: Yup.string(),
            })
        ).nullable(true),
        tdstcs: Yup.array().of(
            Yup.object().shape({
                title: Yup.string(),
                url: Yup.string(),
            })
        ).required('TDS/TCS document is required'),
    });
    


    const { errors, validateField, validateJson } = useYupValidation(validationSchema);

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

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const dispatch = useDispatch()

    const params = useParams();
    useLayoutEffect(() => {
        if (params?.id) {
            fetchData()
        }
    }, [params])

    useEffect(() => {

        const state = options.find((item) => {
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

    console.log(errors, 'errors');

    const onSubmit = () => {
        // dispatch(setDataAction({}, SET_API_JSON_ERROR))
        validateJson(ApiReducer?.apiJson).then(res => {
            // var error = !ObjIsEmpty(res)
            console.log(res, ' inside on submit')
            console.log('ApiReducer?.apiJson', ApiReducer?.apiJson);
            if (res?.inner) {
                dispatch(setDataAction(res?.inner, SET_API_JSON_ERROR))
                res.inner.forEach((error) => {
                    if(['warehouseAddresses', 'gstAddresses'].includes(error.path)){
                        toast.error(error.message);
                    }
                  });
            } else {

                const api = params?.id ? updateSupplier : addSupplier;

                ApiHit(ApiReducer?.apiJson, api).then(res => {
                    if (res.status === 200 || res.status === 201) {
                        toast.success(`Supplier ${params?.id ? 'updated' : 'created'} successfully`)
                        window.location.pathname = '/supplier'
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
        ApiHit(json, searchSupplier).then(res => {
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
            setPincode(e.pinCode)
            onChange(e.value, index, 'city', parent)
            delete json?.[parent]?.[index].pinCode //
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
                        <MySelectCommon enableSearch selectedValue={ApiReducer?.apiJson?.natureOfCompany} name={'natureOfCompany'} title={'Nature of Company'} placeholder={'Enter Nature of Company'} options={natureOfCompanyOptions} validate={validateField} errorMsg={errors[`natureOfCompany`]} />
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


                                            <MyInputCommon value={ele?.address} title={'Address'} name={'address'} placeholder={'Enter Address'} onChange={(e) => { onChange(e.target.value, index, 'address', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].address`]} />
                                            <MyInputCommon value={ele?.landmark} title={'Landmark'} name={'landmark'} placeholder={'Enter Landmark'} onChange={(e) => { onChange(e.target.value, index, 'landmark', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].landmark`]} />
                                            <MySelectCommon enableSearch selectedValue={ele?.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'gstAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`gstAddresses[${index}].country`]} />
                                            <MySelectCommon enableSearch selectedValue={ele?.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'gstAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`gstAddresses[${index}].state`]} />
                                            <MySelectCommon enableSearch selectedValue={ele?.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'gstAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`gstAddresses[${index}].city`]} />
                                            <MyInputCommon enableSearch value={ele?.pinCode} title={'Pin Code'} name={'pinCode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pinCode', 'gstAddresses') }} errorMsg={errors[`gstAddresses[${index}].pinCode`]} />

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
                                            <MySelectCommon enableSearch selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'warehouseAddresses')} placeholder={'Enter Country'} options={options} errorMsg={errors[`warehouseAddresses[${index}].country`]} />
                                            <MySelectCommon enableSearch selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'warehouseAddresses')} placeholder={'Enter State'} options={state} errorMsg={errors[`warehouseAddresses[${index}].state`]} />
                                            <MySelectCommon enableSearch selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'warehouseAddresses')} placeholder={'Enter City'} options={city} errorMsg={errors[`warehouseAddresses[${index}].city`]} />
                                            <MyInputCommon value={ele.pinCode} title={'Pin Code'} name={'pinCode'} placeholder={'Enter Pin Code'} onChange={(e) => { onChange(e.target.value, index, 'pinCode', 'warehouseAddresses') }} errorMsg={errors[`warehouseAddresses[${index}].pinCode`]} />

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
                <div className="p-5">

                    <div onClick={() => onAddAddress('bankDetails')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Bank Details'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.bankDetails?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.bankDetails?.map?.((ele, index) => {

                                    console.log(ele);

                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>

                                            <MyInputCommon value={ele?.beneficiaryName} title={'Beneficiary Name'} name={'beneficiaryName'} placeholder={'Enter Beneficiary Name'} onChange={(e) => { onChange(e.target.value, index, 'beneficiaryName', 'bankDetails') }} errorMsg={errors[`bankDetails[${index}].beneficiaryName`]} />
                                            <MyInputCommon value={ele?.bankName} title={'Bank Name'} name={'bankName'} placeholder={'Enter Bank Name'} onChange={(e) => { onChange(e.target.value, index, 'bankName', 'bankDetails') }} errorMsg={errors[`bankDetails[${index}].bankName`]} />
                                            <MyInputCommon value={ele?.branchName} title={'Branch Name'} name={'branchName'} onChange={(e) => onChange(e.target.value, index, 'branchName', 'bankDetails')} placeholder={'Enter Branch Name'} errorMsg={errors[`bankDetails[${index}].branchName`]} />
                                            <MyInputCommon value={ele?.ifscCode} title={'IFSC Code'} name={'ifscCode'} onChange={(e) => onChange(e.target.value, index, 'ifscCode', 'bankDetails')} placeholder={'Enter IFSC Code'} errorMsg={errors[`bankDetails[${index}].ifscCode`]} />
                                            <MyInputCommon value={ele?.accountNo} title={'Account No.'} name={'accountNo'} onChange={(e) => onChange(e.target.value, index, 'accountNo', 'bankDetails')} placeholder={'Enter Account Details'} errorMsg={errors[`bankDetails[${index}].accountNo`]} />
                                            <MyFileUploadCommon name={'cancelledCheque'} title={'Upload Cancelled Cheque Doc'} error={errors[`bankDetails[${index}].cancelledCheque`]} onChange={(data) => {
                                                const json = ApiReducer.apiJson;
                                                json['bankDetails'][index] = { ...json['bankDetails'][index], ...data }
                                                validateField(`bankDetails[${index}].cancelledCheque`, json['bankDetails'][index]?.cancelledCheque)
                                                setDataAction(json, SET_API_JSON);
                                            }} uppercase />
                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'bankDetails')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            {/* <div className='bg-white mt-5'>
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
                </div>
            </div> */}
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
                <MyButton title={params?.id ? 'Update' : 'Submit'} onClick={() => onSubmit()} />
            </div>
        </div>
    )
}

export default CreateCustomer;