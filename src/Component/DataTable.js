import React from 'react'
import { useSelector } from 'react-redux'
import MyPagination from './MyPagination';
import { Colors } from '../Colors/color';

function DataTable({ th, td, api, hidePagination, totalPages }) {

    const PaginationReducer = useSelector(state => state.PaginationReducer)

    console.log('totalPages', totalPages);

    return (
        <div>
            <div style={{ width: '100%', overflowX: 'auto', scrollbarColor: 'red', scrollbarWidth: 'thin', }}>
                <table style={{ width: '180%' }}>  {/* Set a width for the table to make it wider than the container */}
                    <thead>
                        <tr style={{ background: Colors.ThemeBlue }} className='rounded-tl-xl rounded-tr-xl text-white'>
                            {
                                th?.map((ele, i) => {
                                    return <th className='p-2 text-center border'>{ele}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {td}
                    </tbody>
                </table>
                {
                    td?.length === 0 &&
                    <p className='text-lg text-center p-2 text-black'>No Data Found</p>
                }
            </div>
            <div>
                {
                    <MyPagination
                        currentPage={PaginationReducer?.pagination?.page}
                        totalPages={totalPages}
                        api={api}
                    />
                }
            </div>
        </div>

    )
}

export default DataTable