// "use server";
// import Networking from "@/src/app/utils/common/api/api-access";
// import { Url } from "@/src/app/utils/common/api/url";
// import {
//   decrypt,
//   encrypt,
//   isNotEmpty,
// } from "@/src/app/utils/common/common-function/common-function";
// import { setCookie } from "@/src/app/utils/common/common-function/cookies-function";
// import { Labels } from "@/src/app/utils/constants/labels";
// import { Params } from "next/dist/server/request/params";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export async function getADLogin(i: any, Params?: Params): Promise<any> {
//   try {
//     const data = {
//       ...Params,
//       LoginID :  decrypt(Params.LoginID),
//     }
//     let response = await Networking.PostLoginApi(Url.adLogin,JSON.stringify(data));
//     if (isNotEmpty(response)) {
//       let MenuList = response?.table1 || [];
//       let userDetails = response?.data || [];

//       if (MenuList.length > 0 && userDetails.length > 0) {
//         let Menu = MenuList.map((i: any) => ({
//           Id: i.ID,
//           Menu: i.MENU,
//           KmisProgName: i.KMISPROGNAME,
//           ParentMenuId: i.PARENTMENUID,
//           SourceLink: i.SOURCELINK,
//           OrderId: i.ORDERID,
//         }));

//         let token = response.token?.toString() ?? "";
//         let sessionID = response.sessionID?.toString() ?? "";

//         const cookieStore = await cookies();
//         cookieStore.set("token", token);
//         cookieStore.set("sessionID", sessionID);
//         cookieStore.set("menu", JSON.stringify(Menu));

//         const encryptedData = {
//           userID:encrypt(userDetails[0]?.USERCODE.toString()),
//           emaidID:encrypt(userDetails[0]?.EMAILID.toString()),
//           userName:encrypt(userDetails[0]?.USERNAME.toString()),
//         }
//         await setCookie("userDetails",JSON.stringify(encryptedData));
//       }
//     }

//     // Return status & message
//     return {
//       status: response?.status ?? "F",
//       message: response?.message ?? "Please try again later",
//     };
//   } catch (error) {
//     return {
//       status: Labels.failed,
//       message: Labels.pleaseTryAgainSomeTime,
//     };
//   }
// }

// export async function adLogout(): Promise<void> {
//   const cookieStore = await cookies();
//   cookieStore.delete("token");
//   cookieStore.delete("sessionID");
//   cookieStore.delete("userID");
//   cookieStore.delete("emailID");
//   cookieStore.delete("userName");

//   redirect("/ui/login");
// }
