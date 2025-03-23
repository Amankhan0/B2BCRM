import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MyButton from '../../Component/MyButton';
import { CustomerValidation } from './CustomerValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addProduct, searchProduct, updateProduct, } from '../../Constants/Constants';
import MySelectCommon from '../../Component/MySelectCommon';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import useCountryStateCityOptions from '../../Hooks/useCountryStateCityoptions';
import toast from 'react-hot-toast';
import MyFileUpload from '../../Component/MyFileUpload';
import { object, string, array } from 'yup';
import useYupValidation from '../../Hooks/useYupValidation';
import { useParams } from 'react-router-dom';

function CreateProduct() {

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const validationSchema = object().shape({
        productName: string().required('Product name is required'),
        make: string().required('Make is required'),
        hsnNo: string()
            .required('HSN number is required')
            .matches(/^[0-9]{4,8}$/, 'Invalid HSN number format. Must be 4 to 8 digits.'),
        varients: array().of(
            object().shape({
                varientName: string().required('Variant name is required'),
                varientUnit: string().required('Variant unit is required'),
                price: string().required('Price is required'), // Consider using .number() if it's a number
                priceUnit: string().required('Price unit is required'),
                minQty: string().required('Minimum quantity is required'), // Consider .number()
                gst: string().required('GST is required'), // Consider a specific format if needed
            })
        ).required('At least one variant is required'),
    });

    const { errors, validateJson, validateField } = useYupValidation(validationSchema);


    const dispatch = useDispatch()

    const params = useParams();
    useLayoutEffect(() => {
        if (params?.id) {
            fetchData()
        }
    }, [params])


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

    console.log('errors', errors);
    const onSubmit = () => {
        dispatch(setDataAction({}, SET_API_JSON_ERROR))
        validateJson(ApiReducer?.apiJson).then(() => {
            var error = !ObjIsEmpty(errors)
            console.log('apiJson', ApiReducer?.apiJson);
            console.log('ApiReducer?.apiJson Error', errors);
            if (error) {
                dispatch(setDataAction(errors, SET_API_JSON_ERROR))
            } else {
                const api = params?.id ? updateProduct : addProduct;
                ApiHit(ApiReducer?.apiJson, api).then(res => {
                    console.log('res', res);

                    if (res.status === 200 || res.status === 201) {
                        toast.success('Product created successfully')
                        window.location.pathname = '/product'
                    } else {
                        toast.success(res.message)
                    }
                })
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

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: { _id: params?.id }
        }
        ApiHit(json, searchProduct).then(res => {
            if (res?.content) {
                dispatch(setDataAction(res?.content?.[0], SET_API_JSON))
            }
        })
    }

    return (
        <div className='m-10'>

            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Basic Information</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInputCommon name={'productName'} title={'Product Name'} placeholder={'Enter Product Name'} validate={validateField} errorMsg={errors[`productName`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'make'} title={'Make'} placeholder={'Enter Make'} validate={validateField} errorMsg={errors[`make`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'hsnNo'} title={'HSN No.'} placeholder={'Enter HSN No.'} validate={validateField} errorMsg={errors[`hsnNo`]} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Product Gallery</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyFileUpload name={'productImages'} title={'Upload Product Image'} error={!ApiReducer?.apiJson?.productImages} fileType={'array'} uppercase />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Billing Addresses</p>
                </div>
                <div className="p-5">

                    <div onClick={() => onAddAddress('varients')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Product Variant'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.varients?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.varients?.map?.((ele, index) => {
                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>
                                            <span style={{ display: 'flex' }}>
                                                <MyInputCommon className={'rounded-r-none'} value={ele.varientName} title={'Varient Name'} name={'varientName'} placeholder={'Enter Varient Name'} onChange={(e) => { onChange(e.target.value, index, 'varientName', 'varients') }} errorMsg={errors[`varients[${index}].varientName`]} />
                                                <MyInputCommon className={'rounded-l-none'} value={ele.varientUnit} title={'Varient Unit'} name={'varientUnit'} placeholder={'Enter Varient Unit'} onChange={(e) => { onChange(e.target.value, index, 'varientUnit', 'varients') }} errorMsg={errors[`varients[${index}].varientUnit`]} />
                                            </span>
                                            <span style={{ display: 'flex' }}>
                                                <MyInputCommon className={'rounded-r-none'} value={ele.price} title={'Price'} name={'price'} placeholder={'Enter Price'} onChange={(e) => { onChange(e.target.value, index, 'price', 'varients') }} errorMsg={errors[`varients[${index}].price`]} />
                                                <MyInputCommon className={'rounded-l-none'} value={ele.priceUnit} title={'Price Unit'} name={'priceUnit'} placeholder={'Enter Unit'} onChange={(e) => { onChange(e.target.value, index, 'priceUnit', 'varients') }} errorMsg={errors[`varients[${index}].priceUnit`]} />
                                            </span>
                                            <MyInputCommon value={ele.minQty} title={'Min. Qty'} name={'minQty'} placeholder={'Enter Minimum Qunatity'} onChange={(e) => { onChange(e.target.value, index, 'minQty', 'varients') }} errorMsg={errors[`varients[${index}].minQty`]} />
                                            <MyInputCommon value={ele.gst} title={'GST (%)'} name={'gst'} placeholder={'Enter GST'} onChange={(e) => { onChange(e.target.value, index, 'gst', 'varients') }} errorMsg={errors[`varients[${index}].gst`]} />
                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'varients')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
                                            </div>

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