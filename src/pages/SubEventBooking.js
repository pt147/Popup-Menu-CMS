import React, { useEffect, useState } from "react";
import "../CSS/subeventbookingPage.css";
import {
  SUBEVENTDETAIL,
  SUBEVENTTICKETS,
  FETCH_COLOR_SETTINGS,
  GET_METHOD,
} from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";

function SubEventBooking() {
  const {
    sendRequest: getSubEventDetailsApi,
    sendRequest: getSubEventTicketsApi,
    sendRequest: fetchColorSettingsAPI,
    isLoading,
    error,
  } = useHttp();
  const [subevent, setSubevent] = useState();
  const [tickets, setTickets] = useState();
  const { eventId } = useParams();
  const arrayId = eventId.split("-");
  const [to_buy_tickets, setTo_buy_tickets] = useState();

  const getSubEventDetails = () => {
    fetchColorSettingsAPI(
      {
        url: FETCH_COLOR_SETTINGS + "/" + arrayId[0].trim(),
        method: GET_METHOD,
      },
      (response) => {
        document.body.style.backgroundColor = response.data.bgMenuColor;
        document.body.style.fontFamily = response.data.fontFamily;
      }
    );
    document.getElementById("confirm-button").disabled = true; //TODO: uncomment
    getSubEventDetailsApi(
      {
        url: SUBEVENTDETAIL + "/" + arrayId[0].trim(),
        method: GET_METHOD,
      },
      (response) => {
        const subevents = response.data;
        subevents.forEach((subevent) => {
          const subeventId = Number(arrayId[1].trim());
          if (subevent.subEventId === subeventId) {
            setSubevent(subevent);
          }
        });
      }
    );
    getSubEventTicketsApi(
      {
        url: SUBEVENTTICKETS + "/" + arrayId[1].trim(),
        method: GET_METHOD,
      },
      (response) => {
        setTickets(response.data[0].tickets);
        const my_tickets = [];
        response.data[0].tickets.forEach((ticket) => {
          const to_buy_ticket = {
            ticket: ticket,
            amount: 0,
          };
          my_tickets.push(to_buy_ticket);
        });
        setTo_buy_tickets(my_tickets);
      }
    );
  };

  const updateAmount = (ticket_id, is_add) => {
    const my_ticket = to_buy_tickets.find((ticket) => {
      return ticket.ticket.id === ticket_id;
    });
    if (
      is_add &&
      my_ticket.ticket.quantity > my_ticket.amount &&
      10 > my_ticket.amount
    ) {
      my_ticket.amount++;
    } else if (!is_add && my_ticket.amount > 0) {
      my_ticket.amount--;
    }
    document.getElementById(ticket_id).innerHTML = my_ticket.amount;
    var must_disable = true;
    to_buy_tickets.forEach((ticket) => {
      if (ticket.amount > 0) {
        must_disable = false;
      }
    });
    document.getElementById("confirm-button").disabled = must_disable; //TODO: uncomment
  };

  const gotoCheckout = () => {
    var url = "/Checkout/" + arrayId[0] + "-" + arrayId[1];
    to_buy_tickets.forEach((ticket) => {
      url = url + "-" + ticket.ticket.id + "-" + ticket.amount;
    });
    window.location.href = url;
  };

  useEffect(() => {
    getSubEventDetails();
  }, []);

  return (
    <div className="subevents-container">
      <div className="subevent-booking-title">
        {subevent && subevent.subEventName}
      </div>
      <div className="subevent-booking-description">
        {subevent && subevent.subEventDescription}
      </div>
      <hr className="subevent-separator" />
      <div className="subevent-booking-bookings-container">
        {tickets &&
          to_buy_tickets &&
          to_buy_tickets.map((ticket) => {
            return (
              <div
                className="subevent-booking-ticket-container"
                key={ticket.ticket.id}
              >
                <div className="subevent-booking-ticketinfo-container">
                  <div className="subevent-booking-ticket-title">
                    {ticket.ticket.ticketName}
                  </div>
                  <div className="subevent-booking-ticket-description">
                    {ticket.ticket.description}
                  </div>
                </div>
                <div className="subevent-booking-ticketprice-container">
                  <div className="subevent-booking-ticketprice">
                    € {ticket.ticket.price}
                  </div>
                </div>
                <div className="subevent-booking-ticketbooking-container">
                  <div className="subevent-booking-ticketbooking-counter">
                    <div className="subevent-booking-ticketbooking-button-container">
                      <div
                        className="subevent-booking-ticketbooking-button"
                        onClick={() => updateAmount(ticket.ticket.id, false)}
                      >
                        -
                      </div>
                    </div>
                    <div
                      className="subevent-booking-ticketbooking-count"
                      id={ticket.ticket.id}
                    >
                      {ticket.amount}
                    </div>
                    <div className="subevent-booking-ticketbooking-button-container">
                      <div
                        className="subevent-booking-ticketbooking-button"
                        onClick={() => updateAmount(ticket.ticket.id, true)}
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <center>
          <button
            id="confirm-button"
            className="subevent-booking-confirm-button"
            onClick={() => gotoCheckout()}
          >
            Prosegui
          </button>
        </center>
      </div>
    </div>
  );
}

export default SubEventBooking;
