import { checkEway } from "../Constants/Constants"
import { ApiHit, regexEmail, regexPAN, regexVehicle } from "../utils"

export const CheckValidationEwayBillDetails = (json,tripBy) => {

  var errorJson = {}

  console.log('json', json);

  return new Promise(function (resolve, reject) {
    if(tripBy === 'withoutEway'){
      if (!json.tripReferenceNumber || json.tripReferenceNumber === '') {
        Object.assign(errorJson, { tripReferenceNumber: 'trip reference number is required' })
      }
    }
    else if(tripBy !== 'withoutEway'){
      if (!json.eWayBillNumber || json.eWayBillNumber === '') {
        Object.assign(errorJson, { eWayBillNumber: 'ewaybill number is required' })
      }
    }
    else {

      let checkjson

      if(tripBy === 'withoutEway'){
        checkjson = {
          'eWayBillNumber': json.tripReferenceNumber
        }
      }
      else{
        checkjson = {
          'eWayBillNumber': json.eWayBillNumber
        }
      }

      ApiHit(checkjson, checkEway).then(res => {

        console.log('res-----', res);

        if (res.status === 200) {
          Object.assign(errorJson, { eWayBillNumber: 'ewaybill number already use' })
        }
      })
    }
    if (!json.eWayBillValidity || json.eWayBillValidity === '') {
      Object.assign(errorJson, { eWayBillValidity: 'ewaybillvalidity is required' })
    }
    else if (json.eWayBillValidity < json.genratedDate) {
      Object.assign(errorJson, { eWayBillValidity: 'validity date is always greater than genrated date' })
    }
    if (!json.genratedDate || json.genratedDate === '') {
      Object.assign(errorJson, { genratedDate: 'genrated date is required' })
    }
    // if (!json.hsnCode || json.hsnCode.length === 0) {
    //   Object.assign(errorJson, { hsnCode: 'hsn code is required' })
    // }

    
    // if (!json.invoiceNumber || json.invoiceNumber === '') {
    //   Object.assign(errorJson, { invoiceNumber: 'invoice number is required' })
    // }
    // if (!json.totalTaxabaleAmount || json.totalTaxabaleAmount === '') {
    //   Object.assign(errorJson, { totalTaxabaleAmount: 'totaltaxable amt is required' })
    // }
    resolve(errorJson)
  })
}

export const CheckDriverValidationDetails = (json) => {

  var errorJson = {}

  return new Promise(function (resolve, reject) {
    if (!json.vehicleNumber || json.vehicleNumber === '') {
      Object.assign(errorJson, { errorvehicleNumber: 'vehicle number is required' })
    }
    else if (!regexVehicle.test(json.vehicleNumber)) {
      Object.assign(errorJson, { errorvehicleNumber: 'invalid vehicle number' })
    }
    // if (!json.driverName || json.driverName === '') {
    //   Object.assign(errorJson, { errordriverName: 'driver name is required' })
    // }
    // if (!json.driverContact || json.driverContact === '' || json.driverContact.length !== 10) {
    //   Object.assign(errorJson, { errordriverContact: 'driver contact is required' })
    // }
    // if (json.driverConsent === 'refresh') {
    //   Object.assign(errorJson, { errordriverConsent: 'refresh' })
    //   toast.error('Driver consent not verified')
    // }
    resolve(errorJson)
  })
}

export const CheckClientValidation = (json, userType) => {

  var errorJson = {}

  return new Promise(function (resolve, reject) {

    if (userType === 'Transporter') {
      if (!json.transporterName || json.transporterName === '') {
        Object.assign(errorJson, { transporterName: 'transporter name is required' })
      }
      if (!json.transporterPan || json.transporterPan === '') {
        Object.assign(errorJson, { transporterPan: 'transporter pan is required' })
      }
      else if (!regexPAN.test(json.transporterPan)) {
        Object.assign(errorJson, { transporterPan: 'pan is invalid' })
      }
      if (!json.transporterContact || json.transporterContact === '' || json.transporterContact.length !== 10) {
        Object.assign(errorJson, { transporterContact: 'transporter contact is required' })
      }
      if (!json.transporterEmail || json.transporterEmail === '') {
        Object.assign(errorJson, { transporterEmail: 'transporter email is required' })
      }
      else if (!regexEmail.test(json.transporterEmail)) {
        Object.assign(errorJson, { transporterEmail: 'transporter email is invalid' })
      }
    }
    else {
      if (!json.traderName || json.traderName === '') {
        Object.assign(errorJson, { traderName: 'trader name is required' })
      }
      if (!json.traderPan || json.traderPan === '') {
        Object.assign(errorJson, { traderPan: 'trader pan is required' })
      }
      else if (!regexPAN.test(json.traderPan)) {
        Object.assign(errorJson, { traderPan: 'pan is invalid' })
      }
      if (!json.traderContact || json.traderContact === '' || json.traderContact.length !== 10) {
        Object.assign(errorJson, { traderContact: 'trader contact is required' })
      }
      if (!json.traderEmail || json.traderEmail === '') {
        Object.assign(errorJson, { traderEmail: 'trader email is required' })
      }
      else if (!regexEmail.test(json.traderEmail)) {
        Object.assign(errorJson, { traderEmail: 'trader email is invalid' })
      }
    }


    resolve(errorJson)
  })
}



export const CheckEPODValidationDetails = (json) => {

  var errorJson = {}

  return new Promise(function (resolve, reject) {

    if (json?.epod?.[0]?.receiverName || json?.epod?.[0]?.receiverContact) {
      if (json?.epod?.[0]?.receiverName === '' && json?.epod?.[0]?.receiverContact !== '') {
        Object.assign(errorJson, { receiverName: 'receiver name is required' })
      }
      if (json?.epod?.[0]?.receiverName !== '') {
        if (json?.epod?.[0]?.receiverContact?.length !== 10) {
          Object.assign(errorJson, { receiverContact: 'receiver contact is required' })
        }
      }
    }

    resolve(errorJson)
  })
}

export const CheckLocationValidation = (json) => {

  var errorJson = {}

  return new Promise(function (resolve, reject) {
    if (!json.sourceLocation || !Object.keys(json.sourceLocation).length) {
      Object.assign(errorJson, { sourceLocation: 'source location is required' })
    }
    if (!json.destinationLocation || !Object.keys(json.destinationLocation).length) {
      Object.assign(errorJson, { destinationLocation: 'destination location is required' })
    }
    resolve(errorJson)
  })
}


