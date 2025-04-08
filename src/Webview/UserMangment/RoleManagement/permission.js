import {
    addCustomerWithoutIP, addDispatchWithoutIP, addLeadWithoutIP, addOrderWithoutIP, addPIWithoutIP, addPOWithoutIP, addProductWithoutIP, addQuotationWithoutIP,
    addRoleWithoutIP, addSupplierWithoutIP, addUserWithoutIP,
    deleteCustomerWithoutIP, deleteLeadWithoutIP, deleteOrderWithoutIP, deleteProductWithoutIP,
    deleteQuotationWithoutIP, deleteRoleWithoutIP, deleteSupplierWithoutIP, deleteUserWithoutIP,
    downloadWithoutIP,
    searchCustomerWithoutIP, searchDispatchWithoutIP, searchLeadWithoutIP, searchOrderWithoutIP, searchPIWithoutIP, searchPOWithoutIP, searchProductWithoutIP,
    searchQuotationWithoutIP, searchRoleWithoutIP, searchSupplierWithoutIP, searchUserWithoutIP,
    updateCustomerWithoutIP, updateDispatch, updateDispatchWithoutIP, updateLeadWithoutIP, updateOrderWithoutIP, updatePIWithoutIP, updatePOWithoutIP, updateProductWithoutIP,
    updateQuotationWithoutIP, updateRoleWithoutIP, updateSupplierWithoutIP, updateUserWithoutIP,
    uploadFileWithoutIP,searchFile
} from "../../../Constants/Constants";

export const panelPermisson = {
    "roleName": "",
    "roleType": "",
    "allowedEndPoints": [searchFile,uploadFileWithoutIP,searchRoleWithoutIP,addRoleWithoutIP,updateRoleWithoutIP,deleteRoleWithoutIP,searchUserWithoutIP,addUserWithoutIP,deleteUserWithoutIP,updateUserWithoutIP,downloadWithoutIP],
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
            'writeEndpoint': [addOrderWithoutIP, updateOrderWithoutIP],
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
            "value": "PO",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchPOWithoutIP,
            'writeEndpoint': [addPOWithoutIP, updatePOWithoutIP],
            'deleteEndpoint': updatePOWithoutIP
        },
        {
            "value": "PI",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchPIWithoutIP,
            'writeEndpoint': [addPIWithoutIP, updatePIWithoutIP],
            'deleteEndpoint': updatePIWithoutIP
        },
        {
            "value": "Dispatch",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": searchDispatchWithoutIP,
            'writeEndpoint': [addDispatchWithoutIP, updateDispatchWithoutIP],
            'deleteEndpoint': updateDispatchWithoutIP
        }
    ]
}

export function compileData(data) {
    const endpointMapping = {
        "Lead": {
            read: searchLeadWithoutIP,
            write: [addLeadWithoutIP, updateLeadWithoutIP],
            delete: deleteLeadWithoutIP
        },
        "Quotation": {
            read: searchQuotationWithoutIP,
            write: [addQuotationWithoutIP, updateQuotationWithoutIP],
            delete: deleteQuotationWithoutIP
        },
        "Order": {
            read: searchOrderWithoutIP,
            write: [addOrderWithoutIP, updateOrderWithoutIP],
            delete: deleteOrderWithoutIP
        },
        "Customer": {
            read: searchCustomerWithoutIP,
            write: [addCustomerWithoutIP, updateCustomerWithoutIP],
            delete: deleteCustomerWithoutIP
        },
        "Supplier": {
            read: searchSupplierWithoutIP,
            write: [addSupplierWithoutIP, updateSupplierWithoutIP],
            delete: deleteSupplierWithoutIP
        },
        "Product": {
            read: searchProductWithoutIP,
            write: [addProductWithoutIP, updateProductWithoutIP],
            delete: deleteProductWithoutIP
        },
        "PO": {
            read: searchPOWithoutIP,
            write: [addPOWithoutIP, updatePOWithoutIP],
            delete: updatePOWithoutIP
        },
        "PI": {
            read: searchPIWithoutIP,
            write: [addPIWithoutIP, updatePIWithoutIP],
            delete: updatePIWithoutIP
        },
        "Dispatch": {
            read: searchDispatchWithoutIP,
            write: [addDispatchWithoutIP, updateDispatch],
            delete: updateDispatch
        },
    };

    return {
        permission: data.map(item => ({
            ...item,
            readEndpoint: endpointMapping[item.value]?.read || null,
            writeEndpoint: endpointMapping[item.value]?.write || [],
            deleteEndpoint: endpointMapping[item.value]?.delete || null
        }))
    };
}

export const superAdminRoleData = {
    allowedEndPoints: [
        searchUserWithoutIP, addUserWithoutIP, updateUserWithoutIP, deleteUserWithoutIP,
        searchRoleWithoutIP, addRoleWithoutIP, updateRoleWithoutIP, deleteRoleWithoutIP,
        searchCustomerWithoutIP, addCustomerWithoutIP, updateCustomerWithoutIP, deleteCustomerWithoutIP,
        searchSupplierWithoutIP, addSupplierWithoutIP, updateSupplierWithoutIP, deleteSupplierWithoutIP,
        searchProductWithoutIP, addProductWithoutIP, updateProductWithoutIP, deleteProductWithoutIP,
        searchLeadWithoutIP, addLeadWithoutIP, updateLeadWithoutIP, deleteLeadWithoutIP,
        searchQuotationWithoutIP, addQuotationWithoutIP, updateQuotationWithoutIP, deleteQuotationWithoutIP,
        searchOrderWithoutIP, addOrderWithoutIP, updateOrderWithoutIP, deleteOrderWithoutIP,
        searchPOWithoutIP, addPOWithoutIP, updatePOWithoutIP,
        searchPIWithoutIP, addPIWithoutIP, updatePIWithoutIP,
        addDispatchWithoutIP, searchDispatchWithoutIP, updateDispatchWithoutIP,
        uploadFileWithoutIP,downloadWithoutIP,searchFile
    ],
    "permission": [
        {
            "value": "Lead",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Quotation",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Order",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Customer",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Supplier",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Product",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "Role",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
        {
            "value": "User",
            "permission": [
                {
                    "read": true,
                    "write": true,
                    "delete": true
                }
            ],
        },
    ]
}