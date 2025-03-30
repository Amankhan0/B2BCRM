import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import MyButton from "../../../Component/MyButton";
import { Colors } from "../../../Colors/color";
import Title from "../../../Component/Title";
import DataTable from "../../../Component/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { ApiHit, GetFullYearWithTime } from "../../../utils";
import { searchRole } from "../../../Constants/Constants";
import { setRole } from "../../../Store/Action/RoleAction";
import { deleteIcon, editIcon } from "../../../Icons/Icon";
import { getAuthenticatedUserWithRoles } from "../../../Storage/Storage";

const Role = () => {

    const RoleReducer = useSelector(state => state.RoleReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)
    let user = getAuthenticatedUserWithRoles();

    const dispatch = useDispatch()

    useEffect(() => {
        if (RoleReducer.doc === null) {
            fetchData()
        }
    }, [])

    const fetchData = () => {
        var json = {
            page: PaginationReducer.pagination.page,
            limit: PaginationReducer.pagination.limit,
            search: PaginationReducer.pagination.search,
        }
        ApiHit(json, searchRole).then(res => {
            if (res.content) {
                dispatch(setRole(res))
            }
        })
    }

    const th = ['Role Type', 'Role Name', 'Created On', 'Action']
    let td;
    if (RoleReducer.doc !== null) {
        if (RoleReducer.doc.content.length !== 0) {
            td = RoleReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='min-w-[100px] p-2 border text-black'><Title size={'xs'} title={ele?.roleType || '-'} /></td>
                        <td className='min-w-[100px] p-2 border text-black'><Title size={'xs'} title={ele?.roleName || '-'} /></td>
                        <td className='min-w-[100px] p-2 border text-black'><Title size={'xs'} title={GetFullYearWithTime(ele?.updatedAt) || '-'} /></td>
                        <td className='min-w-[100px] p-2 border text-black'>
                            <div className='flex gap-2'>
                                {
                                    user?.roleObject?.permission?.[6]?.permission?.[0].write &&
                                    <div className='flex gap-2'>
                                        <NavLink to={'/editrole/' + ele?._id} className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
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
                        <Title title={'Role'} size={'lg'} color={Colors.BLACK} />
                    </div>
                    <div className='flex gap-5'>
                        {
                            user?.roleObject?.permission?.[6]?.permission?.[0].write &&
                            <div className='w-full mt-1'>
                                <NavLink to={'/addrole'}>
                                    <MyButton className={'p-2.5'} title={'Create Role'} />
                                </NavLink>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="mt-5 p-3 card">
                <DataTable th={th} td={td} totalPages={RoleReducer?.doc?.totalPages} api={fetchData} />
            </div>
        </div>
    )
}
export default Role;