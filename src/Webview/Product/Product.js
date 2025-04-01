import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct, tableTdClass } from '../../Constants/Constants';
import { setCustomer } from '../../Store/Action/CustomerAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink, useNavigate } from 'react-router-dom';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import LeadProductsView from '../Lead/LeadProductsView';
import CustomerShippingAddressView from './CustomerShippingAdddressView';
import { setProduct } from '../../Store/Action/ProductAction';
import ProductVarientsView from './ProductVarientsView';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';
// import LeadProductsView from './LeadProductsView';

function Product() {

  const PaginationReducer = useSelector(state => state.PaginationReducer)
  const productReducer = useSelector(state => state.ProductReducer)
  let user = getAuthenticatedUserWithRoles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const width = window.innerWidth

  const [showVarients, setShowVarients] = useState(null)
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

  const th = ['Product Name', 'Make', 'HSN No.', 'Varients', 'Action']

  let td;
  if (productReducer?.doc !== null) {
    if (productReducer?.doc?.content?.length !== 0) {
      td = productReducer?.doc?.content?.map((ele, i) => {
        return (
          <tr>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.productName || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.make || '-'} /></td>
            <td className={tableTdClass}><Title size={'xs'} title={ele?.hsnNo || '-'} /></td>
            <td className={tableTdClass}>
              <MyButton onClick={() => setShowVarients(i)} icon={smallEyeIcon} title={'View Varients'} className={'h-7 text-xs w-max'} />
            </td>
            <td className={tableTdClass}>
              <div className='flex gap-2'>
                {
                  user?.roleObject?.permission?.[5]?.permission?.[0].write &&
                  <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }} onClick={() => { navigate(`/edit-product/${ele?._id}`) }} >
                  {editIcon}
                </div>
                }
                
                {/* <div className='cursor-pointer' style={{ color: Colors.RED }}>
                  {deleteIcon}
                </div> */}
              </div>
            </td>
          </tr>
        )
      })
    }
  }

  // console.log('productReducer', productReducer?.doc?.content[showVarients || 0]?.billingAddresses, showVarients);


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Product'} size={'xl'} color={Colors.BLACK} />
          {
            user?.roleObject?.permission?.[5]?.permission?.[0].write &&
            <NavLink to={'/create-product'}>
              <MyButton title={'Create Product'} />
            </NavLink>
          }

        </div>
      </div>
      <div style={{ width: width / 1.3 }} className='mt-5 p-5 bg-white overflow-scroll'>
        <DataTable th={th} td={td} totalPages={productReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showVarients !== null &&
        <ProductVarientsView onCloseClick={() => setShowVarients(null)} addressesArr={productReducer?.doc?.content[showVarients || 0]?.varients} />
      }
    </div>
  )
}

export default Product;