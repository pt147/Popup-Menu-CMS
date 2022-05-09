import React, { useEffect, useState } from "react";
import moment from "moment";
import "../CSS/subeventslistPage.css";
import {
  EVENTDETAIL,
  FETCH_COLOR_SETTINGS,
  POST_METHOD,
  GET_METHOD,
} from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";

function SubEventsList() {
  const {
    sendRequest: getEventDetailsApi,
    sendRequest: fetchColorSettingsAPI,
    isLoading,
    error,
  } = useHttp();
  const [event, setEvent] = useState();
  const { eventId } = useParams();
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
      }
    );

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
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="subevents-container">
      {event &&
        event.subEvents.map((subevent) => {
          return (
            <div className="subevent-container" key={subevent.subEventId}>
              <a href={"/Biglietteria/" + event.id + "-" + subevent.subEventId}>
                <div className="subevent-topinfo-container">
                  <img
                    src={subevent.images[0].preview_url}
                    className="subevent-image"
                    alt="Loading"
                  />
                  <div className="subevent-maininfo-container">
                    <div className="subevent-title">
                      {subevent.subEventName}
                    </div>
                    <div className="subevent-time">
                      {moment(subevent.subEventStartDate).format(
                        "DD MMM, YYYY"
                      )}{" "}
                      <br />
                      {moment(subevent.subEventFromTime, "HH:mm:ss").format(
                        "HH:mm"
                      )}{" "}
                      -{" "}
                      {moment(subevent.subEventToTime, "HH:mm:ss").format(
                        "HH:mm"
                      )}
                    </div>
                  </div>
                  <div className="subevent-description">
                    {subevent.subEventDescription}
                  </div>
                </div>
                <div className="subevent-otherinfo-container">
                  <div className="subevent-price">Clicca per Partecipare</div>
                </div>
              </a>
            </div>
          );
        })}
    </div>
  );
}

export default SubEventsList;
