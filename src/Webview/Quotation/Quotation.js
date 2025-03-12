import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchLead, searchQuotation, selectClass } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { deleteIcon, downloadIcon, editIcon, plusIcon, smallEyeIcon } from '../../Icons/Icon';
// import LeadProductsView from './LeadProductsView';
import { QuotationData } from './QuotationData';
import { setQuotation } from '../../Store/Action/QuotationAction';
import QuotationProductsView from './QuotationProductsView';
import { localLeadData } from '../Lead/localLeadData';
import jsPDF from "jspdf";
import "jspdf-autotable";
import QuotaionPDF from '../QuotaionPDF';
import MyInput from '../../Component/MyInput';
import toast from 'react-hot-toast';

function Quotation() {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const QuotationReducer = useSelector(state => state.QuotationReducer)

    const dispatch = useDispatch()

    const [showProducts, setShowProducts] = useState(null)
    const [leadData, setLeadData] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)
    const [quotationPdf, setQuotationPdf] = useState(null)
    const [quotationDate, setQuotationDate] = useState(null)
    const [name, setName] = useState(null)
    const [contact, setContact] = useState(null)



    useEffect(() => {
        if (leadData === null) {
            fetchData()
        } else if (QuotationReducer?.doc === null) {
            fetchQuotationData()
        }
    }, [leadData])

    const fetchData = () => {
        var json = {
            page: 1,
            limit: 100,
            search: {}
        }
        ApiHit(json, searchLead).then(res => {
            if (res?.content) {
                setLeadData(localLeadData)
            }
        })
    }

    const fetchQuotationData = () => {
        dispatch(setQuotation(QuotationData))
        // var json = {
        //     page: PaginationReducer.pagination.page,
        //     limit: PaginationReducer.pagination.limit,
        //     search: {

        //     }
        //   }
        //   ApiHit(json, searchQuotation).then(res => {
        //     if (res?.content) {
        //       dispatch(setQuotation(QuotationData))
        //     }
        //   })
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
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.phone || '-'} /></td>
                        <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.email || '-'} /></td>
                        <td className='p-2 border text-black'>
                            <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
                        </td>
                        <td className='p-2 border text-black'>
                            <div className='flex gap-2'>
                                <div onClick={() => setQuotationPdf(ele)} className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                                    {downloadIcon}
                                </div>
                                <NavLink to={'/create-order'}>
                                    <MyButton icon={plusIcon} title={'Create Order'} className={'h-7 text-xs w-max'} />
                                </NavLink>
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    const onClickNext = () => {
        if (!ApiReducer?.apiJson?.quotationDate || ApiReducer?.apiJson?.quotationDate === '') {
            toast.error('Quotation date is required')
        }
        if (!ApiReducer?.apiJson?.name || ApiReducer?.apiJson?.name === '') {
            toast.error('Name is required')
        }
        if (!ApiReducer?.apiJson?.contact || ApiReducer?.apiJson?.contact === '' || ApiReducer?.apiJson?.contact?.length !== 10) {
            toast.error('Contact is required')
        }
        else {
            setQuotationDate(ApiReducer?.apiJson?.quotationDate)
            setName(ApiReducer?.apiJson?.name)
            setContact(ApiReducer?.apiJson?.contact)
        }
    }

    return (
        <div className='mt-10'>
            {
                leadData !== null &&
                <>
                    <div className='grid grid-cols-3 items-center gap-5'>
                        <div>
                            <Title title={'Select Lead'} size={'base'} color={Colors.BLACK} />
                            <div className='flex gap-5'>
                                <select onChange={(e) => setSelectedLead(e.target.value)} className={selectClass}>
                                    <option value={null}>Select Lead</option>
                                    {
                                        leadData?.content?.map((ele, i) => {
                                            return (
                                                <option value={ele._id}>{ele.leadRefNo}</option>
                                            )
                                        })
                                    }
                                </select>
                                <div className='w-full mt-1'>
                                    {
                                        selectedLead !== null &&
                                        <NavLink to={'/create-quotation/' + selectedLead}>
                                            <MyButton className={'p-2.5'} title={'Create Quotation'} />
                                        </NavLink>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
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

                </>
            }
            {
                quotationPdf !== null &&
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                    <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                    <div className={`relative rounded-lg card w-[60%] p-8 transition-opacity duration-300`} style={{ height: '90vh', overflow: 'scroll' }}>
                        {
                            quotationDate !== null && name !== null && contact !== null ?
                                <QuotaionPDF data={quotationPdf} quotationDate={quotationDate} name={name} contact={contact} /> :
                                <div>
                                    <MyInput important={true} name={'quotationDate'} title={'Quotation Generated Date'} placeholder={'Enter Quotation Generated Date'} />
                                    <p className='my-2 text-gray-400'>Example : Jan 01, 2025</p>
                                    <MyInput important={true} name={'name'} title={'Name'} placeholder={'Enter Name'} />
                                    <div className='mt-5'>
                                        <MyInput important={true} name={'contact'} title={'Contact'} placeholder={'Enter Contact'} />
                                    </div>
                                    <div className='mt-5'>
                                        <MyButton className={'px-5'} onClick={() => onClickNext()} title={'Next'} />
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Quotation;