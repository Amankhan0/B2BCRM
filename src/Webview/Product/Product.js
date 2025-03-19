import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct } from '../../Constants/Constants';
import { setCustomer } from '../../Store/Action/CustomerAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink } from 'react-router-dom';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from '../Lead/LeadProductsView';
import CustomerBillingAddressView from './CustomerBillingAddressView';
import CustomerShippingAddressView from './CustomerShippingAdddressView';
import { setProduct } from '../../Store/Action/ProductAction';
// import LeadProductsView from './LeadProductsView';

function Product() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const productReducer = useSelector(state => state.ProductReducer)

  const dispatch = useDispatch()

  const [showBillingAddress, setShowBillingAddress] = useState(null)
  const [showShippingAddress, setShowShippingAddress] = useState(null)

  useLayoutEffect(() => {
    if (productReducer?.doc === null) {
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
    ApiHit(json, searchProduct).then(res => {
      if (res?.content) {
        dispatch(setProduct(res))
      }
    })
  }

  const th = ['Customer Name', 'Email Addresses', 'Contact', 'GST No.', 'Billing Addresses', 'Shipping Addresses', 'Action']

  let td;
  if (productReducer?.doc !== null) {
    if (productReducer?.doc?.content?.length !== 0) {
      td = productReducer?.doc?.content?.map((ele, i) => {
        return (
          <tr>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.name || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.email || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.contact || '-'} /></td>
            <td className='p-2 border text-black'><Title size={'xs'} title={ele?.gstNo || '-'} /></td>
            <td className='p-2 border text-black'>
              <MyButton onClick={() => setShowBillingAddress(i)} icon={smallEyeIcon} title={'View Billing Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='p-2 border text-black'>
              <MyButton onClick={() => setShowShippingAddress(i)} icon={smallEyeIcon} title={'View Shipping Addresses'} className={'h-7 text-xs w-max'} />
            </td>
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

  console.log('productReducer', productReducer?.doc?.content[showBillingAddress || 0]?.billingAddresses, showBillingAddress);


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Product'} size={'xl'} color={Colors.BLACK} />
          <NavLink to={'/create-product'}>
            <MyButton title={'Create Product'} />
          </NavLink>
        </div>
      </div>
      <div className='mt-5 p-5 bg-white'>
        <DataTable th={th} td={td} totalPages={productReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showBillingAddress !== null &&
        <CustomerBillingAddressView onCloseClick={() => setShowBillingAddress(null)} addressesArr={productReducer?.doc?.content[showBillingAddress || 0]?.billingAddresses} />
      }
      {
        showShippingAddress !== null &&
        <CustomerShippingAddressView onCloseClick={() => setShowShippingAddress(null)} addressesArr={productReducer?.doc?.content[showShippingAddress || 0]?.shippingAddresses} />
      }
    </div>
  )
}

export default Product;