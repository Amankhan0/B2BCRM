import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import DataTable from '../../Component/DataTable';
import { ApiHit } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSupplier, searchCustomer, searchLead, searchSupplier, tableTdClass } from '../../Constants/Constants';
import { setSupplier } from '../../Store/Action/SupplierAction';
import MyButton from '../../Component/MyButton';
import Title from '../../Component/Title';
import { NavLink, useNavigate } from 'react-router-dom';
import { deleteIcon, editIcon, smallEyeIcon } from '../../Icons/Icon';
import SupplierGstAddressView from './SupplierGstAddressView';
import SupplierWarehouseAddressView from './SupplierWarehouseAdddressView';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';
import SupplierBankDetailsView from './SupplierBankDetailsView';
import toast from 'react-hot-toast';

function Customer() {

  const PaginationReducer = useSelector(state => state.PaginationReducer);
  const supplierReducer = useSelector(state => state.SupplierReducer);
  let user = getAuthenticatedUserWithRoles();
  const width = window.innerWidth

  const dispatch = useDispatch()

  const [showGstAddress, setShowGstAddress] = useState(null)
  const [showWarehouseAddress, setShowWarehouseAddress] = useState(null)
  const [showBankDetails, setshowBankDetails] = useState(null);

  const navigate = useNavigate();

  useLayoutEffect(() => {

    if (supplierReducer?.doc === null) {
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
    ApiHit(json, searchSupplier).then(res => {
      if (res?.content) {
        dispatch(setSupplier(res))
      }
    })
  }

  const th = ['Company Name', 'Nature Of Company', 'Company Size', 'Industry', 'Supplier Name', 'Email Address', 'Contact', 'GST No.', 'GST Addresses', 'Warehouse Addresses', 'Bank Details', 'Action']

  let td;
  if (supplierReducer?.doc !== null) {
    if (supplierReducer?.doc?.content?.length !== 0) {
      td = supplierReducer?.doc?.content?.map((ele, i) => {
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
              <MyButton onClick={() => setShowGstAddress(i)} icon={smallEyeIcon} title={'View GST Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='min-w-[90px] p-2 border text-black'>
              <MyButton onClick={() => setShowWarehouseAddress(i)} icon={smallEyeIcon} title={'View Warehouse Addresses'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='w-[50px] p-2 border text-black'>
              <MyButton onClick={() => setshowBankDetails(i)} icon={smallEyeIcon} title={'View Bank Details'} className={'h-7 text-xs w-max'} />
            </td>
            <td className='w-[40px] p-2 border text-black'>
              <div className='flex gap-2'>
                {
                  user?.roleObject?.permission?.[4]?.permission?.[0].write &&
                  <div className='cursor-pointer' style={{ color: Colors.GRADIENTFIRST }} onClick={() => { navigate(`/edit-supplier/${ele?._id}`) }} >
                    {editIcon}
                  </div>
                }
                {
                  user?.roleObject?.roleType === 'superadmin' &&
                  <div onClick={() => onClickDeleteSupplier(ele?._id)} className='cursor-pointer' style={{ color: Colors.RED }}>
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

  const onClickDeleteSupplier = (id) => {
    var confimation = window.confirm('Are you sure to delete supplier')
    if(confimation){
      var json = {
        _id: id
      }
      ApiHit(json, deleteSupplier).then(res => {
        if(res){
          window.location.pathname = '/supplier'
          toast.success(res?.message)
        }
      })
    }
  }


  return (
    <div className='mt-10'>
      <div className='card p-2'>
        <div className='flex justify-between items-center'>
          <Title title={'Supplier'} size={'xl'} color={Colors.BLACK} />
          {
            user?.roleObject?.permission?.[4]?.permission?.[0].write &&
            <NavLink to={'/create-supplier'}>
              <MyButton title={'Create Supplier'} />
            </NavLink>
          }
        </div>
      </div>
      <div style={{ width: width / 1.3 }} className='mt-5 p-5 bg-white overflow-scroll'>
        <DataTable th={th} td={td} totalPages={supplierReducer?.doc?.totalPages} api={fetchData} />
      </div>
      {
        showGstAddress !== null &&
        <SupplierGstAddressView onCloseClick={() => setShowGstAddress(null)} addressesArr={supplierReducer?.doc?.content[showGstAddress || 0]?.gstAddresses} />
      }
      {
        showWarehouseAddress !== null &&
        <SupplierWarehouseAddressView onCloseClick={() => setShowWarehouseAddress(null)} addressesArr={supplierReducer?.doc?.content[showWarehouseAddress || 0]?.warehouseAddresses} />
      }
      {
        showBankDetails !== null &&
        <SupplierBankDetailsView onCloseClick={() => setshowBankDetails(null)} addressesArr={supplierReducer?.doc?.content[showBankDetails || 0]?.bankDetails} />
      }
    </div>
  )
}

export default Customer;