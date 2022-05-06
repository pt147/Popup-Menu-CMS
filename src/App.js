import React from "react";
import AppRoutes from "./routes/Routes";
import Loader from "./component/Loader";

function App() {
  return (
    <React.Fragment>
      <AppRoutes />
      <Loader />
    </React.Fragment>
  );
}

export default App;
