// *************** VERCEL *******************************


// *************** TYT *******************************
// export const BaseUrl = "https://api.trackyourtransport.in/api/"
// export const BaseUrl2 = "https://api.trackyourtransport.in/"

// *************** Local *******************************
// export const BaseUrl = 'http://192.168.1.33:3001/api/'
// export const BaseUrl2 = "http://192.168.1.33:3001/"




// *************** TYT *******************************
// export const BaseUrl = "https://api.trackyourtransport.in/api/"
// export const BaseUrl2 = "https://api.trackyourtransport.in/"

// *************** Local *******************************
export const BaseUrl = 'http://192.168.1.17:8001/api/'
export const BaseUrl2 = "http://192.168.1.17:8001/"

// export const BaseUrl = 'http://192.168.1.32:8000/api/'
// export const BaseUrl2 = "http://192.168.1.32:8000/"

let USER = 'user/'
export const login = BaseUrl + USER+'login'
export const verifyUser = BaseUrl + USER +'verifyUser'
export const changePassword = BaseUrl + USER +'changePassword'


export const GetMaintenance = BaseUrl + 'GetMaintenance'
export const LoginApi = BaseUrl + 'Login'
export const Register = BaseUrl + 'Register'
export const GetUser = BaseUrl + 'GetUser'
export const otpLogin = BaseUrl + 'otpLogin'
export const otpRegister = BaseUrl + 'otpRegister'
export const UserUpdate = BaseUrl + 'UserUpdate'
export const forgotPasswordOTP = BaseUrl + 'forgotPasswordOTP'
export const GetSubscriptionRoutes = BaseUrl + 'GetSubscriptionRoutes'
export const GetSubscribed = BaseUrl + 'GetSubscribed'
export const GenerateQR = BaseUrl + "/generateQR"
export const verifyConsent = BaseUrl + 'verifyConsent'
export const ULIPApiHandler = BaseUrl + 'ULIPApiHandler'
export const CreateTrip = BaseUrl + 'CreateTrip'
export const checkEway = BaseUrl + 'checkEway'
export const getTrip = BaseUrl + 'getTrip'
export const UpdateTrip = BaseUrl + 'UpdateTrip'
export const getAccessTokenMM = BaseUrl + 'getAccessTokenMM'
export const AddUserToSubscription = BaseUrl + 'AddUserToSubscription'
export const getHTTPNotifications = BaseUrl + 'getHTTPNotifications'
export const createContactInfo = BaseUrl + 'createContactInfo'
export const verifyEPODToken = BaseUrl + "tokenVerify"
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ULIP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const ACMES01 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ACMES/01'
export const ACMES02 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ACMES/02'
export const KALE01 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/KALE/01'
export const KALE02 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/KALE/02'
export const AAICLAS01 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/AAICLAS/01'
export const AAICLAS02 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/AAICLAS/02'
export const FOIS01 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/FOIS/01'
export const FASTAG = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/FASTAG/01'
export const LDB = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/LDB/01'
export const ICEGATE05 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ICEGATE/05'
export const ICEGATE06 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ICEGATE/06'
export const ICEGATE02 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ICEGATE/02'
export const ICEGATE03 = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ICEGATE/03'
export const VERIFYVEHICLE = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/VAHAN/01'
export const VERIFYDRIVER = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/SARATHI/01'
export const EChallan = 'https://www.ulip.dpiit.gov.in/ulip/v1.0.0/ECHALLAN/01'

export const initiateTrip = BaseUrl + 'initiateTrip'

export const AddDriver = BaseUrl + 'AddDriver'
export const AddVehicle = BaseUrl + 'AddVehicle'
export const getDriver = BaseUrl + 'getDriver'
export const getVehicles = BaseUrl + 'getVehicles'
export const VehicleRemove = BaseUrl + 'VehicleRemove'
export const DriverRemove = BaseUrl + 'DriverRemove'
export const RefreshDriverDetails = BaseUrl + 'RefreshDriverDetails'
export const RefreshVehicleDetails = BaseUrl + 'RefreshVehicleDetails'

export const BulkUpload = BaseUrl + 'BulkUpload'
export const CheckVehicleInDB = BaseUrl + 'CheckVehicleInDB'

export const endTripConsent = BaseUrl + 'endTripConsent'

export const createEmptyVehicle = BaseUrl + 'createEmptyVehicle'
export const GetEmptyVehicle = BaseUrl + 'GetEmptyVehicle'
export const RemoveEmptyVehicle = BaseUrl + 'RemoveEmptyVehicle'

export const GetGeoNearLocation = BaseUrl + 'GetGeoNearLocation'
export const AddShortlist = BaseUrl + 'AddShortlist'
export const RemoveShortlist = BaseUrl + 'RemoveShortlist'
export const getShortlist = BaseUrl + 'getShortlist'

export const shareTrip = BaseUrl + 'shareTrip'
export const statusUpdate = BaseUrl + 'statusUpdate'

export const epodOtp = BaseUrl + 'epodOtp'
export const numberVerification = BaseUrl + 'numberVerification'

export const driversDataByDate = BaseUrl + 'drivers/date-info'
export const GetTransaction = BaseUrl + 'GetTransaction'

export const countData = BaseUrl + 'countData'

export const GetTripWithGeo = BaseUrl + 'GetTripWithGeo'

export const getTollGuru = BaseUrl + "getTollGuru"
export const fetchTollGuruDB = BaseUrl + "fetchTollGuruDB"
export const fetchSimLocation = BaseUrl + "fetchSimLocation"

export const getEVStation = BaseUrl + "getEVStation"

export const saveTripDocument = BaseUrl + "saveTripDocument"
export const getTripDocument = BaseUrl + "getTripDocument"

export const RefreshMultiVehicleAndDriverDetails = BaseUrl + "RefreshMultiVehicleAndDriverDetails"
export const multipleRemove = BaseUrl + "multipleRemove"
export const getSyncedDevices = BaseUrl + "getSyncDevices"

export const logoutSyncDevices = BaseUrl + "logoutSyncDevices"

export const Logout = BaseUrl + "logout"

export const smsEmailVerification = BaseUrl + "sms-email/Verification"
export const webhook = BaseUrl + "/webhook/simData"
export const ownFirebase = BaseUrl2 + "upload"

export const searchTrip = BaseUrl + "searchTransporter"
export const triggerService = BaseUrl + "triggerService"

export const createGroup = BaseUrl + "createGroup"
export const getGroup = BaseUrl + "getGroup"
export const deleteGroup = BaseUrl + "deleteGroup"
export const updateGroup = BaseUrl + "updateGroup"

export const createBid = BaseUrl + "createBid"
export const updateBid = BaseUrl + "updateBid"
export const getBid = BaseUrl + "getBid"
export const retrieveLiveBid = BaseUrl + "retrieveLiveBid"
export const bidAgainstAmount = BaseUrl + "bidAgainstAmount"
export const getbidAgainstAmount = BaseUrl + "getbidAgainstAmount"
export const updateBidAgainstAmount = BaseUrl + "updateBidAgainstAmount"

export const messages = BaseUrl + "messages"
export const getMessages = BaseUrl + "getMessages"




// // // Headsup Api
// export const headSupBase = "https://tyt.headsupcorporation.com/api/"
// export const headSupBase2 = 'https://tyt.headsupcorporation.com/'

// // export const headSupBase = "http://192.168.1.5:3006/api/"
// // export const headSupBase2 = "http://192.168.1.5:3006/"

// // Base Api7
// export const getUsers = headSupBase + 'getUsers'
// export const verifyPassword = headSupBase + 'verifyOldPassword'
// export const changePasswordApp = headSupBase + 'changePasswordAPP'
// export const LoginApi = headSupBase + 'Login'
// export const Register = headSupBase + 'Register'
// export const AddTrip = headSupBase + 'AddTrip'
// export const getTrips = headSupBase + 'getTrips'
// export const TripUpdate = headSupBase + 'TripUpdate'
// export const TripRemove = headSupBase + 'TripRemove'
// export const UserUpdate = headSupBase + 'UserUpdate'
// export const AddDriver = headSupBase + 'AddDriver'
// export const getDriver = headSupBase + 'getDriver'
// export const DriverRemove = headSupBase + 'DriverRemove'
// export const DriverUpdate = headSupBase + 'DriverUpdate'

// export const AddVehicle = headSupBase + 'AddVehicle'
// export const getVehicles = headSupBase + 'getVehicles'
// export const VehicleRemove = headSupBase + 'VehicleRemove'
// export const VehicleUpdate = headSupBase + 'VehicleUpdate'

// export const DriverAutoComplete = headSupBase + 'DriverAutoComplete'
// export const VehicleAutoComplete = headSupBase + 'VehicleAutoComplete'

// export const BulkUpload = headSupBase2 + 'BulkUpload'

// export const pdftojsonUpload = headSupBase2 + 'pdftojsonUpload'

// export const AddRemoveWishlist = headSupBase + 'AddRemoveWishlist'
// export const getWishlists = headSupBase + 'getWishlists'
// export const RemoveWishlist = headSupBase + 'WishlistRemove'
// export const changePassword = headSupBase + 'changePassword'
// export const checkPAN = headSupBase + 'checkPAN'

// export const VehicleRemoveMulti = headSupBase + 'multipleRemove'
// export const RefreshMultiVehicleDetails = headSupBase + 'RefreshMultiVehicleDetails'

// export const getEwayBill = headSupBase + 'getEwayBill'

// Map Headsup Api

// export const MapToken = headSupBase + 'getTokenMMI'

// export const GeocodeSerachMMI = headSupBase + 'GeocodeSerachMMI'
// export const DrivingRoutes = headSupBase + 'DrivingRoutes'
// export const getTollPlaza = headSupBase + 'getTollPlaza'

// export const otpVerification = headSupBase + 'otpVerification'

// export const RefreshDriverDetails = headSupBase + 'RefreshDriverDetails'
// export const RefreshVehicleDetails = headSupBase + 'RefreshVehicleDetails'

// export const VerifyVehicleNumber = headSupBase + 'getVehicleDetailsULIP'
// export const VerifyDL = headSupBase + 'getDriverDetailsSarathi'

// export const AcmesExport = headSupBase + 'getACMES01'
// export const AcmesImport = headSupBase + 'getACMES02'

// export const AccsExport = headSupBase + 'getKALE01'
// export const AccsImport = headSupBase + 'getKALE02'

// export const AaiclasExport = headSupBase + 'getAAICLAS01'
// export const AaiclasImport = headSupBase + 'getAAICLAS02'

// export const OcianImport = headSupBase + 'getICEGATE02'
// export const OcianImport2 = headSupBase + 'getICEGATE03'

// export const OcianExport = headSupBase + 'getICEGATE05'

// export const ContainerApi = headSupBase + 'getLDB01'

// export const RoadF = headSupBase + 'getFastTag'
// export const RailF = headSupBase + 'getFNRdetails'

// Track Api api
// export const BaseUrl2 = "https://www.ulip.dpiit.gov.in/ulip/v1.0.0/";

// Base Api
// export const VerifyDL = BaseUrl2 + 'SARATHI/01'
// export const VerifyVehicleNumber = BaseUrl2 + 'VAHAN/01'
// export const Login2 = BaseUrl2 + 'user/login'

// Rail Frieght
// export const RailF = BaseUrl2 + 'FOIS/01'

// Road Frieght
// export const RoadF = BaseUrl2 + 'FASTAG/01'

// Air Frieght 
// export const AcmesExport = BaseUrl2 + 'ACMES/01'
// export const AcmesImport = BaseUrl2 + 'ACMES/02'
// export const AccsExport = BaseUrl2 + 'KALE/01'
// export const AccsImport = BaseUrl2 + 'KALE/01'
// export const AaiclasExport = BaseUrl2 + 'AAICLAS/01'
// export const AaiclasImport = BaseUrl2 + 'AAICLAS/02'

// Ocean Frieght
// export const OcianImport = BaseUrl2 + 'ICEGATE/02'
// export const OcianImport2 = BaseUrl2 + 'ICEGATE/03'

// export const OcianExport = BaseUrl2 + 'ICEGATE/05'

// export const ContainerApi = BaseUrl2 + 'LDB/01'

// 
// export const BaseUrl3 = "https://sct.intutrack.com/api/test/";

// export const Consents = BaseUrl3 + 'consents'
// export const StartTrip = BaseUrl3 + 'trips/start'
// export const UpdateUlipTrip = BaseUrl3 + 'trips/'

// export const SimLocation = BaseUrl3 + 'status'

// export const EndTripApi = BaseUrl3 + 'trips/end/'
// export const UpDateTrip = BaseUrl3 + 'trips/'
// export const EndTripApi = BaseUrl3 + 'trips/end/'
// export const UpDateTrip = BaseUrl3 + 'trips/'



