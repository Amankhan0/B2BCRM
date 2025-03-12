export const LeadValidation = (json) => {
    var errorJson = {}
    return new Promise(function (resolve, reject) {
      if (!json.customerDetails||!json.customerDetails.name || json.customerDetails.name === '') {
        Object.assign(errorJson, { name: 'vehicle number is required' })
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
      if (!json.companyDetails ||!json.companyDetails.leadSource || json.companyDetails.leadSource === '') {
        Object.assign(errorJson, { leadSource: 'vehicle number is required' })
      }
      if (!json.companyDetails ||!json.companyDetails.companySize || json.companyDetails.companySize === '') {
        Object.assign(errorJson, { companySize: 'vehicle number is required' })
      }
      resolve(errorJson)
    })
  }