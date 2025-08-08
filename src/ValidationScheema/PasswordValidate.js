import { STROGNPASSWORD } from "../utils"

export const VerifyPasswordValidation = (data) => {
  console.log("data",data);

  console.log("data?.apiJson?.password",data?.apiJson?.password);
  
  
    
    const MyPromiss = new Promise(((resolve, reject) => {
        if (data?.apiJson?.password?.length > 0) {
            if (!STROGNPASSWORD.test(data?.apiJson?.password)) {
              Object.assign(data.apiJsonError, { password: "Requires uppercase,lowercase,digit,or special character *" })
            }
          }
          if (data?.apiJson?.password?.length > 0 && data?.apiJson?.confirmPassword?.length > 0 ) {
            if (data?.apiJson?.password !== data?.apiJson?.confirmPassword) {
              Object.assign(data.apiJsonError, { confirmPassword: "Password does not match *" })
            }
          }
          if (Object.keys(data.apiJson).length === 0) {
            Object.assign(data.apiJsonError, { password: "Password cannot be empty" });
            Object.assign(data.apiJsonError, { confirmPassword: "Password cannot be empty" });
        }
        if (data?.apiJson?.confirmPassword === "" || data?.apiJson.confirmPassword == undefined) {
            Object.assign(data.apiJsonError, { confirmPassword: "Field cannot be empty *" })
        }
        resolve(data.apiJsonError)
    }))

    return MyPromiss;
}
