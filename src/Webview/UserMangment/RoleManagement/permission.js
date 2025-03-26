import { 
    addCustomerWithoutIP, addDispatchWithoutIP, addLeadWithoutIP, addOrderWithoutIP, addPIWithoutIP, addPOWithoutIP, addProductWithoutIP, addQuotationWithoutIP, 
    addRoleWithoutIP, addSupplierWithoutIP, addUserWithoutIP, 
    deleteCustomerWithoutIP, deleteLeadWithoutIP, deleteOrderWithoutIP, deleteProductWithoutIP, 
    deleteQuotationWithoutIP, deleteRoleWithoutIP, deleteSupplierWithoutIP, deleteUserWithoutIP, 
    searchCustomerWithoutIP, searchDispatchWithoutIP, searchLeadWithoutIP, searchOrderWithoutIP, searchPIWithoutIP, searchPOWithoutIP, searchProductWithoutIP, 
    searchQuotationWithoutIP, searchRoleWithoutIP, searchSupplierWithoutIP, searchUserWithoutIP, 
    updateCustomerWithoutIP, updateDispatch, updateDispatchWithoutIP, updateLeadWithoutIP, updateOrderWithoutIP, updatePIWithoutIP, updatePOWithoutIP, updateProductWithoutIP, 
    updateQuotationWithoutIP, updateRoleWithoutIP, updateSupplierWithoutIP, updateUserWithoutIP, 
    uploadFileWithoutIP
  } from "../../../Constants/Constants";
  
export const panelPermisson = {
    "roleName": "",
    "allowedEndPoints": [],
    "permission": [
        {
            "value": "Lead",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchLeadWithoutIP,
            'writeEndpoint': [addLeadWithoutIP, updateLeadWithoutIP],
            'deleteEndpoint': deleteLeadWithoutIP
        },
        {
            "value": "Quotation",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchQuotationWithoutIP,
            'writeEndpoint': [addQuotationWithoutIP, updateQuotationWithoutIP],
            'deleteEndpoint': deleteQuotationWithoutIP
        },
        {
            "value": "Order",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchOrderWithoutIP,
            'writeEndpoint': [addOrderWithoutIP, uploadFileWithoutIP,updateOrderWithoutIP,searchPOWithoutIP,searchPOWithoutIP,searchPIWithoutIP,addPOWithoutIP,addPIWithoutIP,addDispatchWithoutIP,searchDispatchWithoutIP,updatePOWithoutIP,updatePIWithoutIP,updateDispatchWithoutIP],
            'deleteEndpoint': deleteOrderWithoutIP
        },
        {
            "value": "Customer",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchCustomerWithoutIP,
            'writeEndpoint': [addCustomerWithoutIP, updateCustomerWithoutIP],
            'deleteEndpoint': deleteCustomerWithoutIP
        },
        {
            "value": "Supplier",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchSupplierWithoutIP,
            'writeEndpoint': [addSupplierWithoutIP, updateSupplierWithoutIP],
            'deleteEndpoint': deleteSupplierWithoutIP
        },
        {
            "value": "Product",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchProductWithoutIP,
            'writeEndpoint': [addProductWithoutIP, updateProductWithoutIP],
            'deleteEndpoint': deleteProductWithoutIP
        },
        {
            "value": "Role",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchRoleWithoutIP,
            'writeEndpoint': [addRoleWithoutIP, updateRoleWithoutIP],
            'deleteEndpoint': deleteRoleWithoutIP
        },
        {
            "value": "User",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchUserWithoutIP,
            'writeEndpoint': [addUserWithoutIP, updateUserWithoutIP],
            'deleteEndpoint': deleteUserWithoutIP
        }
    ]
}