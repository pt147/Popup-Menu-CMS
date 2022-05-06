import React, { cloneElement, useEffect, useState } from "react";
import "../CSS/loginPage.css";
import "../CSS/otpComponent.css";
import { RESEND_OTP, FETCH_USER, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import logo from '../images/popupLogo.png';

const OTPView = ({
    page,
    mobile_number,
    onSuccess
}) => {
    const { sendRequest: fetch_user, sendRequest: resend_otp, isLoading, error } = useHttp();
    const [OTP, setOTP] = useState();

    function otp_close(){
        document.getElementById("otp-container").style.display = "none";
        switch (page){
            case "normal":
                document.getElementById("normal-otp-container").style.display = "none";
                document.getElementById("normal-container").style.display = "block";
                break;
            case "signin":
                document.getElementById("signin-otp-container").style.display = "none";
                document.getElementById("signin-container").style.display = "block";
                break;
            case "signup":
                document.getElementById("signup-otp-container").style.display = "none";
                document.getElementById("signup-container").style.display = "block";
                break;
            case "fp":
                document.getElementById("fp-otp-container").style.display = "none";
                document.getElementById("fp-container").style.display = "block";
            default:
                break;
        }
    }

    function otp_close_all(){
        document.getElementById("otp-container").style.display = "none";
        switch (page){
            case "normal":
                document.getElementById("normal-otp-container").style.display = "none";
                document.getElementById("normal-container").style.display = "block";
                break;
            case "signin":
                document.getElementById("signin-otp-container").style.display = "none";
                document.getElementById("normal-otp-container").style.display = "none";
                document.getElementById("normal-container").style.display = "block";
                break;
            case "signup":
                document.getElementById("signup-otp-container").style.display = "none";
                document.getElementById("signin-otp-container").style.display = "none";
                document.getElementById("normal-otp-container").style.display = "none";
                document.getElementById("normal-container").style.display = "block";
                break;
            case "fp":
                document.getElementById("fp-otp-container").style.display = "none";
                document.getElementById("signup-otp-container").style.display = "none";
                document.getElementById("signin-otp-container").style.display = "none";
                document.getElementById("normal-otp-container").style.display = "none";
                document.getElementById("normal-container").style.display = "block";
            default:
                break;
        }
    }

    function get_otp(phone_number){
        mobile_number = phone_number;
        if (mobile_number == null){
            fetch_user(
                {
                    url: FETCH_USER,
                    method: POST_METHOD,
                    body: {
                        id: localStorage.getItem("uid")
                    },
                },
                (response) => {
                    resend_otp(
                        {
                            url: RESEND_OTP,
                            method: POST_METHOD,
                            body: {
                                mobile_number: response.data.country_code.toString() + response.data.mobile_number.toString()
                            },
                        },
                        (response) => {
                            setOTP(response.data.otp);
                        }
                    );
                }
            );
        }else{
            resend_otp(
                {
                    url: RESEND_OTP,
                    method: POST_METHOD,
                    body: {
                        mobile_number: mobile_number
                    },
                },
                (response) => {
                    setOTP(response.data.otp);
                }
            );
        }
    }

    function check_otp(){
        const code = document.getElementById("otp-" + page).value;
        if (OTP === code){
            otp_close_all();
            onSuccess();
        }else{
            alert("Codice errato, riprova");
        }
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
        <div className="otp-container" id="otp-container">
            <div className="login-container">
                <div className="login-close-button" onClick={() => otp_close(false)}>
                    x
                </div>
                <img src={logo} className="login-image" />
                <div style={{width: "100%", float: "left"}}>
                <button className="login-button" onClick={() => {get_otp() }}>Invia Codice</button>
                </div>
                <div className="login-title">Inserisci il codice che ti è arrivato per messaggio</div>
                <input type="text" id={"otp-" + page} className="login-input" placeholder="Codice OTP" />
                <button className="login-button" onClick={check_otp}>Convalida & Conferma</button>
            </div>
        </div>
        </div>
    );
};

export {OTPView};
