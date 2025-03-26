import React, { useEffect, useState } from "react";
import MyFileUpload from "../../../Component/MyFileUpload";
import MyInput from "../../../Component/MyInput";
import DataTable from "../../../Component/DataTable";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ApiHit } from "../../../utils";
import { searchDispatch } from "../../../Constants/Constants";
import { setDispatch } from "../../../Store/Action/OrderAction";
import AddDispatchOrder from "./AddDispatch";
import MyButton from "../../../Component/MyButton";
import { backIcon } from "../../../SVG/Icons";

const DispatchOrder = ({ data }) => {

    const OrderReducer = useSelector(state => state.OrderReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(null)
    const [render, setRender] = useState(Date.now())
    const [page, setPage] = useState(1)

    // useEffect(() => {
    //     if (OrderReducer.Dispatch === null) {
    //         // fetchData()
    //     }
    // }, [render])

    const fetchData = () => {
        var json = {
            page: PaginationReducer?.pagination.page,
            limit: PaginationReducer?.pagination.limit,
            search: {
                po_id: data._id
            }
        }
        ApiHit(json, searchDispatch).then(res => {
            console.log('res');
            if (res.content) {
                dispatch(setDispatch(res.content))
            }
        })
    }

    const th = ['Product Name', 'Products', "Make", "Varient/Unit", 'Quantity', 'Price', 'GST', 'CGST', 'SGST']
    let td;
    if (OrderReducer.Dispatch !== null) {
        td = OrderReducer.Dispatch?.products?.map((ele, i) => {
            return (
                ele.availablePO !== '0' &&
                <tr>
                    <td className='p-2 border text-black'>{ele?.product_id?.productName || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.hsnNo || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.product_id?.make || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.qty || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.price || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.productVarient?.gst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.cgst || '-'}</td>
                    <td className='p-2 border text-black'>{ele?.sgst || '-'}</td>
                </tr>
            )
        })
    }

    console.log('OrderReducer', OrderReducer);

    return (
        <div className='p-5'>
            <AddDispatchOrder data={data} />
            {/* {
                page === 1 ?
                    <div>
                        <div className="flex justify-between mb-5 items-center">
                            <p className="text-base text-black">Order Ref No : {data.orderRefNo}</p>
                            <MyButton onClick={() => setPage(2)} title={'Dispatch Order'} />
                        </div>
                        <DataTable td={td} th={th} totalPages={OrderReducer?.Dispatch?.totalPages} api={fetchData} />
                    </div>
                    :
                    <div>
                        <div className="flex mb-5 gap-5 items-center">
                            <p onClick={()=>setPage(1)} className="flex text-black"><i>{backIcon}</i>Back</p>
                            <p className="text-base text-black">Order Ref No : {data.orderRefNo}</p>
                        </div>
                        <AddDispatchOrder data={data} />
                    </div>
            } */}

        </div>
    )
}

export default DispatchOrder;