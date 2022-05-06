import React, { useEffect, useState } from "react";
import moment from 'moment'
import "../CSS/subeventbookingCheckoutPage.css";
import "../CSS/otpComponent.css";
import "../CSS/loginPage.css";
import { EVENTDETAIL, SUBEVENTDETAIL, SUBEVENTTICKETS, ATTENDEVENT, FETCH_COLOR_SETTINGS, GET_CLIENT_SECRET_KEY, CREATE_COSTUMER, GET_METHOD, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";
import { OTPView } from "../component/OTP";
import { LoginView } from "../component/Login";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { STRIPE_KEY } from "../apis/apis";
import { PaymentView } from "../component/Payment";

function SubEventBookingCheckout() {
    const { sendRequest: getEventDetailsApi, sendRequest: getSubEventDetailsApi, sendRequest: getSubEventTicketsApi, sendRequest: getTicketsApi, sendRequest: getClientSecretKeyApi, sendRequest: createCostumerApi, sendRequest: fetchColorSettingsAPI, isLoading, error } = useHttp();
    const { eventId } = useParams();
    const arrayId = eventId.split("-");
    const [event, setEvent] = useState();
    const [subevent, setSubevent] = useState();
    const [tickets, setTickets] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const stripePromise = loadStripe(STRIPE_KEY);

    const getTicketsDetails = () => {
        fetchColorSettingsAPI(
            {
                url: FETCH_COLOR_SETTINGS + "/" + arrayId[0].trim(),
                method: GET_METHOD
            },
            (response) => {
                document.body.style.backgroundColor = response.data.bgMenuColor;
                document.body.style.fontFamily = response.data.fontFamily;
            }
        );
        getEventDetailsApi(
            {
                url: EVENTDETAIL,
                method: POST_METHOD,
                body: {
                    user_id: 22,
                    id: arrayId[0].trim(),
                },
            },
            (response) => {
                setEvent(response.data);
            }
        );
        getSubEventDetailsApi(
            {
                url: SUBEVENTDETAIL + "/" + arrayId[0].trim(),
                method: GET_METHOD,
            },
            (response) => {
                const subevents = response.data;
                subevents.forEach(subevent => {
                    const subeventId = Number(arrayId[1].trim());
                    if (subevent.subEventId === subeventId){
                        setSubevent(subevent);
                    }
                });
            }
        );
        getSubEventTicketsApi(
            {
                url: SUBEVENTTICKETS + "/" + arrayId[1].trim(),
                method: GET_METHOD
            },
            (response) => {
                const all_tickets = response.data[0].tickets;
                const to_buy_tickets = [];
                var price = 0;
                for (let i = 2; i < arrayId.length; i = i+2) {
                    const ticket_amount = arrayId[i+1];
                    if (ticket_amount > 0){
                        const ticket_id = arrayId[i];
                        const ticket = all_tickets.find(ticket => {
                            return Number(ticket.id) === Number(ticket_id);
                        });
                        const ticket_struct = {
                            ticket: ticket,
                            amount: ticket_amount
                        }
                        price += Number(Number(ticket_amount) * Number(ticket.price));
                        to_buy_tickets.push(ticket_struct);
                    }
                }
                setTotalPrice(price);
                setTickets(to_buy_tickets);
            }
        )
    };

    function getTickets(isCash){
        const uid = localStorage.getItem("uid");
        var parameters = "";
        arrayId.forEach(item => {
            parameters = parameters + item + "-";
        });
        if (uid === "" || uid == null || uid < 0){
            document.getElementById("signin-container").style.display = "block";
            document.getElementById("normal-container").style.display = "none";
        }else{
            //document.getElementById("otp-container").style.display = "block";
            /*document.getElementById("normal-otp-container").style.display = "block";
            document.getElementById("normal-container").style.display = "none";*/
            helper(isCash);
        }
    }

    function helper(isCash){
        if (isCash){
            attendEvent();
        }else{
            openPaymentView();
        }
    }

    function openPaymentView(){
        document.getElementById("stripe-container").style.display = "block";
    }

    function attendEvent() {
        const datetime = new Date().toISOString();
        const api_tickets = [];
        tickets.forEach(ticket => {
            const api_ticket = {
                id: ticket.ticket.id,
                quantity: ticket.amount
            }
            api_tickets.push(api_ticket);
        });
        const description = document.getElementById("menu-checkout-instructions").value;
        getTicketsApi(
            {
                url: ATTENDEVENT,
                method: POST_METHOD,
                body: {
                    id: arrayId[0].trim(),
                    user_id: localStorage.getItem("uid"),
                    joining_date: datetime,
                    price: totalPrice,
                    tickets: api_tickets,
                    description: description
                },
            },
            (response) => {
                var isHostConfirmationNeeded = false;
                tickets.forEach(ticket => {
                    if (ticket.ticket.isHostConfirmationNeeded){
                        isHostConfirmationNeeded = true;
                    }
                });
                if (isHostConfirmationNeeded){
                    alert("Richiesta per i biglietti eseguita con successo");
                }else{
                    alert("Biglietti prenotati con successo");
                }
                window.location.reload();
            }
        );
    }
    
    const cardElementOptions = {
        hidePostalCode: true
    };

    useEffect(() => {
        getTicketsDetails();
    }, []);

    return (
        <div style={{width: "100%", height: "100%", marginBottom: "150px"}}>
        <div className="subevent-booking-checkout-container" id="normal-container">
            <div className="subevent-booking-checkout-event-container">
                <img src={event && event.images[0].banner_url} className="subevent-booking-checkout-event-image" />
                <div className="subevent-booking-checkout-event-title">
                    {event && event.title}
                </div>
                {/*<div className="subevent-booking-checkout-event-address">
                    {event && event.address}
                </div>*/}
            </div>
            <div className="subevent-booking-checkout-descriptions-container">
                <div className="subevent-booking-checkout-subevent-description">
                    {subevent && moment(subevent.subEventStartDate).format('DD MM YYYY')} - {subevent && moment(subevent.subEventFromTime, "HH:mm:ss").format('HH:mm')} - {subevent && moment(subevent.subEventToTime, "HH:mm:ss").format('HH:mm')}
                </div>
                <div className="subevent-booking-checkout-event-description">
                    {event && event.description}
                </div>
            </div>
            <div className="subevent-booking-checkout-tickets-container">
                {
                    tickets &&
                    tickets.map(ticket => {
                        return (
                            <div className="subevent-booking-checkout-ticket-container" key="ticket.ticket.id">
                                <div className="subevent-booking-checkout-ticket-title">
                                    {ticket && ticket.amount} x {ticket && ticket.ticket.ticketName}
                                </div>
                                {/*<div className="subevent-booking-checkout-ticket-amount">
                                    
                                </div>  */}
                                <div className="subevent-booking-checkout-ticket-price">
                                    € {ticket && (Math.round(ticket.ticket.price * ticket.amount * 100) / 100).toFixed(2)}
                                </div>
                                <hr className="subevent-booking-checkout-ticket-separator" />  
                            </div>
                        );
                    })
                }
                <div className="subevent-booking-checkout-ticket-container">
                    <div className="subevent-booking-checkout-ticket-title" style={{fontWeight: "500"}}>
                        Totale
                    </div>
                    <div className="subevent-booking-checkout-ticket-amount" style={{fontWeight: "500"}}>
                        € {(Math.round(totalPrice * 100) / 100).toFixed(2)}
                    </div>
                    <hr className="subevent-booking-checkout-ticket-separator" />  
                </div>
            </div>
            <div className="menu-checkout-withdrawal-container">
                <textarea className="menu-checkout-instructions" id="menu-checkout-instructions" placeholder="Aggiungi delle istruzioni...">
                </textarea>
            </div>
            {
                totalPrice > 0 &&
                <div>
                    <button className="subevent-booking-checkout-confirm-button subevent-booking-checkout-confirm-middable-button" onClick={() => getTickets(true)}>
                        Conferma e paga in Contanti
                    </button>
                    <button className="subevent-booking-checkout-confirm-button subevent-booking-checkout-confirm-middable-button" onClick={() => getTickets(false)}>
                        { 
                            isPaymentProcessing ? "Pagamento in corso..." : "Conferma e paga con Carta"
                        }
                    </button>
                    <div id="stripe-container" style={{display: "none"}}>
                        <Elements 
                            stripe={stripePromise}
                            options={cardElementOptions} >
                            <div className="payment-container">
                                <PaymentView 
                                    onSuccess={attendEvent}
                                    price={(Math.round(totalPrice * 100) / 100).toFixed(2)} />
                            </div>
                        </Elements>
                    </div>
                </div>
            }
            {
                totalPrice === 0 &&
                <div>
                    <button className="subevent-booking-checkout-confirm-button" onClick={() => getTickets(true)}>
                        Conferma
                    </button>
                </div>
            }
        </div>
        <LoginView 
            isOTPRequired={false}
            onSuccess={helper} />
        {
            arrayId[0].trim() && tickets && attendEvent &&
            <div id="normal-otp-container" style={{display: "none"}}>
                <OTPView
                    page={"normal"}
                    id={"otp-view"}
                    mobile_number={null}
                    onSuccess={helper}
                />
            </div>
        }
        </div>
    );
}

export default SubEventBookingCheckout;