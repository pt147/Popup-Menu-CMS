import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import Footer from "../component/Footer";
import MainNavigation from "../component/NavigationBar";
import i18n from "../i18n/config";
import EventPage from "../pages/EventPage";
import WebMenu from "../pages/WebMenu";
import WebMenuCheckout from "../pages/WebMenuCheckout";
import SubEventsList from "../pages/SubEventsList";
import SubEventBooking from "../pages/SubEventBooking";
import SubEventBookingCheckout from "../pages/SubEventBookingCheckout";
import AddCardPage from "../pages/AddCardPage";

const AppRoutes = () => {
  const language = useSelector((state) => state.language.language);
  useEffect(() => {
    console.log("Language",language);
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="app-container">
      <MainNavigation />
      <div className="main-content-app">
        <Switch>
          <Route path="/Menu/:eventId" exact>
            <WebMenu />
          </Route>
          <Route path="/MenuCheckout/:eventId" exact>
            <WebMenuCheckout />
          </Route>
          <Route path="/Event/:eventId" exact>
            <EventPage />
          </Route>
          <Route path="/Eventi/:eventId" exact>
            <SubEventsList />
          </Route>
          <Route path="/Biglietteria/:eventId" exact>
            <SubEventBooking />
          </Route>
          <Route path="/Checkout/:eventId" exact>
            <SubEventBookingCheckout />
          </Route>
          <Route path="/AggiungiCarta" exact>
            <AddCardPage />
          </Route>
          <Route path="*">
            <Redirect to="/Menu" />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default AppRoutes;
