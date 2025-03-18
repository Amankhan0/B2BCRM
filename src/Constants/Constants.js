// development
export const Protocol = 'http://'
// export const IP = '10.0.0.237'
export const IP = '192.168.1.29:9090' //local
// export const BASEURL = Protocol + IP

// production
// export const Protocol = 'https://'
// export const IP = 'api-crm.headsupb2b.com'

export const BASEURL = Protocol + IP

export const UserMicroService = `${Protocol}${IP}/userheadsup/api/`
export const OrderMicroService = `${Protocol}${IP}/orderheadsup/api/`
export const HelperMicroService = `${Protocol}${IP}/helperheadsup/api/`
export const PlantMicroService = `${Protocol}${IP}/plantheadsup/api/`
export const uploadMicroService = `${Protocol}${IP}/uploadheadsup/api/`


export const login = BASEURL + '/auth/login'

// General 
export const searchGeneral = HelperMicroService + 'searchGeneral'

// Upload

export const uploadFile = uploadMicroService + 'uploadFile'
export const searchFile = uploadMicroService + 'searchFile'
export const activate = uploadMicroService + 'activate'
export const download = uploadMicroService + 'download'

// Roles
export const addRole = UserMicroService + 'addRole'
export const updateRole = UserMicroService + 'updateRole'
export const searchRole = UserMicroService + 'searchRole' //UserMicroService
export const deleteRole = UserMicroService + 'deleteRole' //UserMicroService

// Leads
export const addLead = OrderMicroService + 'addLead' //UserMicroService
export const updateLead = OrderMicroService + 'updateLead' //UserMicroService
export const searchLead = OrderMicroService + 'searchLead' //UserMicroService
export const deleteLead = OrderMicroService + 'deleteLead' //UserMicroService

//User

export const addUser = UserMicroService + "addUser"
export const updateUser = UserMicroService + "updateUser"
export const deleteUser = UserMicroService + "deleteUser"
export const searchUser = UserMicroService + "searchUser"

// Supplier
export const addSupplier = HelperMicroService + 'addSupplier'
export const updateSupplier = HelperMicroService + 'updateSupplier'
export const searchSupplier = HelperMicroService + 'searchSupplier'
export const deleteSupplier = HelperMicroService + 'deleteSupplier'

// Site
export const addSite = PlantMicroService + 'addSite'
export const updateSite = PlantMicroService + 'updateSite'
export const searchSite = PlantMicroService + 'searchSite'
export const deleteSite = PlantMicroService + 'deleteSite'

//General master

export const addGeneral = HelperMicroService + 'addGeneral' //UserMicroService
export const updateGeneral = HelperMicroService + 'updateGeneral' //UserMicroService
export const getGeneral = HelperMicroService + 'searchGeneral' //UserMicroService
export const deleteGeneral = HelperMicroService + 'deleteGeneral' //UserMicroService

// Customer master
export const addCustomer = HelperMicroService + 'addCustomer'
export const updateCustomer = HelperMicroService + 'updateCustomer'
export const searchCustomer = HelperMicroService + 'searchCustomer'
export const deleteCustomer = HelperMicroService + 'deleteCustomer'

//Vehicle master
export const addVehicle = HelperMicroService + 'addVehicle'
export const updateVehicle = HelperMicroService + 'updateVehicle'
export const searchVehicle = HelperMicroService + 'searchVehicle'
export const deleteVehicle = HelperMicroService + 'deleteVehicle'

//Product master
export const addProduct = HelperMicroService + 'addProduct'
export const updateProduct = HelperMicroService + 'updateProduct'
export const searchProduct = HelperMicroService + 'searchProduct'
export const deleteProduct = HelperMicroService + 'deleteProduct'


//Order
export const addOrder = OrderMicroService + 'addOrder'
export const updateOrder = OrderMicroService + 'updateOrder'
export const searchOrder = OrderMicroService + 'searchOrder'
export const deleteOrder = OrderMicroService + 'deleteOrder'


//Ouatation
export const addQuotation = OrderMicroService + 'addQuotation'
export const searchQuotation = OrderMicroService + 'searchQuotation'
export const updateQuotation = OrderMicroService + 'updateQuotation'

// PO
export const addPO = OrderMicroService + 'addPO'
export const searchPO = OrderMicroService + 'searchPO'
export const updatePO = OrderMicroService + 'updatePO'

// Dispatch
export const addDispatch = OrderMicroService + 'addDispatch'
export const searchDispatch = OrderMicroService + 'searchDispatch'
export const updateDispatch = OrderMicroService + 'updateDispatch'

// PO
export const addPI = OrderMicroService + 'addPI'
export const searchPI = OrderMicroService + 'searchPI'
export const updatePI = OrderMicroService + 'updatePI'

//Build Version
export const buildVersion = 1.01






export const selectClass = "mt-1 w-full outline-none h-10 text-md rounded-lg border border-slate-400 placeholder:normal-case hover:border-slate-400 pl-2"