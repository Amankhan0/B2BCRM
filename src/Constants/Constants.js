// development
export const Protocol = 'https://'
// export const IP = '10.0.0.237'
// export const IP = '192.168.1.40:9090' //local
// export const BASEURL = Protocol + IP
// production
// export const Protocol = 'https://'
export const IP = 'api-crm.headsupb2b.com'

export const BASEURL = Protocol + IP

export const UserMicroService = `${Protocol}${IP}/userheadsup/api/`
export const OrderMicroService = `${Protocol}${IP}/orderheadsup/api/`
export const HelperMicroService = `${Protocol}${IP}/helperheadsup/api/`
export const PlantMicroService = `${Protocol}${IP}/plantheadsup/api/`
export const uploadMicroService = `${Protocol}${IP}/uploadheadsup/api/`

export const UserMicroServiceWithoutIP = `/userheadsup/api/`
export const OrderMicroServiceWithoutIP = `/orderheadsup/api/`
export const HelperMicroServiceWithoutIP = `/helperheadsup/api/`
export const PlantMicroServiceWithoutIP = `/plantheadsup/api/`
export const uploadMicroServiceWithoutIP = `/uploadheadsup/api/`

export const login = BASEURL + '/auth/login'

// General 
export const searchGeneral = HelperMicroService + 'searchGeneral'
export const searchGeneralWithoutIP = HelperMicroServiceWithoutIP + 'searchGeneral'

// Upload

export const uploadFile = uploadMicroService + 'uploadFile'
export const searchFile = uploadMicroService + 'searchFile'
export const activate = uploadMicroService + 'activate'
export const download = uploadMicroService + 'download'
export const fileDelete = uploadMicroService + 'delete'
export const fileDeleteWithoutIP = uploadMicroServiceWithoutIP + 'delete'
export const fileUpdate = uploadMicroService + 'update'
export const fileUpdateWithoutIP = uploadMicroServiceWithoutIP + 'update'

export const uploadFileWithoutIP = uploadMicroServiceWithoutIP + 'uploadFile'
export const searchFileWithoutIP = uploadMicroServiceWithoutIP + 'searchFile'
export const activateWithoutIP = uploadMicroServiceWithoutIP + 'activate'
export const downloadWithoutIP = uploadMicroServiceWithoutIP + 'download'

// Roles
export const addRole = UserMicroService + 'addRole'
export const updateRole = UserMicroService + 'updateRole'
export const searchRole = UserMicroService + 'searchRole' //UserMicroService
export const deleteRole = UserMicroService + 'deleteRole' //UserMicroService

export const addRoleWithoutIP = UserMicroServiceWithoutIP + 'addRole'
export const updateRoleWithoutIP = UserMicroServiceWithoutIP + 'updateRole'
export const searchRoleWithoutIP = UserMicroServiceWithoutIP + 'searchRole' //UserMicroService
export const deleteRoleWithoutIP = UserMicroServiceWithoutIP + 'deleteRole' //UserMicroService

// Leads
export const addLead = OrderMicroService + 'addLead' //UserMicroService
export const updateLead = OrderMicroService + 'updateLead' //UserMicroService
export const searchLead = OrderMicroService + 'searchLead' //UserMicroService
export const deleteLead = OrderMicroService + 'deleteLead' //UserMicroService

export const addLeadWithoutIP = OrderMicroServiceWithoutIP + 'addLead' //UserMicroService
export const updateLeadWithoutIP = OrderMicroServiceWithoutIP + 'updateLead' //UserMicroService
export const searchLeadWithoutIP = OrderMicroServiceWithoutIP + 'searchLead' //UserMicroService
export const deleteLeadWithoutIP = OrderMicroServiceWithoutIP + 'deleteLead' //UserMicroService

//User

export const addUser = UserMicroService + "addUser"
export const updateUser = UserMicroService + "updateUser"
export const deleteUser = UserMicroService + "deleteUser"
export const searchUser = UserMicroService + "searchUser"

export const addUserWithoutIP = UserMicroServiceWithoutIP + "addUser"
export const updateUserWithoutIP = UserMicroServiceWithoutIP + "updateUser"
export const deleteUserWithoutIP = UserMicroServiceWithoutIP + "deleteUser"
export const searchUserWithoutIP = UserMicroServiceWithoutIP + "searchUser"

// Supplier
export const addSupplier = HelperMicroService + 'addSupplier'
export const updateSupplier = HelperMicroService + 'updateSupplier'
export const searchSupplier = HelperMicroService + 'searchSupplier'
export const deleteSupplier = HelperMicroService + 'deleteSupplier'

export const addSupplierWithoutIP = HelperMicroServiceWithoutIP + 'addSupplier'
export const updateSupplierWithoutIP = HelperMicroServiceWithoutIP + 'updateSupplier'
export const searchSupplierWithoutIP = HelperMicroServiceWithoutIP + 'searchSupplier'
export const deleteSupplierWithoutIP = HelperMicroServiceWithoutIP + 'deleteSupplier'

// Site
export const addSite = PlantMicroService + 'addSite'
export const updateSite = PlantMicroService + 'updateSite'
export const searchSite = PlantMicroService + 'searchSite'
export const deleteSite = PlantMicroService + 'deleteSite'

export const addSiteWithoutIP = PlantMicroServiceWithoutIP + 'addSite'
export const updateSiteWithoutIP = PlantMicroServiceWithoutIP + 'updateSite'
export const searchSiteWithoutIP = PlantMicroServiceWithoutIP + 'searchSite'
export const deleteSiteWithoutIP = PlantMicroServiceWithoutIP + 'deleteSite'

//General master

export const addGeneral = HelperMicroService + 'addGeneral' //UserMicroService
export const updateGeneral = HelperMicroService + 'updateGeneral' //UserMicroService
export const getGeneral = HelperMicroService + 'searchGeneral' //UserMicroService
export const deleteGeneral = HelperMicroService + 'deleteGeneral' //UserMicroService

export const addGeneralWithoutIP = HelperMicroServiceWithoutIP + 'addGeneral' //UserMicroService
export const updateGeneralWithoutIP = HelperMicroServiceWithoutIP + 'updateGeneral' //UserMicroService
export const getGeneralWithoutIP = HelperMicroServiceWithoutIP + 'searchGeneral' //UserMicroService
export const deleteGeneralWithoutIP = HelperMicroServiceWithoutIP + 'deleteGeneral' //UserMicroService

// Customer master
export const addCustomer = HelperMicroService + 'addCustomer'
export const updateCustomer = HelperMicroService + 'updateCustomer'
export const searchCustomer = HelperMicroService + 'searchCustomer'
export const deleteCustomer = HelperMicroService + 'deleteCustomer'

export const addCustomerWithoutIP = HelperMicroServiceWithoutIP + 'addCustomer'
export const updateCustomerWithoutIP = HelperMicroServiceWithoutIP + 'updateCustomer'
export const searchCustomerWithoutIP = HelperMicroServiceWithoutIP + 'searchCustomer'
export const deleteCustomerWithoutIP = HelperMicroServiceWithoutIP + 'deleteCustomer'

//Vehicle master
export const addVehicle = HelperMicroService + 'addVehicle'
export const updateVehicle = HelperMicroService + 'updateVehicle'
export const searchVehicle = HelperMicroService + 'searchVehicle'
export const deleteVehicle = HelperMicroService + 'deleteVehicle'

export const addVehicleWithoutIP = HelperMicroServiceWithoutIP + 'addVehicle'
export const updateVehicleWithoutIP = HelperMicroServiceWithoutIP + 'updateVehicle'
export const searchVehicleWithoutIP = HelperMicroServiceWithoutIP + 'searchVehicle'
export const deleteVehicleWithoutIP = HelperMicroServiceWithoutIP + 'deleteVehicle'

//Product master
export const addProduct = HelperMicroService + 'addProduct'
export const updateProduct = HelperMicroService + 'updateProduct'
export const searchProduct = HelperMicroService + 'searchProduct'
export const deleteProduct = HelperMicroService + 'deleteProduct'

export const addProductWithoutIP = HelperMicroServiceWithoutIP + 'addProduct'
export const updateProductWithoutIP = HelperMicroServiceWithoutIP + 'updateProduct'
export const searchProductWithoutIP = HelperMicroServiceWithoutIP + 'searchProduct'
export const deleteProductWithoutIP = HelperMicroServiceWithoutIP + 'deleteProduct'


//Order
export const addOrder = OrderMicroService + 'addOrder'
export const updateOrder = OrderMicroService + 'updateOrder'
export const searchOrder = OrderMicroService + 'searchOrder'
export const deleteOrder = OrderMicroService + 'deleteOrder'

export const addOrderWithoutIP = OrderMicroServiceWithoutIP + 'addOrder'
export const updateOrderWithoutIP = OrderMicroServiceWithoutIP + 'updateOrder'
export const searchOrderWithoutIP = OrderMicroServiceWithoutIP + 'searchOrder'
export const deleteOrderWithoutIP = OrderMicroServiceWithoutIP + 'deleteOrder'


//Ouatation
export const addQuotation = OrderMicroService + 'addQuotation'
export const searchQuotation = OrderMicroService + 'searchQuotation'
export const updateQuotation = OrderMicroService + 'updateQuotation'
export const deleteQuotation = OrderMicroService + 'deleteQuotation'

export const addQuotationWithoutIP = OrderMicroServiceWithoutIP + 'addQuotation'
export const searchQuotationWithoutIP = OrderMicroServiceWithoutIP + 'searchQuotation'
export const updateQuotationWithoutIP = OrderMicroServiceWithoutIP + 'updateQuotation'
export const deleteQuotationWithoutIP = OrderMicroServiceWithoutIP + 'deleteQuotation'

// PO
export const addPO = OrderMicroService + 'addPO'
export const searchPO = OrderMicroService + 'searchPO'
export const updatePO = OrderMicroService + 'updatePO'

export const addPOWithoutIP = OrderMicroServiceWithoutIP + 'addPO'
export const searchPOWithoutIP = OrderMicroServiceWithoutIP + 'searchPO'
export const updatePOWithoutIP = OrderMicroServiceWithoutIP + 'updatePO'

// Dispatch
export const addDispatch = OrderMicroService + 'addDispatch'
export const searchDispatch = OrderMicroService + 'searchDispatch'
export const updateDispatch = OrderMicroService + 'updateDispatch'

export const addDispatchWithoutIP = OrderMicroServiceWithoutIP + 'addDispatch'
export const searchDispatchWithoutIP = OrderMicroServiceWithoutIP + 'searchDispatch'
export const updateDispatchWithoutIP = OrderMicroServiceWithoutIP + 'updateDispatch'

// PO
export const addPI = OrderMicroService + 'addPI'
export const searchPI = OrderMicroService + 'searchPI'
export const updatePI = OrderMicroService + 'updatePI'

export const addPIWithoutIP = OrderMicroServiceWithoutIP + 'addPI'
export const searchPIWithoutIP = OrderMicroServiceWithoutIP + 'searchPI'
export const updatePIWithoutIP = OrderMicroServiceWithoutIP + 'updatePI'




// Website lead
export const searchWebsiteLead = BASEURL + '/api/' + 'searchWebsiteLead'
export const updateWebsiteLead = BASEURL + '/api/' + 'updateWebsiteLead'

//Build Version
export const buildVersion = 1.01


export const Active = "Active"
export const InActive = "InActive"
export const QuotationInitiated = "Quotation_Initiated"
export const OrderInitiated = "Order_Initiated"
export const selectClass = "mt-1 w-full outline-none h-10 text-md rounded-lg border border-black placeholder:normal-case hover:border-slate-400 pl-2"
export const tableTdClass = 'min-w-[150px] p-2 border text-black'