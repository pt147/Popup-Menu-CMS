import React, { useEffect } from "react";
import "../CSS/loginPage.css";
import useHttp from "../hooks/use-http";
import logo from "../images/popupLogo.png";

function AddCardPage() {
  const { sendRequest: getEventDetailsApi, isLoading, error } = useHttp();

  console.log("Add card");

  const getEventDetails = () => {
    /*getEventDetailsApi(
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
    );*/
  };

  function add_card() {
    const number = document.getElementById("number").value;
    const mm = document.getElementById("mm").value;
    const yy = document.getElementById("yy").value;
    const cvv = document.getElementById("cvv").value;
    if (
      number.length === 16 &&
      mm > 0 &&
      mm < 13 &&
      yy.length === 2 &&
      cvv.length === 3
    ) {
      alert("Ok");
    } else {
      alert("Dati mal formattati");
    }
  }

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        className="sign-container"
        id="pay-container"
        style={{ display: "block" }}
      >
        <div className="login-container">
          <img src={logo} className="login-image" />
          <div className="login-title">Dettagli Carta</div>
          <div className="login-input-name">Numero Carta</div>
          <br></br>
          <input
            type="text"
            id="number"
            className="login-input"
            placeholder="0123 4567 8910 1234"
          />
          <div className="login-input-name">Mese e Anno di Scadenza</div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <input
            type="number"
            id="mm"
            className="login-input"
            placeholder="MM"
            style={{ width: "65px" }}
          />
          <input
            type="number"
            id="yy"
            className="login-input"
            placeholder="YY"
            style={{ width: "65px" }}
          />
          <br></br>
          <br></br>
          <div className="login-input-name">
            CVV - Codice sul retro della Carta
          </div>
          <br></br>
          <br></br>
          <br></br>
          <input
            type="number"
            id="cvv"
            className="login-input"
            placeholder="CVV"
            style={{ width: "100px" }}
          />
          <br></br>
          <button className="login-button" onClick={add_card}>
            Aggiungi Carta
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCardPage;
