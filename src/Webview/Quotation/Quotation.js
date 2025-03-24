import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { OrderInitiated, searchLead, searchQuotation, selectClass } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { downloadIcon, plusIcon, smallEyeIcon } from '../../Icons/Icon';
import { setQuotation } from '../../Store/Action/QuotationAction';
import QuotationProductsView from './QuotationProductsView';
import "jspdf-autotable";
import QuotaionPDF from './QuotaionPDF';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';

function Quotation({ selectedLeadId }) {

    const QuotationReducer = useSelector(state => state.QuotationReducer)
    const PaginationReducer = useSelector(state => state.PaginationReducer)
    let user = getAuthenticatedUserWithRoles();

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [leadData, setLeadData] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)
    const [quotationPdf, setQuotationPdf] = useState(null)

    useEffect(() => {
        if (leadData === null && !selectedLeadId) {
            fetchData()
        } else if (selectedLeadId && selectedLead === null) {
            setSelectedLead(selectedLeadId)
        }
        else if (QuotationReducer?.doc === null && selectedLead !== null) {
            fetchQuotationData()
        }
    }, [leadData, selectedLead, QuotationReducer])

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {
                user_id: user?.userData?._id
            }
        }
        ApiHit(json, searchLead).then(res => {
            if (res?.content) {
                setLeadData(res)
            }
        })
    }

    const fetchQuotationData = () => {
        var json = {
            page: PaginationReducer.pagination.page,
            limit: PaginationReducer.pagination.limit,
            search: {
                lead_id: JSON.parse(selectedLead)._id
            }
        }
        ApiHit(json, searchQuotation).then(res => {
            if (res?.content) {
                dispatch(setQuotation(res))
            }
        })
    }

    const th = ['Quotation Ref No', 'Lead Source', 'Company Name', 'Company Size', 'Industry', 'Customer Name', 'Customer Contact', 'Customer Email', 'Products', 'Action']

    let td;
    if (QuotationReducer.doc !== null) {
        if (QuotationReducer.doc.content.length !== 0) {
            td = QuotationReducer.doc.content.map((ele, i) => {
                return (
                    <tr>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.quotationRefNo || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.companyName || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.companySize || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.leadSource || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.industry || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.name || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.contact || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.email || '-'} /></td>
                        <td className='p-2 border text-black'>
                            <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
                        </td>
                        <td className='p-2 border text-black'>
                            <div className='flex gap-2'>
                                <div onClick={() => setQuotationPdf(ele)} className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                                    {downloadIcon}
                                </div>
                                {
                                    leadData?.content?.[0]?.status !== OrderInitiated && user?.roleObject?.permission?.[2]?.permission?.[0].write &&
                                    <NavLink to={'/create-order/' + ele._id}>
                                        <MyButton icon={plusIcon} title={'Create Order'} className={'h-7 text-xs w-max'} />
                                    </NavLink>
                                }
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    return (
        <div className='mt-10'>
            {
                leadData !== null &&
                <>
                    <div className='grid grid-cols-3 items-center gap-5'>
                        <div>
                            <div className='flex gap-5'>
                                {
                                    !selectedLeadId &&
                                    <div className='w-full'>
                                        <Title title={'Select Lead'} size={'base'} color={Colors.BLACK} />
                                        <select onChange={(e) => setSelectedLead(e.target.value)} className={selectClass}>
                                            <option value={null}>Select Lead</option>
                                            {
                                                leadData?.content?.map((ele, i) => {
                                                    return (
                                                        <option value={JSON.stringify(ele)}>{ele.leadRefNo}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                }
                                <div className='w-full mt-7'>
                                    {
                                        selectedLead !== null && user?.roleObject?.permission?.[1]?.permission?.[0].write &&
                                        <NavLink to={'/create-quotation/' + JSON.parse(selectedLead)._id}>
                                            <MyButton className={'p-2.5'} title={'Create Quotation'} />
                                        </NavLink>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            }
            {
                selectedLead !== null &&
                <>
                    <div className='mt-5 p-5 bg-white'>
                        <DataTable th={th} td={td} totalPages={QuotationReducer?.doc?.totalPages} api={fetchData} />
                    </div>
                    {
                        showProducts !== null &&
                        <QuotationProductsView onCloseClick={() => setShowProducts(null)} productsArr={QuotationReducer?.doc?.content?.[showProducts]?.products} title={`Quotation Ref No ${QuotationReducer?.doc?.content?.[showProducts]?.quotationRefNo}`} />
                    }
                </>
            }
            {
                quotationPdf !== null &&
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                    <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                    <div className={`relative rounded-lg card w-[60%] p-8 transition-opacity duration-300`} style={{ height: '90vh', overflow: 'scroll' }}>
                        <QuotaionPDF data={quotationPdf} /> :
                    </div>
                </div>
            }
        </div>
    )
}

export default Quotation;