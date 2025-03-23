import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import MyButton from "../../../Component/MyButton";
import { Colors } from "../../../Colors/color";
import Title from "../../../Component/Title";
import DataTable from "../../../Component/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { ApiHit, GetFullYearWithTime } from "../../../utils";
import { searchRole, searchUser } from "../../../Constants/Constants";
import { setRole } from "../../../Store/Action/RoleAction";
import { deleteIcon, editIcon } from "../../../Icons/Icon";
import { setUser } from "../../../Store/Action/UserAction";

const User = () => {

    const UserReducer = useSelector(state => state.UserReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)

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

    const th = ['Full Name', 'Contact', 'Email','UserName','Role Type','Action']
    let td;
    if (UserReducer.doc !== null) {
        if (UserReducer.doc.content.length !== 0) {
            td = UserReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.firstName + ' ' + ele?.lastName || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.contact || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.email || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.username || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.role_id?.roleName || '-'} /></td>
                        <td className='p-2 border text-black'>
                            <div className='flex gap-2'>
                                {
                                    <div className='flex gap-2'>
                                        <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                                            {editIcon}
                                        </div>
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

    console.log(UserReducer);
    
    
    return (
        <div>
            <div className="card mt-10 p-2">
                <div className="flex justify-between items-center">
                    <div>
                        <Title title={'User'} size={'lg'} color={Colors.BLACK} />
                    </div>
                    <div className='flex gap-5'>
                        <div className='w-full mt-1'>
                            <NavLink to={'/adduser'}>
                                <MyButton className={'p-2.5'} title={'Create User'} />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 p-3 card">
                <DataTable th={th} td={td} totalPages={UserReducer?.doc?.totalPages} api={fetchData} />
            </div>
        </div>
    )
}
export default User;