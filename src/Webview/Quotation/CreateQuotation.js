import React, { useEffect, useState } from 'react'
import { Colors } from '../../Colors/color';
import { ApiHit, updateProductId } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Active, addQuotation, QuotationInitiated, searchLead, updateLead } from '../../Constants/Constants';
import MyButton from '../../Component/MyButton';
import MyCheckBox from '../../Component/MyCheckBox';
import MyInput from '../../Component/MyInput';
import MySelectProduct from '../../Component/MySelectProduct';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON } from '../../Store/ActionName/ActionName';
import { CrossMark } from '../../SVG/Icons';
import toast from 'react-hot-toast';
import { getAuthenticatedUser } from '../../Storage/Storage';

function CreateQuotation() {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const [leadData, setLeadData] = useState(null)
    const [loader, serLoader] = useState(false)
    const [privacyPolicy, setPrivacyPolicy] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (leadData === null) {
            fetchData()
        }
    }, [leadData])

    const fetchData = () => {
        var path = window.location.pathname.split('/')[2]
        var json = {
            page: 1,
            limit: 1,
            search: {
                _id: path
            }
        }
        ApiHit(json, searchLead).then(res => {
            if (res?.content) {
                var compileRes = res
                delete compileRes.content[0].leadRefNo
                compileRes.content[0].lead_id = compileRes.content[0]._id
                delete compileRes?.content?.[0]?._id
                console.log('compileRes', compileRes);
                dispatch(setDataAction(compileRes?.content?.[0], SET_API_JSON))
                setLeadData(compileRes)
            }
        })
    }

    console.log('ApiReducer--', ApiReducer);

    const onClickSubmit = () => {
        setPrivacyPolicy(true)
        var oldJson = ApiReducer.apiJson
        oldJson.termsAndConditions = [
            {
                title: 'Price Validity : 5 days from receiving this quotation.',
                status: true
            },
            {
                title: 'GST/IGST : Included in the offer.',
                status: true
            },
            {
                title: 'Delivery : within 7 days from the date of Techno-commercially cleared PO and advance payment.',
                status: true
            },
            {
                title: 'Payment Terms : 60 Days against BG.',
                status: true
            },
            {
                title: 'Price Variation clause will be applicable depending upon the variation in the basic price of raw materials from the period of ordering till the date of delivery.',
                status: true
            },
            {
                title: 'Replacement/short supplied Materials Note : The Material Receipt Note (MRN) with the detail of materials received shall be issued within 24 hours (maximum) of the vehicles reaching your site/stores. No shortage/replacement claim shall be entertained thereafter.',
                status: true
            }
        ]
    }

    const onSubmit = () => {
        serLoader(true)
        var json = updateProductId(ApiReducer?.apiJson)
        json.additionalNotes = 'The delivery schedule offered or committed is merely an indicative time of delivery which is not firm and the same may vary or change depending upon various factors relating to the Contract. Therefore, the Company does not assume any liability in the form of late delivery charges or penalty for having failed to maintain the time schedule.'
        json.status = Active
        json.user_id = getAuthenticatedUser().userId;
        ApiHit(json, addQuotation).then(res => {
            if (res.status === 200) {
                var leadJson = {
                    _id: leadData?.content?.[0]?.lead_id,
                    status: QuotationInitiated
                }
                ApiHit(leadJson, updateLead).then(result => {
                    serLoader(false)
                    if (result.status === 200) {
                        toast.success('Quotation created successfully')
                        window.location.pathname = '/quotation'
                    }
                })
            } else {
                toast.error(res.message)
            }
        })
    }

    const onChangetermsAndConditions = (i) => {
        var oldJson = ApiReducer.apiJson
        if (oldJson.termsAndConditions[i].status) {
            oldJson.termsAndConditions[i].status = false
        } else {
            oldJson.termsAndConditions[i].status = true
        }
        dispatch(setDataAction(oldJson, SET_API_JSON))
    }

    return (
        <div className='mt-10'>
            <div className='bg-white'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Company Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name={'leadSource'} title={'Lead Source'} placeholder={'Enter Lead Source'} />
                    </div>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name={'companyName'} title={'Company Name'} placeholder={'Enter Company Name'} />
                    </div>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name={'companySize'} title={'Company Size'} placeholder={'Enter Company Size'} />
                    </div>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name={'industry'} title={'Industry'} placeholder={'Enter Industry'} />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Person Details</p>
                </div>
                <div className='grid grid-cols-4 gap-4 p-5'>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name='name' title={'Full Name'} placeholder={'Enter Full Name'} />
                    </div>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name='phone' title={'Contact Number'} placeholder={'Enter Contact Number'} />
                    </div>
                    <div>
                        <MyInput disable={true} parent={'customerDetails'} name='email' title={'Email Address'} placeholder={'Enter Email Address'} />
                    </div>
                    <div>
                        <MyCheckBox disable={true} parent={'customerDetails'} title={'Is Decision Taker'} name='isDecisionTaker' />
                    </div>
                </div>
            </div>
            <div className='bg-white mt-5'>
                <div style={{ background: Colors.ThemeBlue }}>
                    <p className='text-white p-2'>Products Details</p>
                </div>
                <MySelectProduct isQuotation={true} />
            </div>
            <div className='mt-5'>
                <MyButton title={'Submit'} onClick={() => onClickSubmit()} />
            </div>
            {
                privacyPolicy &&
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
                    <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
                    <div className={`relative rounded-lg card w-[80%] text-center transition-opacity duration-300`}>
                        <div className="flex justify-between rounded-tl-lg rounded-tr-lg p-2 text-white" style={{ background: Colors.ThemeBlue }} onClick={() => setPrivacyPolicy(false)}>
                            <div>
                                Terms And Conditions
                            </div>
                            <div>
                                {CrossMark}
                            </div>
                        </div>
                        <div className='p-10 text-left'>
                            {
                                ApiReducer?.apiJson?.termsAndConditions?.map((ele, i) => {
                                    return (
                                        <div className='flex gap-2 p-1'>
                                            <div>
                                                <MyCheckBox onChange={() => onChangetermsAndConditions(i)} checked={ele.status} />
                                            </div>
                                            <p className='mt-3 text-black'>{ele.title}</p>
                                        </div>
                                    )
                                })
                            }
                            <div className='mt-5'>
                                <p className='text-black font-bold'>Additional Notes:</p>
                                <p>
                                    The delivery schedule offered or committed is merely an indicative time of delivery which is not firm
                                    and the same may vary or change depending upon various factors relating to the Contract. Therefore, the
                                    Company does not assume any liability in the form of late delivery charges or penalty for having failed to maintain
                                    the time schedule.
                                </p>
                            </div>
                            <div className='mt-10'>
                                <MyButton type={loader&&'loader'} title={'Submit'} onClick={() => onSubmit(true)} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateQuotation;