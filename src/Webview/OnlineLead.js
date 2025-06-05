import React, { useEffect, useState } from "react";
import DataTable from "../Component/DataTable";
import { Colors } from "../Colors/color";
import Title from "../Component/Title";
import { tableTdClass } from "../Constants/Constants";
import { NavLink } from "react-router-dom";
import { phone, phoneIcon, smallphoneIcon } from "../SVG/Icons";
import { smalluserIcon, userIcon } from "../Icons/Icon";

const OnlineLead = () => {


    const [data, setData] = useState(null);
    const width = window.innerWidth

    useEffect(() => {
        if (data === null) {
            setData({
                doc: {
                    docs: [
                        {
                            "category": "construction-materials",
                            "product": "aggregates",
                            "name": "Aman",
                            "contactNo": "0123456789",
                            "pincode": "110017",
                            "adsSource": "Organic Lead",
                            "_id": "skjfnbsi435345dsfgfsjbdsf",
                            "status": "picked",
                        }, {
                            "category": "construction-materials",
                            "product": "aggregates",
                            "name": "Aman",
                            "contactNo": "0123456789",
                            "pincode": "110017",
                            "adsSource": "Organic Lead",
                            "_id": "skjfnbsi435345dsfgfsjbdsf",
                            "status": "pending",
                        }, {
                            "category": "construction-materials",
                            "product": "aggregates",
                            "name": "Aman",
                            "contactNo": "0123456789",
                            "pincode": "110017",
                            "adsSource": "Organic Lead",
                            "_id": "skjfnbsi435345dsfgfsjbdsf",
                            "status": "pending",
                        }, {
                            "category": "construction-materials",
                            "product": "aggregates",
                            "name": "Aman",
                            "contactNo": "0123456789",
                            "pincode": "110017",
                            "adsSource": "Organic Lead",
                            "_id": "skjfnbsi435345dsfgfsjbdsf",
                            "status": "picked",
                        }
                    ],
                    totalPages: 1,
                }
            })
        }
    }, [data])

    const fetchData = (page, limit) => {

    }

    const th = ["Name", "Contact No", "Category", "Product", "Pincode", 'Status', 'Action'];
    let td;
    if (data !== null) {
        td = data?.doc?.docs?.map((ele, i) => {
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
                    {/* <td className={tableTdClass}>{ele.adsSource}</td> */}
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
                    <DataTable th={th} td={td} totalPages={data?.doc?.totalPages} api={fetchData} />
                }
            </div>
        </div>
    );
}

export default OnlineLead;