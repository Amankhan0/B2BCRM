import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchCustomer, searchLead } from '../../Constants/Constants';
import { setCustomer } from '../../Store/Action/CustomerAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from '../Lead/LeadProductsView';
import CustomerBillingAddressView from './CustomerBillingAddressView';
// import LeadProductsView from './LeadProductsView';

function Customer() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const customerReducer = useSelector(state => state.CustomerReducer)

  const dispatch = useDispatch()

  const [showListInModal, setShowListInModal] = useState(null)

  useLayoutEffect(() => {
    if (customerReducer?.doc === null) {
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
    ApiHit(json, searchCustomer).then(res => {
      if (res?.content) {
        dispatch(setCustomer(res))
      }
    })
  }

  const th = ['Customer Name', 'Email Addresses', 'Contact', 'GST No.', 'Billing Addresses', 'Shipping Addresses', 'Action']

  let td;
  if (customerReducer?.doc !== null) {
    if (customerReducer?.doc?.content?.length !== 0) {
      td = customerReducer?.doc?.content?.map((ele, i) => {
        return (
          <tr>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.name || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.email || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.contact || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.gstNo || '-'} /></td>
            <td className='p-2 border text-black'>
              <MyButton onClick={() => setShowListInModal(i)} icon={smallEyeIcon} title={'View Billing Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.industry || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.name || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.phone || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.customerDetails?.email || '-'} /></td>
            <td className='p-2 border text-black'>
              <div className='flex gap-2'>
                <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }}>
                  {editIcon}
                </div>
                <div className='cursor-pointer' style={{ color: Colors.RED }}>
                  {deleteIcon}
                </div>
              </div>
            </td>
          </tr>
        )
      })
    }
  }

  console.log('customerReducer', customerReducer?.doc?.content[showListInModal || 0]?.billingAddresses, showListInModal);


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Customer'} size={'xl'} color={Colors.BLACK} />
          <NavLink to={'/create-customer'}>
            <MyButton title={'Create Customer'} />
          </NavLink>
        </div>
      </div>
      <div className='mt-5 p-5 bg-white'>
        <DataTable th={th} td={td} totalPages={customerReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showListInModal !== null &&
        <CustomerBillingAddressView onCloseClick={() => setShowListInModal(null)} addressesArr={customerReducer?.doc?.content[showListInModal || 0]?.billingAddresses} />
      }
    </div>
  )
}

export default Customer;