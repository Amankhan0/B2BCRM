import { regexEmail } from "../../utils";

export const VerifyEamilValidation = (data) => {

  console.log("data?.apiJson?.email", data?.apiJson?.email);

  const MyPromiss = new Promise(((resolve, reject) => {
    if (Object.keys(data.apiJson).length === 0) {
      Object.assign(data.apiJsonError, { email: "Email cannot be empty" });
    }
    if (data?.apiJson?.email?.length > 0) {
      if (!regexEmail.test(data.apiJson?.email)) {
        Object.assign(data.apiJsonError, { email: "Invalid Email Address *" })
      }
    }
    resolve(data.apiJsonError)
  }))

  return MyPromiss;
}
