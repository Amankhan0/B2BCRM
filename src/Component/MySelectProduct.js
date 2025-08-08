import React, { useEffect, useState } from "react";
import MySelect from "./MySelect";
import { ApiHit } from "../utils";
import { searchProduct } from "../Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { setDataAction } from "../Store/Action/SetDataAction";
import { SET_API_JSON } from "../Store/ActionName/ActionName";
import MyInput from "./MyInput";
import Title from "./Title";
import { deleteIcon, plusIcon } from "../Icons/Icon";
import MyButton from "./MyButton";
import toast from "react-hot-toast";

const MySelectProduct = ({ isQuotation }) => {

    const PaginationReducer = useSelector(state => state.PaginationReducer)
    const ApiReducer = useSelector(state => state.ApiReducer)

    const [products, setProducts] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (products === null && !isQuotation) {
            fetchData()
        }
    }, [products])

    const fetchData = () => {
        var json = {
            page: PaginationReducer.pagination.page,
            limit: 1000,
            search: {

            }
        }
        ApiHit(json, searchProduct).then(res => {
            if (res?.content) {
                setProducts(res?.content)
            }
        })
    }

    const onChange = (value, index, name) => {
        var oldJson = ApiReducer?.apiJson
        if (name === 'productVarient') {
            var _id = oldJson.products[index].product_id._id
            var selectedItem = products.find((ele, i) => ele._id === _id)
            var selectedVarient = selectedItem.varients.find((ele, i) => ele.varientName + ele.varientUnit === value)
            oldJson.products[index][name] = selectedVarient
        } else if (name === 'product_id') {
            var selectedItem = products.find((ele, i) => ele._id === value)
            oldJson.products[index][name] = selectedItem
        } else if (name === 'price') {
            const varientOne = oldJson.products[index].product_id.varients.find(v => v.varientName === oldJson.products[index].productVarient.varientName);
            oldJson.products[index].cgst = Number(oldJson.products[index].qty) * Number(varientOne.gst) * Number(value) / 200
            oldJson.products[index].sgst = Number(oldJson.products[index].qty) * Number(varientOne.gst) * Number(value) / 200
            oldJson.products[index][name] = value
        } else if (name === 'qty') {
            const varientOne = oldJson.products[index].product_id.varients.find(v => v.varientName === oldJson.products[index].productVarient.varientName);
            oldJson.products[index].cgst = Number(oldJson.products[index].qty) * Number(varientOne.gst) * Number(oldJson.products[index].price) / 200
            oldJson.products[index].sgst = Number(oldJson.products[index].qty) * Number(varientOne.gst) * Number(oldJson.products[index].price) / 200
            oldJson.products[index][name] = value
        }
        else {
            oldJson.products[index][name] = value
        }
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    const onAddProduct = () => {
        var oldJson = ApiReducer?.apiJson
        if (!oldJson.products) {
            oldJson.products = [{}];
            dispatch(setDataAction(oldJson, SET_API_JSON))
        }
        else {
            console.log('oldJson', oldJson);

            if (!oldJson.products[oldJson.products.length - 1].product_id || !oldJson.products[oldJson.products.length - 1].productVarient || !oldJson.products[oldJson.products.length - 1].qty || !oldJson.products[oldJson.products.length - 1].price) {
                toast.error('Please fill previous product detail')
            } else {
                oldJson.products.push({});
                dispatch(setDataAction(oldJson, SET_API_JSON))
            }
        }

    }

    const onRemoveProduct = (index) => {
        var oldJson = ApiReducer?.apiJson
        oldJson.products.splice(index, 1)
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    console.log('ApiReducer',ApiReducer);
    

    return (
        <div className="p-5">
            {
                !isQuotation &&
                <div onClick={() => onAddProduct()} className="w-max flex items-center gap-1 text-black hover:text-themeBlue hover:underline cursor-pointer">
                    <Title title={'Add Product'} size={'xl'} />
                    <i>{plusIcon}</i>
                </div>
            }
            {
                ApiReducer?.apiJson?.products &&
                <div>
                    {
                        ApiReducer?.apiJson?.products?.map?.((ele, index) => {
                            
                            return (
                                <div className="grid grid-cols-6 gap-4 my-5">
                                    {
                                        !isQuotation ?
                                            <MySelect disable={isQuotation && true} selectedValue={ele.product_id?.productName+ele.product_id?.make} onChange={(e) => onChange(e.target.value, index, 'product_id')} title={'Product'} options={products?.map((item, i) => item)} keyName={'productName'} />
                                            :
                                            <MyInput disable={true} value={ele.product_id.productName || '0'} title={'Product Name'} name={'productName'} placeholder={'Enter Product Name'} />
                                    }
                                    {
                                        ele.product_id && ele.product_id.varients &&
                                            !isQuotation ?
                                            <MySelect disable={isQuotation && true} selectedValue={ele.productVarient?.varientName} onChange={(e) => onChange(e.target.value, index, 'productVarient')} title={'Varient'} options={ele.product_id && ele.product_id.varients?.map((item, i) => item)} keyName='varientName' />
                                            :
                                            <MyInput disable={true} value={ele.productVarient?.varientName || '0'} title={'Product Varient'} name={'productVarient'} placeholder={'Enter Product Varient'} />
                                    }
                                    {
                                        ele.product_id &&
                                        <>
                                            <MyInput value={ele.qty} onChange={(e) => onChange(e.target.value, index, 'qty')} title={'Quantity'} name={'qty'} placeholder={'Enter Quantity'} />
                                            <MyInput value={ele.price !== null ? ele.price : '0'} onChange={(e) => onChange(e.target.value, index, 'price')} title={'Price'} name={'price'} placeholder={'Enter Price'} />
                                        </>
                                    }
                                    {
                                        index > 0 &&
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
    )
}

export default MySelectProduct;