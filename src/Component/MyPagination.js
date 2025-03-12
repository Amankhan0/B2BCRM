import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { setPagination } from '../Store/Action/PaginationAction';
import { Colors } from '../Colors/color';

function MyPagination({ api,totalPages }) {
    const [error, setError] = useState(false)

    const PaginationReducer = useSelector(state => state.PaginationReducer)
    const dispatch = useDispatch()


    function handlePageClick(selectedPage) {
        let currentPage = selectedPage?.selected + 1
        var tj = PaginationReducer.pagination
        tj.page = currentPage

        console.log('tj', tj);

        dispatch(setPagination(tj))
        if (api !== undefined) { api() }
    }
    console.log("PaginationReducer", PaginationReducer);


    const onChangeLimit = (value) => {

        const limit = Number(value);
        if (limit) {
            var tj = PaginationReducer.pagination
            tj.limit = limit
            tj.page = 1
            // if (tj.page !== 1) {
            //     tj.limit = 6
            //     setError(true)
            // } else {
            //     tj.limit = limit
            // }
            dispatch(setPagination(tj))
            if (api !== undefined) { api() }
        }
    }

    console.log('totalPages --- -',totalPages);


    return (
        <div>
            <div className='flex items-center gap-3'>
                <div className="appearance-none bg-white border border-gray-100 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500 flex flex-row justify-between">
                    <label className='block text-sm font-medium text-gray-700'>Limit : &nbsp;</label>
                    <select
                        className='bg-transparent border border-gray-300 rounded-md w-14 pl-1'
                        onChange={(e) => onChangeLimit(e.target.value)}
                        value={PaginationReducer.pagination.limit}
                    >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    {/* <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div> */}
                    <p className={`text-[#b31b1b] ml-4`}>{error ? "You need to return to Page 1 to change limit" : ""}</p>
                </div>

                <ReactPaginate
                    breakLabel={<span className='mr-4 flex items-center justify-center'>...</span>}
                    nextLabel={<div className='p-2 flex items-center justify-center bg-slate-200 rounded-md'>
                        <IoIosArrowForward />        </div>}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages}
                    previousLabel={<div className='w-7 h-7 flex items-center justify-center bg-slate-200 rounded-md mr-2'>
                        <IoIosArrowBack />        </div>}
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                    pageClassName='block mr-2 rounded-md  tex-black px-3 text-xs flex items-center justify-center hover:bg-slate-300'
                    activeClassName={`bg-[${Colors.ThemeBlue}] text-white hover:bg-themeblue hover:text-white`}
                />
            </div>
        </div>
    );
}

export default MyPagination;