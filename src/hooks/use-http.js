import { useState, useCallback } from "react";
import { fetchApi, RESULT_OK } from "../apis/apis";
import { useDispatch } from "react-redux";
import { loaderAction } from "../store/loader-slice";
import { toast } from "react-toastify";


const useHttp = () => {

  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    dispatch(loaderAction.showLoader())
    setError(null);
    try {
      const response = await fetchApi(
        requestConfig.url,
        requestConfig.method ? requestConfig.method : "GET",
        requestConfig.body ? requestConfig.body : null
      );

      if (response.status !== RESULT_OK) {
         throw new Error(response.message ?? "Something went wrong!")
      }
      setIsLoading(false);
      dispatch(loaderAction.hideLoader())
      applyData(response);
    } catch (err) {
      const ErrorMessage = err.message || "Something went wrong!"
      setError(ErrorMessage);
      toast.error(ErrorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
        dispatch(loaderAction.hideLoader())
        setIsLoading(false);
    }
  }, [dispatch]);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
