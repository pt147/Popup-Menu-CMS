import React, { useState } from "react";
import "../CSS/loginPage.css";
import "../CSS/otpComponent.css";
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  POST_METHOD,
} from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import logo from "../images/popupLogo.png";
import { OTPView } from "../component/OTP";

const ForgotPasswordView = ({}) => {
  const { sendRequest: forgotPasswordAPI, sendRequest: resetPasswordAPI } =
    useHttp();
  const [phoneNumber, setPhoneNumber] = useState();

  function fp_close() {
    document.getElementById("fp-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
  }

  function gotoResetPassword() {
    const email = document.getElementById("fp-email").value.trim();
    const password = document.getElementById("fp-password").value.trim();
    const confirm_password = document
      .getElementById("fp-confirm-password")
      .value.trim();
    if (password === confirm_password) {
      resetPasswordAPI(
        {
          url: RESET_PASSWORD,
          method: POST_METHOD,
          body: {
            email: email,
            mobile_number: phoneNumber,
            password: password,
          },
        },
        (response) => {
          if (response.code === 200) {
            alert("Password aggiornata correttamente");
          }
        }
      );
    } else {
      alert("Le password non corrispondono");
    }
  }

  function forgotPassword() {
    const email = document.getElementById("fp-email").value.trim();
    forgotPasswordAPI(
      {
        url: FORGOT_PASSWORD,
        method: POST_METHOD,
        body: {
          email: email,
        },
      },
      (response) => {
        if (response.code === 200) {
          setPhoneNumber(response.data.mobile_number);
          document.getElementById("fp-container").style.display = "none";
          document.getElementById("fp-otp-container").style.display = "block";
        } else {
          alert("Dati errati");
        }
      }
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="sign-container" id="fp-container">
        <div className="login-container">
          <div className="login-close-button" onClick={fp_close}>
            x
          </div>
          <img src={logo} className="login-image" />
          <div className="login-title">Recupera la Password</div>
          <input
            type="text"
            id="fp-email"
            className="login-input"
            placeholder="Email"
          />
          <input
            type="password"
            id="fp-password"
            className="login-input"
            placeholder="Nuova Password"
          />
          <input
            type="password"
            id="fp-confirm-password"
            className="login-input"
            placeholder="Conferma Nuova Password"
          />
          <button className="login-button" onClick={forgotPassword}>
            Recupera
          </button>
        </div>
      </div>
      <div id="fp-otp-container" style={{ display: "none" }}>
        <OTPView
          page={"fp"}
          mobile_number={phoneNumber}
          onSuccess={gotoResetPassword}
        />
      </div>
    </div>
  );
};

export { ForgotPasswordView };
