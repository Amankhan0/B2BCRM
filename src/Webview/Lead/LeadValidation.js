export const LeadValidation = (json) => {
    var errorJson = {}
    return new Promise(function (resolve, reject) {
      if (!json.customerDetails||!json.customerDetails.name || json.customerDetails.name === '') {
        Object.assign(errorJson, { name: 'vehicle number is required' })
      }
      if (!json.customerDetails||!json.customerDetails.contact || json.customerDetails.phone === '') {
        Object.assign(errorJson, { contact: 'vehicle number is required' })
      }
      if (!json.customerDetails||!json.customerDetails.email || json.customerDetails.email === '') {
        Object.assign(errorJson, { email: 'vehicle number is required' })
      }
      if (!json.customerDetails || !json.customerDetails.companyName || json.customerDetails.companyName === '') {
        Object.assign(errorJson, { companyName: 'vehicle number is required' })
      }
      if (!json.customerDetails ||!json.customerDetails.industry || json.customerDetails.industry === '') {
        Object.assign(errorJson, { industry: 'vehicle number is required' })
      }
      if (!json.customerDetails ||!json.customerDetails.leadSource || json.customerDetails.leadSource === '') {
        Object.assign(errorJson, { leadSource: 'vehicle number is required' })
      }
      if (!json.customerDetails ||!json.customerDetails.companySize || json.customerDetails.companySize === '') {
        Object.assign(errorJson, { companySize: 'vehicle number is required' })
      }
      resolve(errorJson)
    })
  }