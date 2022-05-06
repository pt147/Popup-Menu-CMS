import React, { cloneElement, useEffect, useState } from "react";
import "../CSS/loginPage.css";
import "../CSS/otpComponent.css";
import { LOGIN, SUBEVENTTICKETS, ATTENDEVENT, POST_METHOD, GET_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import logo from '../images/popupLogo.png';
import google_icon from '../images/google_icon.png';
import facebook_icon from '../images/facebook_icon.png';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';
import { SignupView } from '../component/Signup';
import { ForgotPasswordView } from '../component/ForgotPassword';
import { OTPView } from '../component/OTP';

const LoginView = ({
    isOTPRequired,
    onSuccess
}) => {
    const { sendRequest: login, isLoading, error } = useHttp();

    function login_close(){
        document.getElementById("signin-container").style.display = "none";
        document.getElementById("normal-container").style.display = "block";
    }

    function show_signup(){
        document.getElementById("signin-container").style.display = "none";
        document.getElementById("signup-container").style.display = "block";
    }

    function forgot_password(){
        document.getElementById("signin-container").style.display = "none";
        document.getElementById("fp-container").style.display = "block";
    }

    function signin(){
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(
            {
                url: LOGIN,
                method: POST_METHOD,
                body: {
                    email: email,
                    password: password,
                    login_type: "Normal"
                },
            },
            (response) => {
                if (response.code === 200){
                    localStorage.setItem("uid", response.data.id);
                    document.getElementById("menu-user-name").innerHTML = response.data.user_name;
                    document.getElementById("menu-user-action").innerHTML = "LOGOUT";
                    if (isOTPRequired){
                        document.getElementById("signin-otp-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                    }else{
                        document.getElementById("normal-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                        onSuccess();
                    }
                }else{
                    alert("Dati errati");
                }
            },
            (error) => {
                alert(error);
            }
        );
    }

    const responseGoogle = async (response) => {
        const googleId = response.googleId;
        const res = await axios.get('https://geolocation-db.com/json/');
        const IPv4 = res.data.IPv4;
        login(
            {
                url: LOGIN,
                method: POST_METHOD,
                body: {
                    social_id: googleId,
                    login_type: "Social",
                    ip_address: IPv4
                },
            },
            (response) => {
                if (response.code === 200){
                    localStorage.setItem("uid", response.data.id);
                    document.getElementById("menu-user-name").innerHTML = response.data.user_name;
                    document.getElementById("menu-user-action").innerHTML = "LOGOUT";
                    if (isOTPRequired){
                        document.getElementById("signin-otp-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                    }else{
                        document.getElementById("normal-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                        onSuccess();
                    }
                }else{
                    alert("Dati errati");
                }
            }
        );
    }
    
    const responseFacebook = async (response) => {
        console.log(response); //TODO: delete row
        const facebookId = ""; //TODO: here goes the response. value relative to the userId -> should be something like userId or facebookId or fbId
        const res = await axios.get('https://geolocation-db.com/json/');
        const IPv4 = res.data.IPv4;
        login(
            {
                url: LOGIN,
                method: POST_METHOD,
                body: {
                    social_id: facebookId,
                    login_type: "Social",
                    ip_address: IPv4
                },
            },
            (response) => {
                if (response.code === 200){
                    localStorage.setItem("uid", response.data.id);
                    document.getElementById("menu-user-name").innerHTML = response.data.user_name;
                    document.getElementById("menu-user-action").innerHTML = "LOGOUT";
                    if (isOTPRequired){
                        document.getElementById("signin-otp-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                    }else{
                        document.getElementById("normal-container").style.display = "block";
                        document.getElementById("signin-container").style.display = "none";
                        onSuccess();
                    }
                }else{
                    alert("Dati errati");
                }
            }
        );
    }
    
    const componentClicked = (response) => {
        console.log(response);
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
        <div className="sign-container" id="signin-container">
            <div className="login-container">
                <div className="login-close-button" onClick={login_close}>
                    x
                </div>
                <img src={logo} className="login-image" />
                <div className="login-title">Sign in</div>
                <input type="text" id="email" className="login-input" placeholder="Email" />
                <input type="password" id="password" className="login-input" placeholder="Password" />
                <div href="" className="login-forgotpassword" onClick={forgot_password} >Password dimenticata?</div>
                <button className="login-button" onClick={signin}>Sign in</button>
                <div className="login-othersignin-label">Oppure puoi</div>
                <div className="login-othersignin-container">
                    {/*<div className="login-othersingin-content">*/}
                        <GoogleLogin
                            clientId="373181691687-o0tcpvcl5ea34nas8dfbq7dcv8p0m66n.apps.googleusercontent.com"
                            render={renderProps => (
                                <div className="login-othersignin-circle" onClick={renderProps.onClick}>
                                    <img className="login-othersignin-image" src={google_icon}/>
                                </div>
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            //isSignedIn={true}
                        />
                    {/*</div>
                    <div className="login-othersingin-content">*/}
                        <FacebookLogin
                            appId="163256705754395" //TODO: substitute with the new appId
                            fields="userID,name,email,picture"
                            onClick={componentClicked}
                            callback={responseFacebook} 
                            render={renderProps => (
                                <div className="login-othersignin-circle" onClick={renderProps.onClick}>
                                    <img className="login-othersignin-image" src={facebook_icon}/>
                                </div>
                            )}
                        />
                    {/*</div>*/}
                </div>
                <div className="login-notaccount-container">
                    <div className="login-notaccount-label">Non hai un account?</div>
                    <div className="login-notaccount-link" onClick={show_signup}>Registrati</div>
                </div>
            </div>
        </div>
            <SignupView
                onSuccess={onSuccess} />
            <ForgotPasswordView />
            <div id="signin-otp-container" style={{display: "none"}}>
            <OTPView
                page={"signin"}
                mobile_number={null}
                onSuccess={onSuccess} />
            </div>
        </div>
    );
};

export {LoginView};
