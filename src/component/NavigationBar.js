import { Link } from "react-router-dom";
import "../CSS/NavigationBar.css";
import logo from "../images/bizLogo.jpg";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../i18n/config";
import { languageActions } from "../store/language-slice";
import { useEffect, useState } from "react";
import ReactFlagsSelect, { It } from "react-flags-select";
import { FETCH_USER, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";

const MainNavigation = () => {
  const { sendRequest: fetchUserApi, isLoading, error } = useHttp();
  const name = useSelector((state) => state.event.eventName);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const [username, setUsername] = useState();

  const handleLanguageChange = (language) => {
    dispatch(languageActions.setLanguage(language.toLowerCase()));
  };

  function fetch_user(){
    fetchUserApi(
      {
          url: FETCH_USER,
          method: POST_METHOD,
          body: {
              id: localStorage.getItem("uid")
          },
      },
      (response) => {
        setUsername(response.data.user_name);
      }
    );
  }

  function signout(){
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
        <div className="menu-user-action" onClick={signout} id="menu-user-action">
          {
            username && "LOGOUT"
          }
        </div>
      </div>
      {/* <span className={classes.logo}>{name}</span> */}
      {/* <div>
        <select
          id="dropdown"
          className={classes.dropdown_custom}
          onChange={handleLanguageChange}
          value={language}
        >
          <option value="en">EN</option>
          <option value="it">IT</option>
        </select>
      </div> */}

      {/*<div>
        <ReactFlagsSelect
          className={classes.dropdown_custom1}
          selectButtonClassName={classes.dropdown_custom1}
          countries={["IT", "US"]}
          onSelect={handleLanguageChange}
          selected={language.toUpperCase()}
          showOptionLabel={false}
          showSelectedLabel={false}
          // placeholder={
          //   <div className={classes.dropdown_custom}>
          //     <It />
          //   </div>
          // }
        />
      </div>
    */}
    </header>
  );
};

export default MainNavigation;
