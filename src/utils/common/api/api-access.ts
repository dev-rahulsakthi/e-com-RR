import axios from "axios";
import { cookies } from "next/headers";
import { isNotEmpty } from "../common-function/common-function";
import { Labels } from "@/utils/constants";

export default class Networking {
  // JSON POST
  static async PostLoginApi(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      return {
        status: Labels.failed,
        message: Labels.pleaseTryAgainSomeTime,
      };
    }
  }

  static async PostJsonApi(url: string, data: any) {
    try {
      const token = (await cookies()).get("token")?.value;
      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: isNotEmpty(token)?`Bearer ${token}`:"",
        },
      });

      return response.data;
    } catch (error) {
      return {
        status: Labels.failed,
        message: Labels.pleaseTryAgainSomeTime,
      };
    }
  }

  // FORM DATA POST
  static async PostFormDataApi(url: string, formData: any) {
    try {
      const token = (await cookies()).get("token")?.value;
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          Authorization: isNotEmpty(token) ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data", // important for files
        },
      });

      return response.data;
    } catch (error) {
      return {
        status: Labels.failed,
        message: Labels.pleaseTryAgainSomeTime,
      };
    }
  }

  //GET API
  static async GetApi(url: string) {
    try {
      const token = (await cookies()).get("token")?.value;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: isNotEmpty(token) ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      return {
        status: Labels.failed,
        message: Labels.pleaseTryAgainSomeTime,
      };
    }
  }
}
