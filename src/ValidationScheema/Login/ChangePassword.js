import { STROGNPASSWORD } from "../../utils";

export const ChangePasswordValidation = (data) => {
    console.log("data", data);

    console.log("data?.apiJson?.password", data?.apiJson?.password);



    const MyPromiss = new Promise(((resolve, reject) => {
        if (data?.apiJson?.newPassword?.length > 0) {
            if (!STROGNPASSWORD.test(data?.apiJson?.newPassword)) {
                Object.assign(data.apiJsonError, { newPassword: "Requires uppercase,lowercase,digit,or special character *" })
            }
        }
        if (data?.apiJson?.oldPassword?.length > 0) {
            if (!STROGNPASSWORD.test(data?.apiJson?.oldPassword)) {
                Object.assign(data.apiJsonError, { oldPassword: "Requires uppercase,lowercase,digit,or special character *" })
            }
        }
        if (data?.apiJson?.newPassword?.length > 0 && data?.apiJson?.confirmPassword?.length > 0) {
            if (data?.apiJson?.newPassword !== data?.apiJson?.confirmPassword) {
                Object.assign(data.apiJsonError, { confirmPassword: "Password does not match *" })
            }
        }
          if (Object.keys(data.apiJson).length === 0) {
            Object.assign(data.apiJsonError, { newPassword: "Password cannot be empty" });
            Object.assign(data.apiJsonError, { oldPassword: "Password cannot be empty" });
            Object.assign(data.apiJsonError, { confirmPassword: "Password cannot be empty" })

        }
        if (data?.apiJson?.confirmPassword === "" || data?.apiJson.confirmPassword == undefined) {
            Object.assign(data.apiJsonError, { confirmPassword: "Field cannot be empty *" })
        }
        if (data?.apiJson?.newPassword === "" || data?.apiJson.newPassword == undefined) {
            Object.assign(data.apiJsonError, { newPassword: "Field cannot be empty *" })
        }
        if (data?.apiJson?.oldPassword === "" || data?.apiJson.oldPassword == undefined) {
            Object.assign(data.apiJsonError, { oldPassword: "Field cannot be empty *" })
        }
        resolve(data.apiJsonError)
    }))

    return MyPromiss;
}
