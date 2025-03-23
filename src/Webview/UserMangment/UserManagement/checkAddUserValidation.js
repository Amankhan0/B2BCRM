import { regexEmail } from "../../../utils"

export const checkAddUserValidation = (data) => {

    var error = {}

    const MyPromiss = new Promise(((resolve, reject) => {
        if(!data.firstName || data.firstName === ''){
            Object.assign(error, { firstName: "First name is required" })
        }
        if(!data.lastName || data.lastName === ''){
            Object.assign(error, { lastName: "Last name is required" })
        }
        if(!data.contact || data.contact === '' || data.contact.length === 10){
            Object.assign(error, { contact: "Contact is required" })
        }
        if(!data.email || data.email === '' || !regexEmail.test(data.email)){
            Object.assign(error, { email: "Email is required" })
        }
        if(!data.state || data.state === ''){
            Object.assign(error, { state: "State is required" })
        }
        if(!data.landmark || data.landmark === ''){
            Object.assign(error, { landmark: "Landmark is required" })
        }
        if(!data.country || data.country === ''){
            Object.assign(error, { country: "Country is required" })
        }
        if(!data.address || data.address === ''){
            Object.assign(error, { address: "Address is required" })
        }
        if(!data.pinCode || data.pinCode === ''){
            Object.assign(error, { pinCode: "Pincode is required" })
        }
        if(!data.city || data.city === ''){
            Object.assign(error, { city: "City is required" })
        }
        if(!data.username || data.username === ''){
            Object.assign(error, { username: "Username is required" })
        }
        if(!data.password || data.password === ''){
            Object.assign(error, { password: "Password is required" })
        }
        if(!data.confirmPassword || data.confirmPassword === '' || data.confirmPassword !== data.password ){
            Object.assign(error, { confirmPassword: "Confirm password is required" })
        }
        resolve(error)
    }))

    return MyPromiss;
}