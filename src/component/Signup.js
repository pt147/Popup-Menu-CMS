import React, { useState } from "react";
import "../CSS/loginPage.css";
import "../CSS/otpComponent.css";
import { REGISTER, GETLEGALVERSIONS, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import logo from "../images/popupLogo.png";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { OTPView } from "../component/OTP";

const SignupView = ({ onSuccess }) => {
  const {
    sendRequest: signupAPI,
    sendRequest: getLegalVersionsAPI,
    isLoading,
    error,
  } = useHttp();
  const [phoneNumber, setPhoneNumber] = useState();
  const [termsVersion, setTermsVersion] = useState();
  const [privacyVersion, setPrivacyVersion] = useState();

  function signup_close() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
  }

  function gotoOTP() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signup-otp-container").style.display = "block";
  }

  async function sign_up() {
    const first_name = document
      .getElementById("signup-first_name")
      .value.trim();
    const last_name = document.getElementById("signup-last_name").value.trim();
    const user_name = document.getElementById("signup-user_name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm_password = document
      .getElementById("signup-confirm_password")
      .value.trim();
    const accept_terms_and_conditions =
      document.getElementById("signup-terms").checked;
    const accept_privacy_policy =
      document.getElementById("signup-privacy").checked;
    if (
      accept_terms_and_conditions &&
      accept_privacy_policy &&
      password === confirm_password
    ) {
      const res = await axios.get("https://geolocation-db.com/json/");
      const IPv4 = res.data.IPv4;
      if (phoneNumber.charAt(0) === "+") {
        setPhoneNumber(phoneNumber.substring(1));
      }
      const datetime = new Date().toISOString();

      await getLegalVersionsAPI(
        {
          url: GETLEGALVERSIONS,
          method: POST_METHOD,
          body: {
            content_type: "privacy_policy",
          },
        },
        (response) => {
          setPrivacyVersion(response.data.version);
        }
      );
      signupAPI(
        {
          url: REGISTER,
          method: POST_METHOD,
          body: {
            first_name: first_name,
            last_name: last_name,
            user_name: user_name,
            first_name: first_name,
            mobile_number: phoneNumber,
            email: email,
            password: password,
            confirm_password: confirm_password,
            accepted_terms_and_conditions: datetime,
            privacy_policy_version: 1,
            login_type: "Normal",
            ip_address: IPv4,
          },
        },
        (response) => {
          if (response.code === 200) {
            localStorage.setItem("uid", response.data.id);
            signup_close();
            onSuccess();
          } else {
            alert("Dati errati");
          }
        }
      );
    } else {
      alert(
        "È necessario accettare i Termini e le Condizioni e la Privacy Policy"
      );
    }
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="sign-container" id="signup-container">
        <div className="login-container">
          <div className="login-close-button" onClick={signup_close}>
            x
          </div>
          <img src={logo} className="login-image" />
          <div className="login-title">Registrati</div>
          <input
            type="text"
            id="signup-first_name"
            className="login-input"
            placeholder="Nome"
          />
          <input
            type="text"
            id="signup-last_name"
            className="login-input"
            placeholder="Cognome"
          />
          <input
            type="text"
            id="signup-user_name"
            className="login-input"
            placeholder="Username"
          />
          <PhoneInput
            placeholder="Telefono"
            value={phoneNumber}
            onChange={setPhoneNumber}
            id="mobile_number"
            className="login-input"
          />
          <input
            type="text"
            id="signup-email"
            className="login-input"
            placeholder="Email"
          />
          <input
            type="password"
            id="signup-password"
            className="login-input"
            placeholder="Password"
          />
          <input
            type="password"
            id="signup-confirm_password"
            className="login-input"
            placeholder="Conferma Password"
          />
          <input
            type="checkbox"
            id="signup-terms"
            className="login-input login-checkbox"
          />
          <div className="login-terms">
            Accetto i{" "}
            <a
              href="https://subscribe.popup.lol/termsandconditions"
              target="new"
            >
              Termini e le Condizioni
            </a>
          </div>
          <input
            type="checkbox"
            id="signup-privacy"
            className="login-input login-checkbox"
          />
          <div className="login-terms">
            Accetto la{" "}
            <a href="https://subscribe.popup.lol/privacy" target="new">
              Privacy Policy
            </a>
          </div>
          <button className="login-button" onClick={gotoOTP}>
            Registrati
          </button>
          <div className="login-othersignin-label">Oppure entra con</div>
          <div className="login-notaccount-container">
            <div className="login-notaccount-label">Hai già un account?</div>
            <div className="login-notaccount-link" onClick={signup_close}>
              Entra
            </div>
          </div>
        </div>
      </div>

      <div id="signup-otp-container" style={{ display: "none" }}>
        <OTPView
          page={"signup"}
          mobile_number={phoneNumber}
          onSuccess={sign_up}
        />
      </div>
    </div>
  );
};

export { SignupView };
