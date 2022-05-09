import styles from "./Loader.module.css";
import Loader from "react-loader-spinner";
import ReactDOM from "react-dom";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const LocalLoader = () => {
  const showLoader = useSelector((state) => state.loader.isShown);

  const classnName = showLoader
    ? styles.loaderclass
    : styles["loaderclass-hide"];

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div className={classnName}>
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            visible={showLoader}
          />
        </div>,
        document.getElementById("loader")
      )}
    </Fragment>
  );
};

export default LocalLoader;
