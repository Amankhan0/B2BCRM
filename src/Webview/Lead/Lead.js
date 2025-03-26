import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchLead, updateLead } from '../../Constants/Constants';
import { setLead } from '../../Store/Action/LeadAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { localLeadData } from './localLeadData';
import { crossIcon, deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from './LeadProductsView';
import Quotation from '../Quotation/Quotation';
import { setQuotation } from '../../Store/Action/QuotationAction';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';
import toast from 'react-hot-toast';

function Lead() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const LeadReducer = useSelector(state => state.LeadReducer)

  const dispatch = useDispatch()

  const [showProducts, setShowProducts] = useState(null)
  const [quotationModal, setQuotationModal] = useState(null)
  let user = getAuthenticatedUserWithRoles();

  useEffect(() => {
    if (LeadReducer.doc === null) {
      fetchData()
    }
  }, [LeadReducer])

  const fetchData = () => {
    var json = {
      page: PaginationReducer.pagination.page,
      limit: PaginationReducer.pagination.limit,
      search: {
        "user_id": user?.userData?._id,
      }
    }
    ApiHit(json, searchLead).then(res => {
      if (res?.content) {
        dispatch(setLead(res))
      }
    })
  }

  const th = ['Lead Ref No', 'Lead Source', 'Company Name', 'Company Size', 'Industry', 'Customer Name', 'Customer Contact', 'Customer Email', 'Status', 'Products', 'Action']

  let td;
  if (LeadReducer.doc !== null) {
    if (LeadReducer.doc.content.length !== 0) {
      td = LeadReducer.doc.content.map((ele, i) => {
        return (
          <tr>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.leadRefNo || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.companyName || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.companySize || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.leadSource || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.industry || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.name || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.contact || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.email || '-'} /></td>
            <td className='p-2 border text-black'>
              <div className='rounded-md p-1.5' style={{ background: ele?.status === 'InActive' ? Colors.RED : Colors.lightgreen }}>
                <Title size={'xs'} title={ele?.status || '-'} />
              </div>
            </td>
            <td className='p-2 border text-black'>
              <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='h-12 p-3 border text-black flex gap-2 items-center'>
              {
                ele?.status !== "InActive" &&
                <>
                  <p className='cursor-pointer hover:underline' onClick={() => setQuotationModal(JSON.stringify(ele))} style={{ color: Colors.ThemeBlue }}>View Quotation</p>
                  {
                    ele.status === 'Active' &&
                    <div className='flex gap-2'>
                      <NavLink to={'/editlead/' + ele?._id} className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                        {editIcon}
                      </NavLink>
                      <div onClick={() => deleteLead(ele?._id)} className='cursor-pointer' style={{ color: Colors.RED }}>
                        {deleteIcon}
                      </div>
                    </div>
                  }
                </>
              }
            </td>
          </tr>
        )
      })
    }
  }

  const deleteLead = (id) => {
    var confirmation = window.confirm('Are you sure to delete this lead')
    if (confirmation) {
      var json = {
        _id: id,
        status: 'InActive'
      }
      ApiHit(json, updateLead).then(res => {
        if (res?.status === 200) {
          toast.success('lead delete successfully')
          dispatch(setLead(null))
        }
      })
    }
  }

  const onCrossQuotaiotn = () => {
    console.log('call');

    dispatch(setQuotation(null))
    setQuotationModal(null)
  }

  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Lead'} size={'xl'} color={Colors.BLACK} />
          {
            user?.roleObject?.permission?.[0]?.permission?.[0].write &&
            <NavLink to={'/create-lead'}>
              <MyButton title={'Create Lead'} />
            </NavLink>
          }
        </div>
      </div>
      <div className='mt-5 p-5 bg-white'>
        <DataTable th={th} td={td} totalPages={LeadReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showProducts !== null &&
        <LeadProductsView onCloseClick={() => setShowProducts(null)} productsArr={LeadReducer?.doc?.content?.[showProducts]?.products} title={`Lead Ref No ${LeadReducer?.doc?.content?.[showProducts]?.leadRefNo}`} />
      }
      {
        quotationModal !== null &&
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden`} role="dialog">
          <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
          <div className={`relative rounded-lg card w-[80%] transition-opacity duration-300`} style={{ height: '90vh', overflow: 'scroll' }}>
            <div className='flex justify-between text-white p-2 items-center' style={{ background: Colors.ThemeBlue }}>
              <Title title={'Quotation'} size={'lg'} />
              <i className='cursor-pointer' onClick={() => onCrossQuotaiotn()}>{crossIcon}</i>
            </div>
            <div className='p-5 overflow-scroll'>
              <Quotation selectedLeadId={quotationModal} />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Lead;