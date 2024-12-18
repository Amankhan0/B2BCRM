export const trackYourTransportUser = 'armyUser';
export const tytPlan = 'tytPlan';



export const setTrackYourTransportUser = (data)=>{
    localStorage.setItem(trackYourTransportUser, JSON.stringify(data));
}

export const getTrackYourTransportUser = () =>{
    return JSON.parse(localStorage.getItem(trackYourTransportUser));
}

export const setTrackYourTransportPlanModal = (data)=>{
    localStorage.setItem(tytPlan, JSON.stringify(data));
}

export const getTrackYourTransportPlanModal = () =>{
    return JSON.parse(localStorage.getItem(tytPlan));
}

