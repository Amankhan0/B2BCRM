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

function CreateProduct() {

    const [decision, setDecision] = useState(false)
    const [customers, setCustomers] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const validationSchema = Yup.object().shape({
        companyDetails: Yup.object().shape({
          natureOfCompany: Yup.string().required('Nature of company is required'),
          companyName: Yup.string().required('Company name is required'),
          companySize: Yup.string().required('Company size is required'),
          industry: Yup.string().required('Industry is required'),
        }),
        customerDetails: Yup.object().shape({
          designation: Yup.string().required('Designation is required'),
          name: Yup.string().required('Name is required'),
          phone: Yup.string().min(10, 'Phone no. should be of 10 digit').max(10, 'Phone no. should be of 10 digit').required('Phone is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
        }),
        varients: Yup.array().of(
          Yup.object().shape({
            address: Yup.string().required('Address is required'),
            landmark: Yup.string().required('Landmark is required'),
            country: Yup.string().required('Country is required'),
            state: Yup.string().required('State is required'),
            city: Yup.string().required('City is required'),
            pincode: Yup.string()
              .matches(/^\d{6}$/, 'Pincode must be a 6-digit number')
              .required('Pincode is required'),
          })
        ),
        kycDetails: Yup.object().shape({
          pancardNo: Yup.string().required('PAN card number is required'),
          gstNo: Yup.string().required('GST number is required'),
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
        validateField(`${parent}.${index}.${key}`, value);
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
                        <MyInputCommon parent={'productDetails'} name={'name'} title={'Product Name'} placeholder={'Enter Product Name'} validate={validateField} errorMsg={errors[`productDetails.name`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'productDetails'} name={'make'} title={'Make'} placeholder={'Enter Make'} validate={validateField} errorMsg={errors[`productDetails.make`]} />
                    </div>
                    <div>
                        <MyInputCommon parent={'productDetails'} name={'hsnNo'} title={'HSN No.'} placeholder={'Enter HSN No.'} validate={validateField} errorMsg={errors[`productDetails.hsnNo`]}  />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Product Gallery</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                <div>
                    <MyFileUpload name={'product images'} title={'Upload Product Images'} error={!ApiReducer?.apiJson?.pancard} uppercase />
                </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Billing Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('varients')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Product Varient'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.varients?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.varients?.map?.((ele, index) => {
                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>
                                            <MyInputCommon value={ele.name} title={'Varient Name'} name={'name'} placeholder={'Enter Vareint Name'} onChange={(e) => { onChange(e.target.value, index, 'name', 'varients') }} errorMsg={errors[`varients.${index}.name`]}/>
                                            <MyInputCommon value={ele.price} title={'Price'} name={'price'} placeholder={'Enter Price'} onChange={(e) => { onChange(e.target.value, index, 'price', 'varients') }} errorMsg={errors[`varients.${index}.price`]}/>
                                            {/* <MySelectCommon selectedValue={ele.country} title={'Country'} name={'country'} onChange={(e) => handleChange(e, 'state', index, 'varients')} placeholder={'Enter Country'} options={options} errorMsg={errors[`varients.${index}.country`]} />
                                            <MySelectCommon selectedValue={ele.state} title={'State'} name={'state'} onChange={(e) => handleChange(e, 'city', index, 'varients')} placeholder={'Enter State'} options={state} errorMsg={errors[`varients.${index}.state`]} />
                                            <MySelectCommon selectedValue={ele.city} title={'City'} name={'city'} onChange={(e) => handleChange(e, 'pincode', index, 'varients')} placeholder={'Enter City'} options={city} errorMsg={errors[`varients.${index}.city`]} /> */}
                                            <MyInputCommon value={ele.unit} title={'Unit'} name={'unit'} placeholder={'Enter Unit'} onChange={(e) => { onChange(e.target.value, index, 'unit', 'varients') }} errorMsg={errors[`varients.${index}.unit`]} />
                                            <MyInputCommon value={ele.minQty} title={'Min. Qty'} name={'minQty'} placeholder={'Enter Minimum Qunatity'} onChange={(e) => { onChange(e.target.value, index, 'minQty', 'varients') }} errorMsg={errors[`varients.${index}.minQty`]} />
                                            <MyInputCommon value={ele.gst} title={'GST (%)'} name={'gst'} placeholder={'Enter GST'} onChange={(e) => { onChange(e.target.value, index, 'gst', 'varients') }} errorMsg={errors[`varients.${index}.gst`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'varients')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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

export default CreateProduct;