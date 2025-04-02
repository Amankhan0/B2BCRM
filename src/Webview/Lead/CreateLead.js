import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import MyInput from '../../Component/MyInput';
import MyCheckBox from '../../Component/MyCheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';
import MySelectProduct from '../../Component/MySelectProduct';
import MyButton from '../../Component/MyButton';
import { LeadValidation } from './LeadValidation';
import { ApiHit, ObjIsEmpty, updateProductId } from '../../utils';
import toast from 'react-hot-toast';
import { Active, addLead, searchCustomer, selectClass, updateLead } from '../../Constants/Constants';
import { getAuthenticatedUserWithRoles } from '../../Storage/Storage';

function CreateLead({ edit }) {

  const [decision, setDecision] = useState(false)
  const [customers, setCustomers] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loader, setLoader] = useState(null)

  const ApiReducer = useSelector(state => state.ApiReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!decision && !edit) {
      var oldJson = ApiReducer.apiJson
      oldJson.customerDetails = {
        isDecisionTaker: true
      }
      setDecision(true)
      dispatch(setDataAction(oldJson, SET_API_JSON))
    }
    if (customers === null) {
      fetchData()
    }
    if (edit && selectedCustomer === null && customers !== null) {
      var alreadyCustomer = customers.find(obj => obj.name === ApiReducer?.apiJson?.customerDetails?.name && obj.contact === ApiReducer?.apiJson?.customerDetails?.contact)
      setSelectedCustomer(alreadyCustomer)
    }
  }, [customers, selectedCustomer])

  const onSubmit = () => {
    setLoader(true)
    dispatch(setDataAction({}, SET_API_JSON_ERROR))
    LeadValidation(ApiReducer?.apiJson).then(res => {
      var error = !ObjIsEmpty(res)
      if (error) {
        setLoader(false)
        dispatch(setDataAction(res, SET_API_JSON_ERROR))
      } else {
        if (!ApiReducer?.apiJson?.products) {
          toast.error('Add Products')
          setLoader(false)
        }
        else if (ObjIsEmpty(ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]) || !ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.product_id || !ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.productVarient || !ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.qty || !ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.price || ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.qty === "" || !ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.qty === "0" || ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.price === "" || ApiReducer?.apiJson?.products?.[ApiReducer?.apiJson?.products?.length - 1]?.price === "0") {
          toast.error('Add Products')
          setLoader(false)
        }
        else {
          var json = updateProductId(ApiReducer?.apiJson)
          if (json) {
            json.status = Active
            json.user_id = getAuthenticatedUserWithRoles().userData?._id;
            ApiHit(json, edit ? updateLead : addLead).then(res => {
              setLoader(false)
              if (res.status === 200) {
                toast.success(edit ? 'Lead Updated successfully' : 'Lead created successfully')
                window.location.pathname = '/lead'
              } else {
                toast.error(res.message)
              }
            })
          }
        }
      }
    })
  }

  const fetchData = () => {
    var json = {
      page: 1,
      limit: 10,
      search: {}
    }
    ApiHit(json, searchCustomer).then(res => {
      if (res.content) {
        setCustomers(res.content)
      }
    })
  }

  const onChangeCustomer = (value) => {
    var item = customers.find((ele, i) => ele._id === value)
    var oldJson = ApiReducer.apiJson
    oldJson.customerDetails = {
      ...item,
      billingAddress: item.billingAddresses[0],
      shippingAddress: item.shippingAddresses[0],
      isDecisionTaker: true
    }
    setSelectedCustomer(item)
    dispatch(setDataAction(oldJson, SET_API_JSON))
  }

  return (
    <div className='m-10'>
      <div className='mb-5'>
        <p>Choose Customer if already added</p>
        <div className='grid grid-cols-5'>
          <select onChange={(e) => onChangeCustomer(e.target.value)} className={selectClass}>
            <option selected={selectedCustomer === null}>Select Customer</option>
            {
              customers?.map((ele, i) => {
                return (
                  ele.name !== null && <option selected={ele?.name === selectedCustomer?.name} value={ele._id}>{ele?.companyName} ({ele?.name})</option>
                )
              })
            }
          </select>
        </div>
      </div>
      <div className='bg-white'>
        <div style={{ background: Colors.ThemeBlue }}>
          <p className='text-white p-2'>Company Details</p>
        </div>
        <div className='grid grid-cols-4 gap-4 p-5'>
          <div>
            <MyInput parent={'customerDetails'} name={'leadSource'} title={'Lead Source'} placeholder={'Enter Lead Source'} error={!ApiReducer?.apiJson?.companyDetails?.leadSource} />
          </div>
          <div>
            <MyInput parent={'customerDetails'} name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} error={!ApiReducer?.apiJson?.companyDetails?.companyName} />
          </div>
          <div>
            <MyInput parent={'customerDetails'} name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} error={!ApiReducer?.apiJson?.companyDetails?.companySize} />
          </div>
          <div>
            <MyInput parent={'customerDetails'} name={'industry'} title={'Industry'} placeholder={'Enter Industry'} error={!ApiReducer?.apiJson?.companyDetails?.industry} />
          </div>
        </div>
      </div>
      <div className='bg-white mt-5'>
        <div style={{ background: Colors.ThemeBlue }}>
          <p className='text-white p-2'>Person Details</p>
        </div>
        <div className='grid grid-cols-4 gap-4 p-5'>
          <div>
            <MyInput parent={'customerDetails'} name='name' title={'Full Name'} placeholder={'Enter Full Name'} error={!ApiReducer?.apiJson?.customerDetails?.name} />
          </div>
          <div>
            <MyInput parent={'customerDetails'} name='contact' title={'Contact Number'} placeholder={'Enter Contact Number'} error={!ApiReducer?.apiJson?.customerDetails?.phone} />
          </div>
          <div>
            <MyInput parent={'customerDetails'} name='email' title={'Email Address'} placeholder={'Enter Email Address'} error={!ApiReducer?.apiJson?.customerDetails?.email} />
          </div>
          <div>
            <MyCheckBox parent={'customerDetails'} title={'Is Decision Taker'} name='isDecisionTaker' />
          </div>
        </div>
      </div>
      <div className='bg-white mt-5'>
        <div style={{ background: Colors.ThemeBlue }}>
          <p className='text-white p-2'>Products Details</p>
        </div>
        <MySelectProduct />
      </div>
      <div className='mt-5'>
        <MyButton type={loader && 'loader'} title={'Submit'} onClick={() => onSubmit()} />
      </div>
    </div>
  )
}

export default CreateLead;