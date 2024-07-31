import React from "react";
import { Toast } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons"; // Ensure to install react-bootstrap-icons
import { formatDateTime } from "../../api/utility/commonUtils";

const PremiumNotification = ({ endDate }) => {
  return (
    <Toast
      className="premium-notification text-center"
      style={{
        width: "80%",
        margin: "0 auto 10px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toast.Body style={{ fontWeight: "bold" }}>
        <InfoCircle
          size={20}
          className="info-icon"
          style={{ color: "ffa500", marginRight: "2px" }}
        />{" "}
        You are a premium user with access until {formatDateTime(endDate)}.
        Upgrade or buy premium for upcoming days if needed.
      </Toast.Body>
    </Toast>
  );
};

export default PremiumNotification;
