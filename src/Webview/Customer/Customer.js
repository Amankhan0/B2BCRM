import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer, searchCustomer, tableTdClass } from '../../Constants/Constants';
import { setCustomer } from '../../Store/Action/CustomerAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from '../Lead/LeadProductsView';
import CustomerBillingAddressView from './CustomerBillingAddressView';
import CustomerShippingAddressView from './CustomerShippingAdddressView';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';
import toast from 'react-hot-toast';
import CustomerDocumnets from './CustomerDocumnets';
// import LeadProductsView from './LeadProductsView';

function Customer() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const customerReducer = useSelector(state => state.CustomerReducer)
  let user = getAuthenticatedUserWithRoles();
  const width = window.innerWidth

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const [showBillingAddress, setShowBillingAddress] = useState(null)
  const [showShippingAddress, setShowShippingAddress] = useState(null)
  const [documents, setDocument] = useState(null)

  
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

  const th = ['Company Name', 'Nature Of Company', 'Company Size', 'Industry', 'Customer Name', 'Email Addresses', 'Contact', 'GST No.', 'Billing Addresses', 'Shipping Addresses', 'Documnets','Action']

  let td;
  if (customerReducer?.doc !== null) {
    if (customerReducer?.doc?.content?.length !== 0) {
      td = customerReducer?.doc?.content?.map((ele, i) => {
        return (
          <tr>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.companyName || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.natureOfCompany || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.companySize || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.industry || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.name || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.email || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.contact || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.gstNo || '-'} /></td>
            <td className={tableTdClass}>
              <MyButton onClick={() => setShowBillingAddress(i)} icon={smallEyeIcon} title={'View Billing Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className={tableTdClass}>
              <MyButton onClick={() => setShowShippingAddress(i)} icon={smallEyeIcon} title={'View Shipping Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className={tableTdClass}>
              <MyButton onClick={() => setDocument(i)} icon={smallEyeIcon} title={'View Documnets'} className={'h-7 text-xs w-max'} />
            </td>
            <td className={tableTdClass}>
              <div className='flex gap-2'>
                {
                  user?.roleObject?.permission?.[3]?.permission?.[0].write &&
                  <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }} onClick={() => { navigate(`/edit-customer/${ele?._id}`) }} >
                    {editIcon}
                  </div>
                }
                {
                  user?.roleObject?.roleType === 'superadmin' &&
                  <div onClick={() => onClickDeleteCustomer(ele?._id)} className='cursor-pointer' style={{ color: Colors.RED }}>
                    {deleteIcon}
                  </div>
                }
              </div>
            </td>
          </tr>
        )
      })
    }
  }

  const onClickDeleteCustomer = (id) => {
    var confimation = window.confirm('Are you sure to delete customer')
    if(confimation){
      var json = {
        _id: id
      }
      ApiHit(json, deleteCustomer).then(res => {
        if(res){
          window.location.pathname = '/customer'
          toast.success(res?.message)
        }
      })
    }
  }

  console.log('customerReducer', customerReducer?.doc?.content[showBillingAddress || 0]?.billingAddresses, showBillingAddress);


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Customer'} size={'xl'} color={Colors.BLACK} />
          {
            user?.roleObject?.permission?.[3]?.permission?.[0].write &&
            <NavLink to={'/create-customer'}>
              <MyButton title={'Create Customer'} />
            </NavLink>
          }
        </div>
      </div>
      <div style={{ width: width / 1.3 }} className='mt-5 p-5 bg-white overflow-scroll'>
        <DataTable th={th} td={td} totalPages={customerReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showBillingAddress !== null &&
        <CustomerBillingAddressView onCloseClick={() => setShowBillingAddress(null)} addressesArr={customerReducer?.doc?.content[showBillingAddress || 0]?.billingAddresses} />
      }
      {
        showShippingAddress !== null &&
        <CustomerShippingAddressView onCloseClick={() => setShowShippingAddress(null)} addressesArr={customerReducer?.doc?.content[showShippingAddress || 0]?.shippingAddresses} />
      }
      {
        documents!==null &&
        <CustomerDocumnets onClickClose={()=>setDocument(null)} data={customerReducer?.doc?.content[documents]}/>
      }
    </div>
  )
}

export default Customer;