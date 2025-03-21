import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchLead } from '../../Constants/Constants';
import { setLead } from '../../Store/Action/LeadAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { localLeadData } from './localLeadData';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from './LeadProductsView';

function Lead() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const LeadReducer = useSelector(state => state.LeadReducer)

  const dispatch = useDispatch()

  const [showProducts, setShowProducts] = useState(null)

  useEffect(() => {
    if (LeadReducer.doc === null) {
      fetchData()
    }
  }, [])

  const fetchData = () => {
    var json = {
      page: PaginationReducer.pagination.page,
      limit: PaginationReducer.pagination.limit,
      search: {

      }
    }
    ApiHit(json, searchLead).then(res => {
      if (res?.content) {
        dispatch(setLead(res))
      }
    })
  }

  const th = ['Lead Ref No', 'Lead Source', 'Company Name', 'Company Size', 'Industry', 'Customer Name', 'Customer Contact', 'Customer Email', 'Products', 'Action']

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
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.phone || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.email || '-'} /></td>
            <td className='p-2 border text-black'>
              <MyButton onClick={() => setShowProducts(i)} icon={smallEyeIcon} title={'View Products'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='p-2 border text-black'>
              {
                ele.status === 'Active' &&
                <div className='flex gap-2'>
                <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                  {editIcon}
                </div>
                <div className='cursor-pointer' style={{ color: Colors.RED }}>
                  {deleteIcon}
                </div>
              </div>
              }
            </td>
          </tr>
        )
      })
    }
  }

  console.log('LeadReducer', LeadReducer?.doc);


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Lead'} size={'xl'} color={Colors.BLACK} />
          <NavLink to={'/create-lead'}>
            <MyButton title={'Create Lead'} />
          </NavLink>
        </div>
      </div>
      <div className='mt-5 p-5 bg-white'>
        <DataTable th={th} td={td} totalPages={LeadReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showProducts !== null &&
        <LeadProductsView onCloseClick={() => setShowProducts(null)} productsArr={LeadReducer?.doc?.content?.[showProducts]?.products} title={`Lead Ref No ${LeadReducer?.doc?.content?.[showProducts]?.leadRefNo}`} />
      }
    </div>
  )
}

export default Lead;