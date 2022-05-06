import { useTranslation } from "react-i18next";
import MobileStoreButton from "react-mobile-store-button";
import logo from "../images/popupLogo.png";

const style = {
  backgroundColor: "#db2668",
  borderTop: "1px solid #white",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "90px",
  width: "100%",
  zIndex: 999,
};

const phantom = {
  display: "block",
  padding: "20px",
  height: "90px",
  width: "100%",
};

// const Footer = () => {
//   const { t } = useTranslation();
//   return (
//     <div>
//       <div style={phantom} />
//       <div style={style}>
//         <span>{t("footerNote")}</span>
//         <div>
//           <MobileStoreButton
//             height={65}
//             width={100}
//             store="ios"
//             url={
//               "https://apps.apple.com/it/app/popup-share-the-fun/id1559033782"
//             }
//             linkProps={{ title: "iOS Store Button" }}
//           />

//           <MobileStoreButton
//             height={70}
//             width={100}
//             store="android"
//             url={
//               "https://play.google.com/store/apps/details?id=com.popup.application"
//             }
//             linkProps={{ title: "iOS Store Button" }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
const Footer = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        height: "90px",
        width: "100%",
        bottom: 0,
        position: "fixed",
        backgroundColor: "#db2668",
        display: "flex",
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt={"logo"}
        height={"60px"}
        width={"60px"}
        style={{ marginRight: "10px" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* <span
          style={{
            fontSize: "15px",
            color: "white",
            fontFamily:'sans-serif'
          }}
        >
          {"Enjoy the revolution!"}
        </span>
        <span
          style={{
            fontSize: "19px",
            color: "white",
            fontWeight:'bold',
            fontFamily:'sans-serif'
          }}
        >
          {"Download the app"}
        </span> */}

        <MobileStoreButton
          height={30}
          width={100}
          store="ios"
          url={"https://apps.apple.com/it/app/popup-share-the-fun/id1559033782"}
          linkProps={{ title: "iOS Store Button" }}
        />

        <MobileStoreButton
          height={40}
          width={100}
          store="android"
          url={
            "https://play.google.com/store/apps/details?id=com.popup.application"
          }
          linkProps={{ title: "iOS Store Button" }}
        />
      </div>
    </div>
  );
};

export default Footer;
