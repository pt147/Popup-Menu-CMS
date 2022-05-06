import React, { useEffect, useState } from "react";
import moment from 'moment'
import "../CSS/subeventbookingCheckoutPage.css";
import "../CSS/otpComponent.css";
import "../CSS/loginPage.css";
import "../CSS/menuCheckoutPage.css";
import { EVENTDETAIL, SUBEVENTDETAIL, FETCH_ORDERS, ADD_USER_ORDER, FETCH_COLOR_SETTINGS, GET_METHOD, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";
import { OTPView } from "../component/OTP";
import { LoginView } from "../component/Login";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { STRIPE_KEY } from "../apis/apis";
import { PaymentView } from "../component/Payment";

function WebMenuCheckout() {
    const { sendRequest: getEventDetailsApi, sendRequest: getSubEventDetailsApi, sendRequest: getMenuApi, sendRequest: addUserOrderApi, sendRequest: getClientSecretKeyApi, sendRequest: createCostumerApi, sendRequest: fetchColorSettingsAPI, isLoading, error } = useHttp();
    const { eventId } = useParams();
    const arrayId = eventId.split("-");
    const [event, setEvent] = useState();
    const [subevent, setSubevent] = useState();
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [withdrawalTypes, setWithdrawalTypes] = useState([]);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const stripePromise = loadStripe(STRIPE_KEY);

    const getMenuDetails = () => {
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
                setPaymentMethods(response.data.event_payment_methods);
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
        getMenuApi(
            {
                url: FETCH_ORDERS,
                method: POST_METHOD,
                body: {
                  //event_id: 248,
                  event_id: arrayId[0].trim(),
                },
            },
            (response) => {
                const all_items = response.data.items;
                const to_buy_items = [];
                var price = 0;
                for (let i = 1; i < arrayId.length; i = i+2) {
                    const item_quantity = arrayId[i+1];
                    if (item_quantity > 0){
                        const item_id = arrayId[i];
                        const my_item = all_items.find(item => {
                            return Number(item.id) === Number(item_id);
                        });
                        const item_struct = {
                            item: my_item,
                            quantity: item_quantity
                        }
                        price += Number(Number(item_quantity) * Number(my_item.price));
                        to_buy_items.push(item_struct);
                    }
                }
                setTotalPrice(price);
                setItems(to_buy_items);
                getWithdrawalTypes();
            }
        )
    };

    function prepare_order(isCash){
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

    function getWithdrawalTypes(){
        var orderWithdrawTypes = ["serveAtTable", "counter"];
        items.forEach(item => {
            orderWithdrawTypes = orderWithdrawTypes.filter(orderWithdrawType => item.item.orderWithdrawTypes.includes(orderWithdrawType));
        });
        setWithdrawalTypes(orderWithdrawTypes);
    }

    function helper(isCash){
        if (isCash){
            attendEvent(isCash);
        }else{
            openPaymentView();
        }
    }

    function openPaymentView(){
        document.getElementById("stripe-container").style.display = "block";
    }

    function attendEvent(isCash) {
        var withdrawalType = "";
        var tableNumber = "";
        const instructions = document.getElementById("menu-checkout-instructions").value;
        if (withdrawalTypes.length > 1){
            const radios = document.getElementsByClassName("menu-checkout-withdrawal");
            for(let i = 0; i < radios.length; i++) {
                if(radios[i].type="radio") {
                    if(radios[i].checked)
                        withdrawalType = radios[i].id;
                }
            }
        }else{
            withdrawalType = withdrawalTypes[0];
        }
        if (withdrawalType === "serveAtTable"){
            tableNumber = document.getElementById("menu-checkout-withdrawal-table").value;
        }
        const user_orders = [];
        items.forEach(item => {
            const user_order = {
                event_menu_id: item.item.id,
                quantity: item.quantity
            }
            user_orders.push(user_order);
        });
        addUserOrderApi(
            {
                url: ADD_USER_ORDER,
                method: POST_METHOD,
                body: {
                    user_id: 10,//localStorage.getItem("uid"),
                    user_orders: user_orders,
                    price: totalPrice,
                    event_id: arrayId[0].trim(),
                    table_name: tableNumber,
                    instructions: instructions,
                    payment_method: isCash ? "Cash" : "Digital",
                    withdrawalMode: withdrawalType
                }
            },(response) => {
                console.log(response);
                if (response.data.orderConfiramtionRequired){
                    alert("Ordine inviato correttamente");
                }else{
                    alert("Ordine effettuato correttamente");
                }
                window.location.reload();
            }
        )
        /*const datetime = new Date().toISOString();
        const api_tickets = [];
        tickets.forEach(ticket => {
            const api_ticket = {
                id: ticket.ticket.id,
                quantity: ticket.amount
            }
            api_tickets.push(api_ticket);
        });
        getTicketsApi(
            {
                url: ATTENDEVENT,
                method: POST_METHOD,
                body: {
                    id: arrayId[0].trim(),
                    user_id: localStorage.getItem("uid"),
                    joining_date: datetime,
                    price: totalPrice,
                    tickets: api_tickets
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
        );*/
    }
    
    const cardElementOptions = {
        hidePostalCode: true
    };

    useEffect(() => {
        getMenuDetails();
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
                    items &&
                    items.map(item => {
                        return (
                            <div className="subevent-booking-checkout-ticket-container" key="ticket.ticket.id">
                                <div className="subevent-booking-checkout-ticket-title">
                                    {item.item && item.quantity} x {item && item.item.title}
                                </div>
                                {/*<div className="subevent-booking-checkout-ticket-amount">
                                    
                                </div>  */}
                                <div className="subevent-booking-checkout-ticket-price">
                                    € {item && (Math.round(item.item.price * item.quantity * 100) / 100).toFixed(2)}
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

            {
                totalPrice >= 0 && withdrawalTypes.length > 1 &&
                <div className="menu-checkout-withdrawal-container">
                    <fieldset id="fieldset">
                    {
                        withdrawalTypes.map(withdrawalType => {
                            switch (withdrawalType){
                                case "serveAtTable":
                                    return (
                                    <div>
                                        <input type="radio" id="serveAtTable" className="menu-checkout-withdrawal" name="fieldset" /> 
                                        <label className="menu-checkout-withdrawal-label">Servizio al Tavolo</label>
                                        <input type="text" placeholder="N° Tavolo" className="menu-checkout-withdrawal-label" id="menu-checkout-withdrawal-table" />
                                    </div>
                                    );
                                case "counter":
                                    return (
                                    <div>
                                        <input type="radio" id="counter" className="menu-checkout-withdrawal" name="fieldset" /> 
                                        <label className="menu-checkout-withdrawal-label">Bancone</label>
                                    </div>
                                    );
                                default: 
                                    return; 
                            }
                        })
                    }
                    </fieldset>
                </div>
            }

            {
                totalPrice > 0 && withdrawalTypes.length == 1 &&
                <div className="menu-checkout-withdrawal-container">
                    {
                        withdrawalTypes.map(withdrawalType => {
                            switch (withdrawalType){
                                case "serveAtTable":
                                    return (
                                        <div>
                                            <label className="menu-checkout-withdrawal-label">Servizio al Tavolo</label>
                                            <input type="text" placeholder="N° Tavolo" className="menu-checkout-withdrawal-label" id="menu-checkout-withdrawal-table" />
                                        </div>
                                    );
                                case "counter":
                                    return (
                                        <label className="menu-checkout-withdrawal-label">Bancone</label>
                                    );
                            }
                        })  
                    }   
                </div>
            }

            <div className="menu-checkout-withdrawal-container">
                <textarea className="menu-checkout-instructions" id="menu-checkout-instructions" placeholder="Aggiungi delle istruzioni...">
                </textarea>
            </div>

            {
                totalPrice > 0 &&
                <div>
                    {
                        paymentMethods.find(pm => pm === "Cash") &&
                        <button className="subevent-booking-checkout-confirm-button subevent-booking-checkout-confirm-middable-button" onClick={() => prepare_order(true)}>
                            Conferma e paga in Contanti
                        </button>
                    }
                    {
                        paymentMethods.find(pm => pm === "Digital") && 
                        <div>
                            <button className="subevent-booking-checkout-confirm-button subevent-booking-checkout-confirm-middable-button" onClick={() => prepare_order(false)}>
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
                                            onSuccess={() => {
                                                attendEvent(false)
                                            }}
                                            price={(Math.round(totalPrice * 100) / 100).toFixed(2)} />
                                    </div>
                                </Elements>
                            </div>
                        </div>
                    }
                </div>
            }
            {
                totalPrice === 0 &&
                <div>
                    <button className="subevent-booking-checkout-confirm-button" onClick={() => prepare_order(true)}>
                        Conferma
                    </button>
                </div>
            }
        </div>
        <LoginView 
            isOTPRequired={false}
            onSuccess={helper} />
        {
            arrayId[0].trim() && items && attendEvent &&
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

export default WebMenuCheckout;