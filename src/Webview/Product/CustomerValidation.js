export const CustomerValidation = (json) => {
    var errorJson = {}
    return new Promise(function (resolve, reject) {

      console.log('from validation file.');

      if (!json.companyDetails||!json.companyDetails.natureOfCompany || json.companyDetails.natureOfCompany === '') {
        Object.assign(errorJson, { natureOfCompany: 'Nature of company is required' })
      }

      // shippingAddresses

      if (json.shippingAddresses) {
        json.shippingAddresses?.forEach(element => {
          if(!element|| !element.address || element.address === ''){

            Object.assign(errorJson, { address: 'address is required' })
          }
          if (!element||!element.country || element.country === '') {
            Object.assign(errorJson, { country: 'country is required' })
          }
          if (!element||!element.city || element.city === '') {
            Object.assign(errorJson, { city: 'city is required' })
          }
          if (!element||!element.state || element.state === '') {
            Object.assign(errorJson, { state: 'state is required' })
          }
          if (!element||!element.landmark || element.landmark === '') {
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
          if(!element|| !element?.address || element?.address === ''){

            Object.assign(errorJson, { address: 'address is required' })
          }

          if (!element||!element?.country || element?.country === '') {
            Object.assign(errorJson, { country: 'country is required' })
          }
          if (!element||!element?.city || element?.city === '') {
            Object.assign(errorJson, { city: 'city is required' })
          }
          if (!element||!element?.state || element?.state === '') {
            Object.assign(errorJson, { state: 'state is required' })
          }
          if (!element||!element?.landmark || element?.landmark === '') {
            Object.assign(errorJson, { landmark: 'landmark is required' })
          }
          if (!element|| !element?.pincode || element?.pincode === '' || element?.pincode?.length < 6 ||  element?.pincode?.length > 6 || Number(element?.pincode)!==NaN) {
            
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

      if (!json.customerDetails||!json.customerDetails.designation || json.customerDetails.designation === '') {
        Object.assign(errorJson, { designation: 'Designation is required' })
      }
      if (!json.customerDetails||!json.customerDetails.name || json.customerDetails.name === '') {
        Object.assign(errorJson, { name: 'Customer Name is required' })
      }
      if (!json.customerDetails||!json.customerDetails.phone || json.customerDetails.phone === '') {
        Object.assign(errorJson, { phone: 'vehicle number is required' })
      }
      if (!json.customerDetails||!json.customerDetails.email || json.customerDetails.email === '') {
        Object.assign(errorJson, { email: 'vehicle number is required' })
      }
      if (!json.companyDetails || !json.companyDetails.companyName || json.customerDetails.companyName === '') {
        Object.assign(errorJson, { companyName: 'vehicle number is required' })
      }
      if (!json.companyDetails ||!json.companyDetails.industry || json.companyDetails.industry === '') {
        Object.assign(errorJson, { industry: 'vehicle number is required' })
      }
      // if (!json.companyDetails ||!json.companyDetails.leadSource || json.companyDetails.leadSource === '') {
      //   Object.assign(errorJson, { leadSource: 'vehicle number is required' })
      // }
      if (!json.companyDetails ||!json.companyDetails.companySize || json.companyDetails.companySize === '') {
        Object.assign(errorJson, { companySize: 'vehicle number is required' })
      }
      if (!json.companyDetails ||!json.pancard || json.pancard === '') {
        Object.assign(errorJson, { pancard: 'vehicle number is required' })
      }
      if (!json.kycDetails ||!json.kycDetails.pancardNo || json.kycDetails.pancardNo === '') {
        Object.assign(errorJson, { pancardNo: 'vehicle number is required' })
      }
      if (!json.kycDetails ||!json.kycDetails.gstNo || json.kycDetails.gstNo === '') {
        Object.assign(errorJson, { gstNo: 'vehicle number is required' })
      }
      if (!json.companyDetails ||!json.gst || json.gst === '') {
        Object.assign(errorJson, { gst: 'vehicle number is required' })
      }
      resolve(errorJson)
    })
  }