
import { CREATETRIP, DASHBOARDICON, MYTRIPS } from "../SVG/Icons";
import blackcreateTrip from '../Images/panelIcons/Icons-16.png';

export default [
    {
        id: 0, title: "Dashboard", url: '/', active: true, icon: DASHBOARDICON, blackIcon: DASHBOARDICON
    },
    {
        id: 0, title: "Create Trip", url: '/trip/create', active: true, icon: CREATETRIP, blackIcon: <img className="w-6 h-6" src={blackcreateTrip} />
    },
    {
        id: 0, title: "View Trip", url: '/trip/view', active: true, icon: MYTRIPS, blackIcon: MYTRIPS
    },
]