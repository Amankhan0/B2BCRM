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
    uploadFileWithoutIP,searchFile,
    searchFileWithoutIP,
    fileUpdate,
    fileDelete,
    fileDeleteWithoutIP,
    fileUpdateWithoutIP
} from "../../../Constants/Constants";

export const panelPermisson = {
    "roleName": "",
    "roleType": "",
    "allowedEndPoints": [searchFile,uploadFileWithoutIP,searchRoleWithoutIP,addRoleWithoutIP,updateRoleWithoutIP,deleteRoleWithoutIP,searchUserWithoutIP,addUserWithoutIP,deleteUserWithoutIP,updateUserWithoutIP,downloadWithoutIP,searchFileWithoutIP,fileUpdateWithoutIP,fileDeleteWithoutIP],
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
        },
        {
            "value": "Adds With PDF",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": downloadWithoutIP,
            'writeEndpoint': [searchFileWithoutIP, fileUpdateWithoutIP],
            'deleteEndpoint': fileDeleteWithoutIP
        },
        {
            "value": "Findvehicle",
            "permission": [
                {
                    "read": false,
                    "write": false,
                    "delete": false
                }
            ],
            "readEndpoint": 'downloadWithoutIP',
            'writeEndpoint': ['searchFileWithoutIP', 'fileUpdateWithoutIP'],
            'deleteEndpoint': 'fileDeleteWithoutIP'
        },
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
        "AdsWithPDF": {
            read: searchFileWithoutIP,
            write: [uploadFileWithoutIP, fileUpdateWithoutIP],
            delete: fileDeleteWithoutIP
        },
        "Findvehicle": {
            read: 'searchFileWithoutIP',
            write: ['uploadFileWithoutIP', 'fileUpdateWithoutIP'],
            delete: 'fileDeleteWithoutIP'
        },
    };

    // Map existing permissions
    const compiled = (data || []).map(item => ({
        ...item,
        // If nested permission array exists, merge first object; else default
        read: item.permission?.[0]?.read ?? false,
        write: item.permission?.[0]?.write ?? false,
        delete: item.permission?.[0]?.delete ?? false,
        readEndpoint: endpointMapping[item.value]?.read || null,
        writeEndpoint: endpointMapping[item.value]?.write || [],
        deleteEndpoint: endpointMapping[item.value]?.delete || null
    }));

    // Add missing modules from endpointMapping
    const existingValues = new Set(compiled.map(i => i.value));
    Object.keys(endpointMapping).forEach(key => {
        if (!existingValues.has(key)) {
            compiled.push({
                value: key,
                permission: [{ read: false, write: false, delete: false }],
                read: false,
                write: false,
                delete: false,
                readEndpoint: endpointMapping[key].read,
                writeEndpoint: endpointMapping[key].write,
                deleteEndpoint: endpointMapping[key].delete,
                child: null
            });
        }
    });

    return { permission: compiled };
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
        uploadFileWithoutIP,downloadWithoutIP,searchFile,searchFileWithoutIP,fileDeleteWithoutIP,fileUpdateWithoutIP
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