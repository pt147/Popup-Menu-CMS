import "../CSS/NavigationBar.css";
import logo from "../images/bizLogo.jpg";
import { useEffect, useState } from "react";
import { FETCH_USER, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";

const MainNavigation = () => {
  const { sendRequest: fetchUserApi } = useHttp();
  const [username, setUsername] = useState();

  function fetch_user() {
    fetchUserApi(
      {
        url: FETCH_USER,
        method: POST_METHOD,
        body: {
          id: localStorage.getItem("uid"),
        },
      },
      (response) => {
        setUsername(response.data.user_name);
      }
    );
  }

  function signout() {
    localStorage.setItem("uid", "");
    window.location.reload();
  }

  useEffect(() => {
    fetch_user();
  }, []);

  return (
    <header className="menu-container">
      <img className="menu-logo" src={logo} alt="Logo" />
      <div className="menu-user-container">
        <div className="menu-user-name" id="menu-user-name">
          {username && username}
        </div>
        <div
          className="menu-user-action"
          onClick={signout}
          id="menu-user-action"
        >
          {username && "LOGOUT"}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
