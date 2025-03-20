import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInputCommon from '../../Component/MyInputCommon';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MyButton from '../../Component/MyButton';
import { CustomerValidation } from './CustomerValidation';
import { ApiHit, ObjIsEmpty } from '../../utils';
import { addProduct, searchProduct, } from '../../Constants/Constants';
import MySelectCommon from '../../Component/MySelectCommon';
import { deleteIcon, plusIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import useCountryStateCityOptions from '../../Hooks/useCountryStateCityoptions';
import toast from 'react-hot-toast';
import MyFileUpload from '../../Component/MyFileUpload';
import { object, string, array } from 'yup';
import useYupValidation from '../../Hooks/useYupValidation';

function CreateProduct() {

    const ApiReducer = useSelector(state => state.ApiReducer);
    const { options, loading, error } = useCountryStateCityOptions(['IN']); // Or empty array for all countries

    const validationSchema = object().shape({
        name: string().required('Name is required'),
        make: string().required('Make is required'),
        hsnNo: string().required('HSN number is required'),
        variants: array().of(
          object().shape({
            name: string().required('Variant name is required'),
            price: string().required('Price is required'), // Consider using number() if it's a numeric price
            unit: string().required('Unit is required'),
            minQty: string().required('Minimum quantity is required'), // Consider using number() if it's a number
            gst: string().required('GST is required'), // Consider number() or a specific format if needed.
          })
        ),
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

                ApiHit(ApiReducer?.apiJson, addProduct).then(res => {
                    console.log('res', res);

                    if (res.status === 200) {
                        toast.success('Product created successfully')
                        window.location.pathname = '/product'
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
            search: {}
        }
        ApiHit(json, searchProduct).then(res => {
            if (res.content) {
                setDataAction(res.content)
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
                        <MyInputCommon name={'name'} title={'Product Name'} placeholder={'Enter Product Name'} validate={validateField} errorMsg={errors[`name`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'make'} title={'Make'} placeholder={'Enter Make'} validate={validateField} errorMsg={errors[`make`]} />
                    </div>
                    <div>
                        <MyInputCommon name={'hsnNo'} title={'HSN No.'} placeholder={'Enter HSN No.'} validate={validateField} errorMsg={errors[`hsnNo`]}  />
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

                    <div onClick={() => onAddAddress('variants')} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                        <Title title={'Add Product Variant'} size={'xl'} />
                        <i>{plusIcon}</i>
                    </div>
                    {
                        ApiReducer?.apiJson?.variants?.length > 0 &&
                        <div>
                            {
                                ApiReducer?.apiJson?.variants?.map?.((ele, index) => {
                                    return (
                                        <div className="grid grid-cols-4 gap-4 my-5" key={index}>
                                            <MyInputCommon value={ele.name} title={'Variant Name'} name={'name'} placeholder={'Enter Variant Name'} onChange={(e) => { onChange(e.target.value, index, 'name', 'variants') }} errorMsg={errors[`variants[${index}].name`]}/>
                                            <MyInputCommon value={ele.price} title={'Price'} name={'price'} placeholder={'Enter Price'} onChange={(e) => { onChange(e.target.value, index, 'price', 'variants') }} errorMsg={errors[`variants[${index}].price`]}/>
                                            <MyInputCommon value={ele.unit} title={'Unit'} name={'unit'} placeholder={'Enter Unit'} onChange={(e) => { onChange(e.target.value, index, 'unit', 'variants') }} errorMsg={errors[`variants[${index}].unit`]} />
                                            <MyInputCommon value={ele.minQty} title={'Min. Qty'} name={'minQty'} placeholder={'Enter Minimum Qunatity'} onChange={(e) => { onChange(e.target.value, index, 'minQty', 'variants') }} errorMsg={errors[`variants[${index}].minQty`]} />
                                            <MyInputCommon value={ele.gst} title={'GST (%)'} name={'gst'} placeholder={'Enter GST'} onChange={(e) => { onChange(e.target.value, index, 'gst', 'variants') }} errorMsg={errors[`variants[${index}].gst`]} />

                                            <div className="flex items-center mt-5">
                                                <MyButton onClick={() => handleRemove(index, 'variants')} title={'Remove'} bg={'darkred'} icon={deleteIcon} />
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