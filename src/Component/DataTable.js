import React from 'react'
import { useSelector } from 'react-redux'
import MyPagination from './MyPagination';
import { Colors } from '../Colors/color';
import Title from './Title';

function DataTable({ th, td, api, hidePagination, totalPages }) {

    const PaginationReducer = useSelector(state => state.PaginationReducer)
    const SidebarReducer = useSelector(state => state.SidebarReducer)

    console.log('SidebarReducer', SidebarReducer?.doc);

    return (
        <div className='bg-white'>
            <div>
                <table className='w-full'>
                    <thead>
                        <tr style={{ background: Colors.ThemeBlue }} className='rounded-tl-xl rounded-tr-xl text-white'>
                            {
                                th?.map((ele, i) => {
                                    return <th className='p-2 text-center border'>
                                        <Title title={ele} size={'xs'} />
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {td}
                    </tbody>
                </table>
                {
                    !td || td?.length === 0 ?
                        <p className='text-lg text-center p-2 text-black border'>No Data Found</p>
                        :
                        ""
                }
            </div>
            {
                td && !hidePagination &&
                <div className='mt-5'>
                    <MyPagination
                        currentPage={PaginationReducer?.pagination?.page}
                        totalPages={totalPages}
                        api={api}
                    />
                </div>
            }
        </div>

    )
}

export default DataTable