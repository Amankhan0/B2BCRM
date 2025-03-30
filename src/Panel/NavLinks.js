
import { getAuthenticatedUserWithRoles } from "../Storage/Storage";
import { CREATETRIP, DASHBOARDICON, MYTRIPS } from "../SVG/Icons";

let user = getAuthenticatedUserWithRoles();

console.log('navigationuser',user?.roleObject?.permission?.[0]?.permission?.[0].read);


export default [
    {
        id: 0, title: "Lead", url: '/lead', active: user?.roleObject?.permission?.[0]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Quotation", url: '/quotation', active: user?.roleObject?.permission?.[1]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Order", url: '/order', active: user?.roleObject?.permission?.[2]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Customer", url: '/customer', active: user?.roleObject?.permission?.[3]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Supplier", url: '/supplier', active: user?.roleObject?.permission?.[4]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Product", url: '/product', active: user?.roleObject?.permission?.[5]?.permission?.[0].read, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Role", url: '/role', active: user?.roleObject?.roleType === 'superadmin', icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "User", url: '/user', active: user?.roleObject?.roleType === 'superadmin', icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
]