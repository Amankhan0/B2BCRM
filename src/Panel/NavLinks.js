import { getAuthenticatedUserWithRoles } from "../Storage/Storage";
import { CREATETRIP, DASHBOARDICON, MYTRIPS } from "../SVG/Icons";
import { 
  BarChart, 
  FileText, 
  ShoppingCart, 
  Users, 
  Truck, 
  Package, 
  Shield, 
  UserCircle, 
  LayoutDashboard,
  File
} from "lucide-react";

let user = getAuthenticatedUserWithRoles();

console.log('navigationuser', user?.roleObject?.permission?.[0]?.permission?.[0].read);

export default [
  {
    id: 0, 
    title: "Dashboard", 
    url: '/', 
    active: user?.roleObject?.permission?.[0]?.permission?.[0].read, 
    icon: <LayoutDashboard  size={20} />, 
    blackIcon: <LayoutDashboard  size={20} />
  },
  {
    id: 0, 
    title: "Online Lead", 
    url: '/online-lead', 
    active: user?.roleObject?.permission?.[0]?.permission?.[0].read, 
    icon: <BarChart size={20} />, 
    blackIcon: <BarChart size={20} />
  },
  {
    id: 0, 
    title: "Lead", 
    url: '/lead', 
    active: user?.roleObject?.permission?.[0]?.permission?.[0].read, 
    icon: <BarChart size={20} />, 
    blackIcon: <BarChart size={20} />
  },
  {
    id: 0, 
    title: "Quotation", 
    url: '/quotation', 
    active: user?.roleObject?.permission?.[0]?.permission?.[0].read, 
    icon: <FileText size={20} />, 
    blackIcon: <FileText size={20} />
  },
  {
    id: 2, 
    title: "Order", 
    url: '/order', 
    active: user?.roleObject?.permission?.[2]?.permission?.[0].read, 
    icon: <ShoppingCart size={20} />, 
    blackIcon: <ShoppingCart size={20} />
  },
  {
    id: 3, 
    title: "Customer", 
    url: '/customer', 
    active: user?.roleObject?.permission?.[3]?.permission?.[0].read, 
    icon: <Users size={20} />, 
    blackIcon: <Users size={20} />
  },
  {
    id: 4, 
    title: "Supplier", 
    url: '/supplier', 
    active: user?.roleObject?.permission?.[4]?.permission?.[0].read, 
    icon: <Truck size={20} />, 
    blackIcon: <Truck size={20} />
  },
  {
    id: 5, 
    title: "Product", 
    url: '/product', 
    active: user?.roleObject?.permission?.[5]?.permission?.[0].read, 
    icon: <Package size={20} />, 
    blackIcon: <Package size={20} />
  },
  {
    id: 6, 
    title: "Role", 
    url: '/role', 
    active: user?.roleObject?.roleType === 'superadmin', 
    icon: <Shield size={20} />, 
    blackIcon: <Shield size={20} />
  },
  {
    id: 7, 
    title: "User", 
    url: '/user', 
    active: user?.roleObject?.roleType === 'superadmin', 
    icon: <UserCircle size={20} />, 
    blackIcon: <UserCircle size={20} />
  },
  {
    id: 8, 
    title: "PDF Ads", 
    url: '/pdf-ads', 
    active: user?.roleObject?.permission?.[9]?.permission?.[0].read, 
    icon: <File size={20} />, 
    blackIcon: <File size={20} />
  },
];