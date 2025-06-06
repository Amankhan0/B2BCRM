import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import MyButton from "../../../Component/MyButton";
import { Colors } from "../../../Colors/color";
import Title from "../../../Component/Title";
import DataTable from "../../../Component/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { ApiHit, GetFullYearWithTime } from "../../../utils";
import { searchRole, searchUser, tableTdClass } from "../../../Constants/Constants";
import { setRole } from "../../../Store/Action/RoleAction";
import { deleteIcon, editIcon } from "../../../Icons/Icon";
import { setUser } from "../../../Store/Action/UserAction";
import { getAuthenticatedUserWithRoles } from "../../../Storage/Storage";

const User = () => {

    const UserReducer = useSelector(state => state.UserReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)
    let user = getAuthenticatedUserWithRoles();
    const width = window.innerWidth

    const dispatch = useDispatch()

    useEffect(() => {
        if (UserReducer.doc === null) {
            fetchData()
        }
    }, [])

    const fetchData = () => {
        var json = {
            page: PaginationReducer.pagination.page,
            limit: PaginationReducer.pagination.limit,
            search: PaginationReducer.pagination.search,
        }
        ApiHit(json, searchUser).then(res => {
            if (res.content) {
                dispatch(setUser(res))
            }
        })
    }

    const th = ['Full Name', 'Contact', 'Email', 'UserName', 'Role Name', 'Action']
    let td;
    if (UserReducer.doc !== null) {
        if (UserReducer.doc.content.length !== 0) {
            td = UserReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.firstName + ' ' + ele?.lastName || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.contact || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.email || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.username || '-'} /></td>
                        <td className={tableTdClass}><Title size={'xs'} title={ele?.roleName || '-'} /></td>
                        <td className={tableTdClass}>
                            <div className='flex gap-2'>
                                {
                                    user?.roleObject?.permission?.[7]?.permission?.[0].write &&
                                    <div className='flex gap-2'>
                                        <NavLink to={'/edituser/'+ele?._id} className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                                            {editIcon}
                                        </NavLink>
                                        {/* <div className='cursor-pointer' style={{ color: Colors.RED }}>
                                            {deleteIcon}
                                        </div> */}
                                    </div>
                                }
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }
    return (
        <div>
            <div className="card mt-10 p-2">
                <div className="flex justify-between items-center">
                    <div>
                        <Title title={'User'} size={'lg'} color={Colors.BLACK} />
                    </div>
                    <div className='flex gap-5'>
                        {
                            user?.roleObject?.permission?.[7]?.permission?.[0].write &&
                            <div className='w-full mt-1'>
                                <NavLink to={'/adduser'}>
                                    <MyButton className={'p-2.5'} title={'Create User'} />
                                </NavLink>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div style={{ width: width / 1.3 }} className='mt-5 p-5 bg-white overflow-scroll'>
                <DataTable th={th} td={td} totalPages={UserReducer?.doc?.totalPages} api={fetchData} />
            </div>
        </div>
    )
}
export default User;