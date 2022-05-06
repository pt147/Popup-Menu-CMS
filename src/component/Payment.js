import React, { useEffect, useState } from "react";
import "../CSS/loginPage.css";
import { EVENTDETAIL, SUBEVENTDETAIL, SUBEVENTTICKETS, ATTENDEVENT, GET_CLIENT_SECRET_KEY, CREATE_CUSTOMER, GET_METHOD, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { STRIPE_KEY } from "../apis/apis";
import axios from 'axios';

const PaymentView = ({
    onSuccess,
    price
}) => {
    const { sendRequest: getEventDetailsApi, sendRequest: getSubEventDetailsApi, sendRequest: getSubEventTicketsApi, sendRequest: getTicketsApi, sendRequest: getClientSecretKeyApi, sendRequest: createCustomerApi, isLoading, error } = useHttp();

    const stripePromise = loadStripe(STRIPE_KEY);
    const stripe = useStripe();
    const elements = useElements();

    const cardElementOptions = {
        hidePostalCode: true
    };

    function pay(){
        getClientSecretKeyApi(
            {
                url: GET_CLIENT_SECRET_KEY,
                method: POST_METHOD,
                body: {
                    user_id: localStorage.getItem("uid"),
                },
            },
            async (response) => {
                const clientSecret = response.data;
                const cardElement = elements.getElement(CardElement);

                console.log("Secret: ", response);

                const paymentMethodReq = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement
                });

                console.log("uid: ", localStorage.getItem("uid"))
                console.log("paymentMethod: ", paymentMethodReq);

                /*const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodReq.paymentMethod.id
                });*/

                createCustomerApi(
                    {
                    url: CREATE_CUSTOMER,
                    method: POST_METHOD,
                    body: {
                        user_id: localStorage.getItem("uid"),
                        payment_method_id: paymentMethodReq.paymentMethod.id
                    },
                },
                (response) => {
                    console.log(response);
                    onSuccess();
                }
                );
            }
        );
    }

    return (
        <div style={{width: "100%", height: "100%", float: "left"}}>
          <CardElement
            options={cardElementOptions}
            className="login-input payment-input"
            //onChange={handleCardDetailsChange}
          />
          <button onClick={pay} className="login-button">Paga € {price}</button>
        </div>
    );
};

export {PaymentView};
