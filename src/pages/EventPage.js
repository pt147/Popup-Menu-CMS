import React, { useEffect, useRef, useState } from "react";
import { Card, Carousel, Col, Row } from "react-bootstrap";
import img5 from "../images/img5.jpg";
import img6 from "../images/img6.jpg";
import img7 from "../images/img7.jpg";
import movie from "../images/movie.png";
import dollarSign from "../images/dollar_svg.svg";
import calander from "../images/ic_calendar.svg";
import mapPin from "../images/map-pin.svg";
import "../CSS/eventPage.css";
import { EVENTDETAIL, FETCH_ORDERS, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { eventAction } from "../store/events-slice";
/*import { DatePicker } from  'react-dater'
import  'react-dater/dist/index.css'*/

function EventPage(){
  /*const [dates, setDates] = useState({
    checkin:  new  Date('1970-01-01'),
    checkout:  new  Date('1970-01-01')
  })
  const [calendarOpen, setCalendarOpen] = useState(false)*/

  const { sendRequest: getEventDetailsApi, isLoading, error } = useHttp();
  const [event, setEvent] = useState();
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const arrayId = eventId.split("-");

  const getEventDetails = () => {
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
        dispatch(eventAction.setName(response?.data?.title));
      }
    );
  };


  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="event-container">
      <div className="event-image-container">
        <img
          className="event-image"
          src={event && event.images[0].banner_url}
        />
      </div>
      <div className="event-title">{event && event.title}</div>
      <div className="event-info-container">
        <div className="event-description-container">
          Description
        </div>
        <div className="event-otherinfo-container">
          <div className="event-singleinfo-container">
            Price
          </div>
          <div className="event-singleinfo-container">
            Date
          </div>
          <div className="event-singleinfo-container">
            Location
          </div>
        </div>
      </div>
      {/*<div className="event-descprice-container">
        <h5 className="mt-3">Event Description</h5>
        <div className="row">
          <div className="col-sm-7 mb-3">
            <div>
              {event.description}
            </div>
          </div>

          <div className={"col-sm-5"}>
            <div className="d-flex justify-content-start align-items-center">
              <img
                src={dollarSign}
                height={25}
                width={25}
                className="d-inline"
              />
              <div className="ms-3" style={{ width: "100%" }}>
                <span className="d-flex flex-grow-1">Ticket Price</span>
                <span className="fs-5 fw-bold">$ {event.price ?? "Prezzo non trovato"}</span>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <img
                src={calander}
                height={24}
                width={24}
                className="d-inline"
              />
              <div className="ms-3" style={{ width: "100%" }}>
                <span className="d-flex flex-grow-1">Date</span>
                <span className="fs-5 fw-bold">Sunday, 12 Jun 2021</span>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <img
                src={mapPin}
                height={24}
                width={24}
                className="d-inline"
              />
              <div className="ms-3" style={{ width: "100%" }}>
                <span className="d-flex flex-grow-1">Location</span>
                <span className="fs-5 fw-bold">
                  Blue Corner St. 123566 Franklin Avenue, London
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>*/}
      <div className="event-buttons-container">
          <a href="/Menu/{eventId}">
            <div className="event-button" id="event-menu-button">
              Menu
            </div>
          </a>
          <div className="event-button" id="event-booking-button">{/*} onClick={}>*/}
            Booking
          </div>
      </div>
    </div>
  );
}
export default EventPage;
