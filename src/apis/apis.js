import { POST_METHOD, PUT_METHOD } from "./apiHelper";

const BASE_URL = "https://api.popup.lol/";
//When given to client
//const BASE_URL = "http://api-preprod.popup.lol/";

export const CHAT_PATH = "Popup/Development/";

export const RESULT_OK = "OK";
export const RESULT_ERROR = "ERROR";
export const RESULT_INVALID_CODE = "InvalidExternalStatusCode";
export const UNAUTHORIZED = "UNAUTHORIZED";
export const STRIPE_KEY = "pk_live_51HwUlaA67jZ6i4HKl4HgoUS2fhgOipgYsL7nxmSX8HR3oyHqRXOld1lKsSzaiBxV8g22Es1jnw8i8wNZoxUtG94H00RVFrrAVI";
//export const STRIPE_KEY = "pk_test_51HwUlaA67jZ6i4HKHDu5m8bxn1nSCpO60yRoZoKl6BdMdkLsJ3dYzYmA5bFWvsja5fp4EHb6QnyclBKRlV1UIErj00bi7WAcJE";

export const api = async (
  url,
  method,
  body = null,
  headers = {},
  controller = null
) => {
  try {
    let endPoint = BASE_URL.concat(url);

    console.log("Headers :", headers);

    console.log("Request To: ", endPoint);

    console.log("Parameter : ", body);

    const reqBody = body ? JSON.stringify(body) : null;

    var fetchParams = { method, headers };

    if ((method === POST_METHOD || method === PUT_METHOD) && !reqBody) {
      throw new Error("Request body required");
    }

    if (reqBody) {
      fetchParams.headers["Content-type"] = "application/json";

      fetchParams.body = reqBody;
    }

    if (controller != null) {
      fetchParams.signal = controller;
    }

    const fetchPromise = fetch(endPoint, fetchParams);

    const timeOutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          status: RESULT_ERROR,
          message: "Request_timeout",
        });
      }, 60000);
    });

    const response = await Promise.race([fetchPromise, timeOutPromise]);

    return response;
  } catch (e) {
    return e;
  }
};

export const fetchApi = async (url, method, body, controller = null) => {
  try {
    // let state = NetInfo.useNetInfo()

    const error = {};

    // if (state.isConnected) {
    const headers = {};
    
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwic2NvcGVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJqdGkiOiI2IiwiaXNzIjoiUG9wVXAiLCJpYXQiOjE2NDYwNzYzMjAsImV4cCI6NDgwMTY4MDAwMH0.Eyim58rkO30TfpIpQpv-EIl00_5kt4NczVuMBTnABzQ";
    //const token = localStorage.getItem("token");

    if (token !== null) {
      headers["api-key"] = token;
    }

    const response = await api(url, method, body, headers, controller);

    let responseBody;

    try {
      const responseText = await response.text();

      responseBody = JSON.parse(responseText);
    } catch (e) {
      responseBody = response;
    }

    if (response.status === 200) {
      responseBody.status = RESULT_OK;
      responseBody.code = 200;

      console.log("Response :", JSON.stringify(responseBody));

      return responseBody;
    } else if (response.status === 204) {
      error.status = RESULT_ERROR;
      error.message = "NO_DATA";
      error.code = 204;
      error.url = url;
      throw error;
    }

    console.log("Problem Cause ", responseBody);

    try {
      let message =
        responseBody.message === undefined
          ? "Something_went_wrong"
          : responseBody.message;

      error.code = response.status;
      error.message = message;
      if (message.includes("userId") || message.includes("JWT expired")) {
        error.code = 700;
        error.message = "sessionExpire";
      }

      error.status = RESULT_ERROR;

      error.url = url;
    } catch (error) {
      error.status = RESULT_ERROR;
      error.url = url;
      error.message = "Something_went_wrong";
    }

    throw error;
    // } else {
    //     error.status = RESULT_ERROR
    //     error.url = url
    //     error.message = translate('No_internet')
    // }

    // throw error;
  } catch (error) {
      console.log("Error :", error);
    return error;
  }
};
