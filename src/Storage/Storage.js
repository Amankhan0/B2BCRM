import CryptoJS from 'crypto-js';
import { secretKey } from '../utils';

export const trackYourTransportUser = 'armyUser';
export const tytPlan = 'tytPlan';


export const setTrackYourTransportUser = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    localStorage.setItem(trackYourTransportUser, encryptedData);
};

export const getTrackYourTransportUser = () => {
    const encryptedData = localStorage.getItem(trackYourTransportUser);
    if (!encryptedData) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error('Failed to decrypt data:', error);
        return null;
    }
};

export const setTrackYourTransportPlanModal = (data) => {
    localStorage.setItem(tytPlan, JSON.stringify(data));
};

export const getTrackYourTransportPlanModal = () => {
    return JSON.parse(localStorage.getItem(tytPlan));
};
