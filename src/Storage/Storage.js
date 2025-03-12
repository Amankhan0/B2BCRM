import { jwtDecode } from "jwt-decode"
import { searchUser } from "../Constants/Constants";
import { ApiHit } from "../utils";
export const AuthenticatedUser = 'AuthenticatedUser';
export const AuthenticatedUserWithRole = 'AuthenticatedUserWithRole'
export const buildingName = 'buildingName'
export const userInfo = 'userInfo';
export const visibleColumn = 'visible-column';
export const apiJson = 'daj';
export const selectedData = 'dajd';

export const setAuthenticatedUser = (data) => {
    localStorage.setItem(AuthenticatedUser, JSON.stringify(data));
}

export const getAuthenticatedUser = () => {
    const token = localStorage?.getItem(AuthenticatedUser);
    if (token) {
        try {
            const parsedToken = JSON.parse(token);
            return jwtDecode(parsedToken);
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    } else {
        return null;
    }
}

export const getAuthToken = () => {
    const token = localStorage.getItem(AuthenticatedUser);
    if (token) {
        try {
            return JSON.parse(token);
        } catch (error) {
            console.error("Failed to parse token:", error);
            return null;
        }
    } else {
        return null;
    }
}

export const logOutAuthenticatedUser = () => {
    localStorage.removeItem(AuthenticatedUser);
    localStorage.removeItem(AuthenticatedUserWithRole);

}

export const setAuthenticatedUserWithRole = (data) => {
    localStorage.setItem(AuthenticatedUserWithRole, JSON.stringify(data));
}

export const getAuthenticatedUserWithRoles = () => {
    return JSON.parse(localStorage.getItem(AuthenticatedUserWithRole));
}


export const setBuildingToStorage = (data) => {

    delete data?.ele
    localStorage.setItem(buildingName, JSON.stringify(data));
}

export const getBuildingFromStorage = () => {
    return JSON.parse(localStorage.getItem(buildingName));
}

export const removeBuildingFromStorage = () => {
    localStorage.removeItem(buildingName)
}


export const setUser = async () => {
    const user = getAuthenticatedUser();
    if (user?.userId) {
        const json = {
            page: 1,
            limit: 1,
            search: {
                _id: user.userId
            }
        };

        try {
            const result = await ApiHit(json, searchUser);
            if (result?.content?.[0]) {
                localStorage.setItem('userInfo', JSON.stringify(result.content[0]));
                return result.content[0];
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    return null;
};

export const getUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

export const SetDashboardApiJson = (data) => {
    console.log('data', data);
    localStorage.setItem(apiJson, JSON.stringify(data));
}

export const GetDashboardApiJson = () => {
    return JSON.parse(localStorage.getItem(apiJson));
}

export const SetDashboardSelectedData = (data) => {
    console.log('data', data);
    localStorage.setItem(selectedData, JSON.stringify(data));
}

export const GetDashboardSelectedData = () => {
    return JSON.parse(localStorage.getItem(selectedData));
}

export const SetVisibleColumn = (data) => {
    localStorage.setItem(visibleColumn, JSON.stringify(data));
}

export const GetVisibleColumn = () => {
    return JSON.parse(localStorage.getItem(visibleColumn));
}


export const SetBuildVersion = (data) => {
    localStorage.setItem('bv', JSON.stringify(data));
}

export const GetBuildVersion = () => {
    return JSON.parse(localStorage.getItem('bv'));
}