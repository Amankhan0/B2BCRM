import React, { useEffect, useState } from "react";
import DataTable from "../Component/DataTable";
import { Colors } from "../Colors/color";
import Title from "../Component/Title";
import { searchWebsiteLead, tableTdClass } from "../Constants/Constants";
import { NavLink } from "react-router-dom";
import { phone, phoneIcon, smallphoneIcon } from "../SVG/Icons";
import { smalluserIcon, userIcon } from "../Icons/Icon";
import { ApiHit } from "../utils";
import { useSelector } from "react-redux";

const OnlineLead = () => {

    const [data, setData] = useState(null);
    const width = window.innerWidth
    const PaginationReducer = useSelector(state => state.PaginationReducer)
    useEffect(() => {
        if (data === null) {
            fetchData()
        }
    }, [data])

    const fetchData = () => {
        var json = {
            page: PaginationReducer.pagination.page,
            limit: PaginationReducer.pagination.limit,
            search: {}
        }
        ApiHit(json, searchWebsiteLead).then((res) => {
            if (res?.content) {
                setData(res);
            }
        })
    }

    const th = ["Name", "Contact No", "Category", "Product", "Pincode", 'Source','Status', 'Action'];
    let td;
    if (data !== null) {
        td = data?.content?.map((ele, i) => {
            return (
                <tr key={i}>
                    <td className={tableTdClass}>
                        <div className="flex gap-1 justify-center items-center">
                            <i>{smalluserIcon}</i>
                            <p>{ele.name}</p>
                        </div>
                    </td>
                    <td className={tableTdClass}>
                        <div className="flex gap-1 justify-center items-center">
                            <i>{smallphoneIcon}</i>
                            <p>{ele.contactNo}</p>
                        </div>
                    </td>
                    <td className={tableTdClass}>{ele.category}</td>
                    <td className={tableTdClass}>{ele.product}</td>
                    <td className={tableTdClass}>{ele.pincode}</td>
                    <td className={tableTdClass}>{ele.adsSource}</td>
                    <td className={tableTdClass}>
                        <center>
                            <p className={ele.status === 'picked' ? 'bg-green-300 rounded-lg w-20 py-0.5 text-black' : 'bg-red-500 rounded-lg w-20 py-0.5 text-white'}>
                                {ele.status === 'picked' ? 'Picked' : 'Pending'}
                            </p>
                        </center>
                    </td>
                    <td className={tableTdClass + " underline"} style={{ color: Colors.ThemeBlue }}>
                        {
                            ele.status !== 'picked' &&
                            <NavLink to={'/online-lead/pick/' + ele?._id} className="cursor-pointer">
                                Pick Lead
                            </NavLink>
                        }
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className='mt-10'>
            <div className='card p-2' style={{ width: width / 1.3 }}>
                <div className='flex justify-between items-center'>
                    <Title title={'Online Lead'} size={'xl'} color={Colors.BLACK} />
                </div>
            </div>
            <div style={{ width: width / 1.3 }} className={`mt-5 p-5 bg-white overflow-scroll`}>
                {
                    data !== null &&
                    <DataTable th={th} td={td} totalPages={data?.totalPages} api={fetchData} />
                }
            </div>
        </div>
    );
}

export default OnlineLead;