import React, { useState, useEffect, useCallback } from "react";
import { GET_CMS_USERDATA, GET_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  user: {},
  login: (token, expirationTime, user) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");

  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

const retriveStoredUserData = () => {
  const storedUserData = localStorage.getItem("userInfo");
  const newData = JSON.parse(storedUserData);
  return newData;
};

export default AuthContext;

export const AuthContextProvider = (props) => {
  const { sendRequest: getUserProfile } = useHttp();

  const tokenData = retrieveStoredToken();

  const userData = retriveStoredUserData();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  let initialUserData;
  if (userData) {
    initialUserData = userData;
  }

  const [token, setToken] = useState(initialToken);

  const [user, setUser] = useState(initialUserData);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userInfo");
  }, []);

  const loginHandler = (token, expirationTime, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("userInfo", user);

    setToken(token);
    setUser(JSON.parse(user));

    const remainingTime = calculateRemainingTime(expirationTime);
  };

  useEffect(() => {
    if (token) {
      getUserProfile(
        {
          url: GET_CMS_USERDATA,
          method: GET_METHOD,
        },
        (response) => {
          setUser(response.data);
          localStorage.setItem("userInfo", JSON.stringify(response.data));
        }
      );
    }
  }, [token, getUserProfile]);

  // useEffect(() => {
  //   if (tokenData) {
  //     //logoutTimer = setTimeout(logoutHandler, tokenData.duration);
  //   }
  // }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    user: user,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
