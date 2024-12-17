
import axios from "axios"
import Bowser from "bowser"
import moment from "moment"
import React from "react"
import { toast } from "react-hot-toast"
import Cookies from "universal-cookie"
import { setDataAction } from "./Store/Action/SetDataAction"
import { SET_INTERNET_SERVICE } from "./Store/ActionName/ActionName"

export const GetPageCount = (limit, page, index) => {
  var no = limit * page - limit + index + 1
  return no
}

export const GetFullYear = (timestamp) => {
  var t = parseInt(timestamp)
  var a = new Date(t);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '-' + month + '-' + year;
  return time;
}

export const GetFullYearWithTime = (timestamp) => {
  var t = parseInt(timestamp)
  var a = new Date(t);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var minute = min<9?'0'+min:min

  var time = date + '-' + month + '-' + year + ' ' + hour + ':' + minute;
  return time;
}

export const GetFullTime = (timestamp) => {
  var t = parseInt(timestamp)
  var a = new Date(t);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = hour + ':' + min;
  return time;
}


export const getFirstDayOfMonth = (monthAbbreviation) => {
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };

  const monthIndex = months[monthAbbreviation];
  const today = new Date();
  const year = today.getFullYear();

  // Creating a new Date object with the first day of the specified month and the current year
  const firstDayOfMonth = new Date(year, monthIndex, 1);

  // Returning the timestamp (in milliseconds) of the first day of the month

  console.log('firstDayOfMonth.getTime()', firstDayOfMonth.getTime());

  return firstDayOfMonth.getTime();
}


export const maskPhone = (value) => {

  console.log({ value });

  var splitData = value.split('')
  value = splitData[0] + 'xxxxxxx' + splitData[8].toString() + splitData[9]
  return value
}


///in dd-mm-yy
export const GetFullDate = (timestamp) => {
  var t = parseInt(timestamp)
  var a = new Date(t);
  var months = ['01', '02', '03', '03', '05', '06', '07', '08', '09', '10', '11', '12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + month + year;
  return time;
}
// getDateForDriverVerify
export const getFullDateForVerifyDriver = (timestamp) => {
  var t = parseInt(timestamp)
  var a = new Date(t);
  var months = ['01', '02', '03', '03', '05', '06', '07', '08', '09', '10', '11', '12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate() > 9 ? a.getDate() : '0' + a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();

  var time = year + '-' + month + '-' + date;
  return time;
}


export const ConvertTime = (value) => {
  var temp = moment(value).utc().format('YYYY-MM-DD')
  var UNIX_timestamp = new Date(temp).getTime()
  return UNIX_timestamp
}

export const RadioButtonClass = 'form-checkbox is-basic size-4 rounded-full border-slate-400/70 checked:bg-success checked:!border-success hover:!border-success focus:!border-success dark:border-navy-400'

export const getFormattedDate = (UNIX_timestamp, types, symbol = '-', timeFormat = '24', monthName = false, includeDay = true) => {
  if (!types || !Array.isArray(types) || types.length === 0) {
    return 'Invalid types';
  }

  UNIX_timestamp = parseInt(UNIX_timestamp);
  var a = new Date(UNIX_timestamp);
  var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var day = includeDay ? days[a.getDay()] + ' ' : '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var month = monthName ? months[a.getMonth()] : ('0' + (a.getMonth() + 1)).slice(-2);
  var year = a.getFullYear();
  var date = a.getDate() > 9 ? a.getDate() : '0' + a.getDate();
  var hour = timeFormat === '12' ? a.getHours() % 12 || 12 : a.getHours(); // Convert to 12-hour format if specified
  var minute = a.getMinutes() > 9 ? a.getMinutes() : '0' + a.getMinutes();
  var second = a.getSeconds();
  var period = timeFormat === '12' ? (a.getHours() < 12 ? 'am' : 'pm') : ''; // Determine AM or PM only in 12-hour format

  let result = '';
  types.forEach((type, index) => {
    if (type === 'day') {
      result += `${day}`;
    } else if (type === 'date') {
      result += `${date}`;
    } else if (type === 'month') {
      result += `${month}`;
    } else if (type === 'year') {
      result += `${year}`;
    } else if (type === 'hour') {
      result += `${hour}`;
    } else if (type === 'minute') {
      if (minute !== '00') {
        result += `${minute}`;
      } else {
        result += '00';
      }
    } else if (type === 'second') {
      result += `${second}`;
    } else if (type === 'period' && period) { // Add period only if it exists
      result += `${period}`; // Include space before period
    } else {
      // Handle invalid type
      result += 'Invalid type';
    }
    // Add the symbol if it's not the last element and there are more elements to concatenate
    if (index !== types.length - 1 && (index !== types.length - 2 || types[index + 1] !== 'period')) {
      result += symbol;
    }
  });

  return result;
}



export const noInterNetConnection = (noInterNet) => {
  return new Promise(function (resolve, reject) {
    console.log('navigator', navigator);

    resolve(true);
  })
}





export function graterThenAndLessThenTimeAccept(firstdate, genratred, validity) {

  const timestampDate = new Date(firstdate);
  const unixTimestamp = timestampDate.getTime();

  if (genratred < unixTimestamp && unixTimestamp < validity) {
    return true
  }
  else {
    return false
  }
}

export function DaysDiffrenceCalculation(inputString) {
  if (/[a-zA-Z]/.test(inputString)) {
    var convert = GetTimeStampFromDateWithAlpha(inputString)
    const dateDifferenceToNow = convert => Math.ceil((convert - Date.now()) / (1000 * 60 * 60 * 24));
    return dateDifferenceToNow(convert)
  }
  else {
    var convert = GetTimeStampFromDateWithoutAlpha(inputString)
    const dateDifferenceToNow = convert => Math.ceil((convert - Date.now()) / (1000 * 60 * 60 * 24));
    return dateDifferenceToNow(convert)
  }
}



export const GetTimeStampFromDateWithAlpha = (value) => {
  const dateParts = value?.split('-');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = monthNames.indexOf(dateParts?.[1]);
  const date = new Date(Date.UTC(dateParts?.[2], monthIndex, dateParts?.[0]));

  // Get the timestamp (in milliseconds)
  const timestamp = date.getTime();
  return timestamp;
}



export const GetTimeStampFromDateWithoutAlpha = (value) => {
  const dateParts = value?.split('-');
  const date = new Date(Date.UTC(dateParts?.[2], dateParts?.[1] - 1, dateParts?.[0]));

  // Get the timestamp (in milliseconds)
  const timestamp = date.getTime();
  return timestamp;
}




export const generateRandomNumber = () => {
  let randomNumber = '';
  for (let i = 0; i < 12; i++) {
    randomNumber += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
  }
  return randomNumber;
}




export const calculateSpeed = (distance, time) => {

  console.log('distance', distance);
  console.log('time', time);

  // Convert time from milliseconds to hours
  const hours = time / (1000 * 60 * 60);
  // Calculate speed in km/h
  const speed = distance / hours;
  return speed.toFixed();
};

export const getEwayBillFromCorrectFormet = (result, setLoader) => {
  return new Promise(function (resolve, reject) {
    if (result.status === 200) {
      if (result?.doc?.code === "200" && result?.doc?.error === 'false') {
        if (result.doc.response[0]?.responseStatus === 'SUCCESS' && result.doc.response[0]?.response) {
          var data = result?.doc?.response[0]?.response
          var splitEwayDate = data?.ewayBillDate?.split(' ')[0]
          var splitEwayDate2 = splitEwayDate.split('/')
          var genratedDate = splitEwayDate2[2] + '-' + splitEwayDate2[1] + '-' + splitEwayDate2[0]

          var splitEwayValidUpto = data?.validUpto?.split(' ')[0]
          var splitEwayValidUpto2 = splitEwayValidUpto.split('/')
          var eWayBillValidity = splitEwayValidUpto2[2] + '-' + splitEwayValidUpto2[1] + '-' + splitEwayValidUpto2[0]

          var json = {
            eWayBillNumber: data?.ewbNo ? data.ewbNo : '',
            hsnCode: data?.hsnCode ? [data.hsnCode] : '',
            sourceLocation: data?.fromPincode ? data.fromPincode : '',
            destinationLocation: data?.toPincode ? data.toPincode : '',
            genratedDate: genratedDate ? new Date(genratedDate).getTime() : Date.now(),
            eWayBillValidity: eWayBillValidity ? new Date(eWayBillValidity).getTime() : Date.now(),
            vehicleNumber: data?.VehiclListDetails?.length > 0 ? data?.VehiclListDetails[0]?.vehicleNo ? data?.VehiclListDetails[0]?.vehicleNo : '' : '',
          }
          resolve(json);
        }
        else {
          if (setLoader) { setLoader(false) }
          toast.error('No data found')
        }
      } else {
        if (setLoader) { setLoader(false) }
        toast.error('No data found')
      }
    }
    else if (result.status === 500) {
      if (setLoader) { setLoader(false) }
      toast.error('No data found')
    }
  })
}






// const google = window.google;

// export const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const dis = R * c; // Distance in kilometers
//   const divideDis = dis / 9.89
//   return divideDis.toFixed();
// }

// function toRadians(degrees) {
//   return degrees;
// }


export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d.toFixed();
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}






export function getDateInMilliseconds(days) {
  // Get the current date in milliseconds
  const currentDate = Date.now();

  // Create a new date object
  const dateObject = new Date(currentDate);

  // Adjust the date by adding or subtracting the specified number of days
  dateObject.setDate(dateObject.getDate() + days);

  // Convert the adjusted date object to milliseconds
  const adjustedDate = dateObject.getTime();

  return adjustedDate;
}



export const TitleValue = ({ title, value }) => {
  return (
    <div className='flex p-1'>
      <p className='text-black'>{title}</p>
      <p className='mx-2'>-</p>
      <p>{value}</p>
    </div>
  )
}








export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const regexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
export const regexVehicle = /^[A-Z|a-z]{2}\s?[0-9]{1,2}\s?[A-Z|a-z]{0,3}\s?[0-9]{4}$/;
export const regexDl = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
export const regexGStno = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;


export const getHeadingFromPathname = () => {

  const pathname = window.location.pathname;
  const segments = pathname.split('/');

  switch (pathname) {

    case "/":
      return "Dashboard"
    case "/dashboard":
      return "Dashboard"
    case "/trip/create":
      return "Create Trip"
    case "/trip/view":
      return "My Trips"
    case "/shared/trip/view":
      return "Shared Trips"
    case "/trips/epod":
      return "ePOD"
    case "/book/empty/vehicle":
      return "Book Your Carrier"
    case "/shortlist/vehicles":
      return "Shortlisted Carrier"
    case "/empty/vehicle/registration":
      return "Register Your Carrier"
    case "/my/empty/vehicles":
      return "My Registered Carrier"
    case "/verify/vehicle":
      return "Verify Your Carrier"
    case "/my/vehicles":
      return "Carrier Dashboard"
    case "/verify/driver":
      return "Verify Your Driver"
    case "/my/drivers":
      return "Driver Dashboard"
    case "/e-challan":
      return "E Challan"
    case "/multimodal/tracking":
      return "Multi Modal Cargo Tracking "
    case "/toll/info":
      return "Toll Plaza"
    case "/ev/station":
      return "EV Charging Sattions"
    case "/bid/live":
      return "Live Bid"
    case "/bid/my":
      return "My Bid"
    case "/bid/dashboard":
      return "Bid Dashboard"
      case "/bid/create":
        return "Create Bid"
      case "/group/create":
      return "Group Dashboard"
    // /trip/create

  }

}

export const stateOptions = [
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chandigarh-ut', label: 'Chandigarh (UT)' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'dadra-nagar-haveli-ut', label: 'Dadra and Nagar Haveli (UT)' },
  { value: 'daman-diu-ut', label: 'Daman and Diu (UT)' },
  { value: 'delhi-nct', label: 'Delhi (NCT)' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { value: 'jammu-kashmir', label: 'Jammu and Kashmir' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'lakshadweep-ut', label: 'Lakshadweep (UT)' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'puducherry-ut', label: 'Puducherry (UT)' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { value: 'west-bengal', label: 'West Bengal' },
];



export const decodeGeometery = (encoded) => {

  console.log({ encoded })

  var points = [],
    index = 0,
    len = encoded?.length;
  var lat = 0,
    lng = 0;
  while (index < len) {
    var b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
};

const fetchPublicIPv4Address = async () => {
  const ipServices = [
    'https://api.ipify.org?format=json',
    'https://ifconfig.co/ip',
    'https://bot.whatismyipaddress.com'
  ];

  let ip = null;

  for (const service of ipServices) {
    try {
      const response = await axios.get(service);
      ip = response?.data?.ip;
      break; // Stop trying further services if successful
    } catch (error) {
      console.error('Error fetching public IP from', error);
    }
  }
  return ip;
};


export const ApiHit = (json, api, token, cookie, dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkInternet = await noInterNetConnection();
      const cookies = new Cookies();
      const cookieValue = cookies.get('jwt');
      const userAgent = navigator.userAgent;
      const browser = Bowser.getParser(userAgent);
      let browserName = browser?.getBrowser()
      let os = browser?.getOS()
      let platformType = browser?.getPlatformType()
      let ipv4 = await fetchPublicIPv4Address()

      if (!checkInternet) {
        if (dispatch) {
          dispatch(setDataAction(true, SET_INTERNET_SERVICE));
        }
        reject('No internet connection');
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'cookies': cookieValue ? cookieValue : "",
          'ipv4': ipv4,
          "browserName": browserName?.name,
          "OS": os?.name,
          "platformType": platformType

        },
        body: JSON.stringify(json),
      };

      const response = await fetch(api, requestOptions);
      const result = await response.json();

      if (result?.message === "Missing token") {
        cookies.remove();
        cookies.remove("jwt", { path: "/" });
        localStorage.removeItem("trackYourTransportUser");
        window.location.href = '/login';
        resolve('Missing token');
      }
      else if (result?.message === "jwt expired") {
        cookies.remove();
        cookies.remove("jwt", { path: "/" });
        localStorage.removeItem("trackYourTransportUser");
        window.location.reload();
        window.location.href = '/login';
        resolve('JWT expired');
      }
      else if (result?.message === "Prohibited") {
        cookies.remove();
        cookies.remove("jwt", { path: "/" });
        localStorage.removeItem("trackYourTransportUser");
        window.location.reload();
        window.location.href = '/login';
        resolve('Prohibited');
      }
      else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
};




export const finalCreateJson = (data, user) => {
  return new Promise(function (resolve, reject) {
      var createTripFinalJson = {
          "eWayBillDetails": [
              {
                  "eWayBillNumber": data?.apiJson?.eWayBillNumber ? data?.apiJson?.eWayBillNumber : '',
                  "tripReferenceNumber": data?.apiJson?.tripReferenceNumber ? data?.apiJson?.tripReferenceNumber : '',
                  "genratedDate": data?.apiJson?.genratedDate ? data?.apiJson?.genratedDate : '',
                  "eWayBillValidity": data?.apiJson?.eWayBillValidity ? data?.apiJson?.eWayBillValidity : '',
                  "invoiceNumber": data?.apiJson?.invoiceNumber ? data?.apiJson?.invoiceNumber : '',
                  "hsnCode": data?.apiJson?.hsnCode ? data?.apiJson?.hsnCode : '',
                  "totalTaxabaleAmount": data?.apiJson?.totalTaxabaleAmount ? data?.apiJson?.totalTaxabaleAmount : ''
              }
          ],
          "traderDetils": [
              {
                  "traderName": data?.apiJson?.traderName ? data?.apiJson?.traderName : '',
                  "traderPan": data?.apiJson?.traderPan ? data?.apiJson?.traderPan : '',
                  "traderContact": data?.apiJson?.traderContact ? data?.apiJson?.traderContact : '',
                  "traderEmail": data?.apiJson?.traderEmail ? data?.apiJson?.traderEmail : '',
                  "alternativeContact": data?.apiJson?.alternativeContact ? data?.apiJson?.alternativeContact : '',
                  "alternativeEmail": data?.apiJson?.alternativeEmail ? data?.apiJson?.alternativeEmail : '',
              }
          ],
          "transporterDetails": [
              {
                  "transporterName": data?.apiJson?.transporterName ? data?.apiJson?.transporterName : '',
                  "transporterPan": data?.apiJson?.transporterPan ? data?.apiJson?.transporterPan : '',
                  "transporterContact": data?.apiJson?.transporterContact ? data?.apiJson?.transporterContact : '',
                  "transporterEmail": data?.apiJson?.transporterEmail ? data?.apiJson?.transporterEmail : '',
                  "alternativeContact": data?.apiJson?.alternativeContact ? data?.apiJson?.alternativeContact : '',
                  "alternativeEmail": data?.apiJson?.alternativeEmail ? data?.apiJson?.alternativeEmail : '',
              }
          ],
          "locationDetails": [
              {
                  "sourceLocation": data?.apiJson?.sourceLocation ? data?.apiJson?.sourceLocation : '',
                  "destinationLocation": data?.apiJson?.destinationLocation ? data?.apiJson?.destinationLocation : '',
                  "distance": data?.apiJson?.distance ? data?.apiJson?.distance : ''
              }
          ],
          "geometry": data?.apiJson?.tollGuruGeo ? data?.apiJson?.tollGuruGeo : '',

          "driverDetails": [{driverName:data?.apiJson?.driverName,driverContact:data?.apiJson?.driverContact,vehicleNumber:data?.apiJson?.vehicleNumber,vehicleType:data?.apiJson?.vehicleType}],

          "epod": data?.createTripJson?.epod[0],

          // "user_id": user.userData.doc._id,

          "status": {
              msg: 'Trip Added',
              value: 'Running',
              timestamp: Date.now()
          }
      }
      resolve(createTripFinalJson)
  })
}