import * as Yup from 'yup'

export const CustomerValidation = (json) => {
  var errorJson = {}
  return new Promise(function (resolve, reject) {

    console.log('from validation file.');

    if (!json.companyDetails || !json.companyDetails.natureOfCompany || json.companyDetails.natureOfCompany === '') {
      Object.assign(errorJson, { natureOfCompany: 'Nature of company is required' })
    }

    // shippingAddresses

    if (json.shippingAddresses) {
      json.shippingAddresses?.forEach(element => {
        if (!element || !element.address || element.address === '') {

          Object.assign(errorJson, { address: 'address is required' })
        }
        if (!element || !element.country || element.country === '') {
          Object.assign(errorJson, { country: 'country is required' })
        }
        if (!element || !element.city || element.city === '') {
          Object.assign(errorJson, { city: 'city is required' })
        }
        if (!element || !element.state || element.state === '') {
          Object.assign(errorJson, { state: 'state is required' })
        }
        if (!element || !element.landmark || element.landmark === '') {
          Object.assign(errorJson, { landmark: 'landmark is required' })
        }


        // if (!element||!element.pincode || element.pincode === '') {
        //   if(!(element?.pincode?.length > 6 ||  element?.pincode?.length < 6)){

        //     Object.assign(errorJson, { pincode: 'pincode is incorrect' })
        //   }
        //   else if ( Number(element?.pincode)){
        //     Object.assign(errorJson, { pincode: 'pincode should be number' })
        //   }
        //   else{

        //     Object.assign(errorJson, { pincode: 'pincode is required' })
        //   }
        // }

      });
    }

    // billingAddresses

    console.log(json.billingAddresses, 'json.billingAddresses')

    if (json?.billingAddresses) {
      json?.billingAddresses?.forEach(element => {
        console.log(element)
        if (!element || !element?.address || element?.address === '') {

          Object.assign(errorJson, { address: 'address is required' })
        }

        if (!element || !element?.country || element?.country === '') {
          Object.assign(errorJson, { country: 'country is required' })
        }
        if (!element || !element?.city || element?.city === '') {
          Object.assign(errorJson, { city: 'city is required' })
        }
        if (!element || !element?.state || element?.state === '') {
          Object.assign(errorJson, { state: 'state is required' })
        }
        if (!element || !element?.landmark || element?.landmark === '') {
          Object.assign(errorJson, { landmark: 'landmark is required' })
        }
        if (!element || !element?.pincode || element?.pincode === '' || element?.pincode?.length < 6 || element?.pincode?.length > 6 || Number(element?.pincode) !== NaN) {

          console.log('inside pincode')

          Object.assign(errorJson, { pincode: 'pincode is required' })
        }

      });
    }

    // // billingAddresses

    //       if (!json.billingAddresses||!json.billingAddresses.address || json.billingAddresses.address === '') {
    //         Object.assign(errorJson, { address: 'address is required' })
    //       }
    //       if (!json.billingAddresses||!json.billingAddresses.country || json.billingAddresses.country === '') {
    //         Object.assign(errorJson, { country: 'country is required' })
    //       }
    //       if (!json.billingAddresses||!json.billingAddresses.city || json.billingAddresses.city === '') {
    //         Object.assign(errorJson, { city: 'city is required' })
    //       }
    //       if (!json.billingAddresses||!json.billingAddresses.state || json.billingAddresses.state === '') {
    //         Object.assign(errorJson, { state: 'state is required' })
    //       }
    //       if (!json.billingAddresses||!json.billingAddresses.landmark || json.billingAddresses.landmark === '') {
    //         Object.assign(errorJson, { landmark: 'landmark is required' })
    //       }
    //       if (!json.billingAddresses||!json.billingAddresses.pincode || json.billingAddresses.pincode === '') {
    //         Object.assign(errorJson, { pincode: 'pincode is required' })
    //       }

    //customer details

    if (!json.customerDetails || !json.customerDetails.designation || json.customerDetails.designation === '') {
      Object.assign(errorJson, { designation: 'Designation is required' })
    }
    if (!json.customerDetails || !json.customerDetails.name || json.customerDetails.name === '') {
      Object.assign(errorJson, { name: 'Customer Name is required' })
    }
    if (!json.customerDetails || !json.customerDetails.phone || json.customerDetails.phone === '') {
      Object.assign(errorJson, { phone: 'vehicle number is required' })
    }
    if (!json.customerDetails || !json.customerDetails.email || json.customerDetails.email === '') {
      Object.assign(errorJson, { email: 'vehicle number is required' })
    }
    if (!json.companyDetails || !json.companyDetails.companyName || json.customerDetails.companyName === '') {
      Object.assign(errorJson, { companyName: 'vehicle number is required' })
    }
    if (!json.companyDetails || !json.companyDetails.industry || json.companyDetails.industry === '') {
      Object.assign(errorJson, { industry: 'vehicle number is required' })
    }
    // if (!json.companyDetails ||!json.companyDetails.leadSource || json.companyDetails.leadSource === '') {
    //   Object.assign(errorJson, { leadSource: 'vehicle number is required' })
    // }
    if (!json.companyDetails || !json.companyDetails.companySize || json.companyDetails.companySize === '') {
      Object.assign(errorJson, { companySize: 'vehicle number is required' })
    }
    if (!json.companyDetails || !json.pancard || json.pancard === '') {
      Object.assign(errorJson, { pancard: 'vehicle number is required' })
    }
    if (!json.kycDetails || !json.kycDetails.pancardNo || json.kycDetails.pancardNo === '') {
      Object.assign(errorJson, { pancardNo: 'vehicle number is required' })
    }
    if (!json.kycDetails || !json.kycDetails.gstNo || json.kycDetails.gstNo === '') {
      Object.assign(errorJson, { gstNo: 'vehicle number is required' })
    }
    if (!json.companyDetails || !json.gst || json.gst === '') {
      Object.assign(errorJson, { gst: 'vehicle number is required' })
    }
    resolve(errorJson)
  })
}


export const CustomerValidationSchema = Yup.object().shape({
  natureOfCompany: Yup.string().required('Nature of company is required'),
  companyName: Yup.string().required('Company name is required'),
  companySize: Yup.string().required('Company size is required'),
  industry: Yup.string().required('Industry is required'),
  designation: Yup.string().required('Designation is required'),
  name: Yup.string().required('Name is required'),
  leadSource: Yup.string().required('Lead Source is required'),
  contact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact must be 10 digits')
    .required('Contact is required'),
  email: Yup.string()
  .matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Invalid email format'
  )
  .required('Email is required'),
  billingAddresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string().required('Billing address is required'),
      landmark: Yup.string().required('Billing landmark is required'),
      country: Yup.string().required('Billing country is required'),
      state: Yup.string().required('Billing state is required'),
      city: Yup.string().required('Billing city is required'),
      pinCode: Yup.string()
        .required('Billing pincode is required')
        .matches(/^[1-9][0-9]{5}$/, 'Billing pincode must be 6 digits'),
    })
  ).min(1, 'At least one Billing address is required').required('At least one Billing address is required'),
  shippingAddresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string().required('Shipping address is required'),
      landmark: Yup.string().required('Shipping landmark is required'),
      country: Yup.string().required('Shipping country is required'),
      state: Yup.string().required('Shipping state is required'),
      city: Yup.string().required('Shipping city is required'),
      pinCode: Yup.string()
        .required('Shipping pincode is required')
        .matches(/^[1-9][0-9]{5}$/, 'Shipping pincode must be 6 digits'),
    })
  ).min(1, 'At least one Shipping address is required').required('At least one Shipping address is required'),
  pancardNo: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card number format')
    .required('PAN card number is required'),
  gstNo: Yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
    .required('GST number is required'),
  gst: Yup.array().of(
    Yup.object().shape({
      title: Yup.string(),
      url: Yup.string(),
    })).required("GST is required"),
  pancard: Yup.array().of(Yup.object().shape({
    title: Yup.string(),
    url: Yup.string()
  })).required('PAN card required'),
});