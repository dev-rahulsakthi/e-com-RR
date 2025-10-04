// "use server";
// import Networking from "@/src/app/utils/common/api/api-access";
// import { Url } from "@/src/app/utils/common/api/url";
// import {decrypt,encrypt,isNotEmpty,} from "@/src/app/utils/common/common-function/common-function";
// import { getCookie } from "@/src/app/utils/common/common-function/cookies-function";
// import { Labels } from "@/src/app/utils/constants/labels";
// import { Params } from "next/dist/server/request/params";
// import { cookies } from "next/headers";

// export async function userClickMenu(data : any) {
//   try {
//     let encyptedData = await getCookie("userDetails");
//     let jsonParsedData = JSON.parse(encyptedData);
//     let decryptUserID = decrypt(jsonParsedData.userID);
//     let payload = {
//         menuLink:data.menuLink,
//         userID:decryptUserID
//     }
//     let response = await Networking.PostJsonApi(Url.userMenu,JSON.stringify(payload));
//     if (isNotEmpty(response)) {
//         if(response?.status == Labels.success){
//             return{status:response.status,message:response.message}
//         }
//         else{
//             return{status:Labels.failed,message:Labels.pleaseTryAgainSomeTime}
//         }
//     }
//     else{
//         return{status:Labels.failed,message:Labels.pleaseTryAgainSomeTime}
//     }
//   } catch (error) {
//     return {
//       status: Labels.failed,
//       message: Labels.pleaseTryAgainSomeTime,
//     };
//   }
// }