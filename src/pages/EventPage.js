import React, { useEffect, useState } from "react";
import "../CSS/eventPage.css";
import { EVENTDETAIL, POST_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { eventAction } from "../store/events-slice";

function EventPage() {
  const { sendRequest: getEventDetailsApi } = useHttp();
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
        <div className="event-description-container">Description</div>
        <div className="event-otherinfo-container">
          <div className="event-singleinfo-container">Price</div>
          <div className="event-singleinfo-container">Date</div>
          <div className="event-singleinfo-container">Location</div>
        </div>
      </div>
      <div className="event-buttons-container">
        <a href="/Menu/{eventId}">
          <div className="event-button" id="event-menu-button">
            Menu
          </div>
        </a>
        <div className="event-button" id="event-booking-button">
          Booking
        </div>
      </div>
    </div>
  );
}
export default EventPage;
