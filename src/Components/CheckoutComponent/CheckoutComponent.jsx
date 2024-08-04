import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Toast } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import "./CheckoutComponent.css"; // Create a CSS file for custom styling
import { createCheckoutSession } from "../../api/utility/stripePayment";
import PremiumLogo1 from "../../assets/images/premium_upgrade_logo_1.jpg";
import PremiumLogo2 from "../../assets/images/premium_upgrade_logo_2.jpg";
import PremiumLogo3 from "../../assets/images/premium_upgrade_logo_3.jpg";
import { useMusic } from "../../contexts/MusicContext";
import PremiumNotification from "../PremiumNotificationComponent/PremiumNotificationComponent"; // Import the new component
import { getPremiumUserById } from "../../api/data/users/user"; // Import your API function
import { InfoCircle } from "react-bootstrap-icons";
import { formatDateTime } from "../../api/utility/commonUtils";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutComponent = () => {
  const { isPlayerVisible, setIsPlayerVisible } = useMusic();

  useEffect(() => {
    setIsPlayerVisible(false);
  }, []);

  const { user } = useAuth();
  const [loadingButton, setLoadingButton] = useState(null); // Track which button is loading
  const [showNotification, setShowNotification] = useState(true); // State to control notification
  const [endDate, setEndDate] = useState(""); // State to store subscription end date

  useEffect(() => {
    // Check if user is a premium user and fetch subscription end date
    if (user.role.toLowerCase() === "premiumuser") {
      getPremiumUserById(user.userId)
        .then((response) => {
          setEndDate(response.endDate); // Assuming response contains endDate
          // setShowNotification(true);
        })
        .catch((error) => {
          console.error("Error fetching premium user data:", error);
        });
    }
    setEndDate(true);
  }, [user.role, user.userId]);

  const handleCheckout = async (amount, durationInDays, buttonId) => {
    setLoadingButton(buttonId); // Set the loading button
    const stripe = await stripePromise;

    const sessionId = await createCheckoutSession(
      amount * 100,
      user.userId,
      durationInDays,
      "usd",
      user.email
    );

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId.sessionId,
    });

    if (error) {
      console.error("Error redirecting to checkout:", error);
    }

    setLoadingButton(null); // Reset loading button state
  };

  return (
    <Container className="checkout-container">
      {user.role.toLowerCase() == "premiumuser" ? (
        <PremiumNotification endDate={endDate} isPremium={true} />
      ) : (
        <PremiumNotification endDate={endDate} isPremium={false} />
      )}
      <Row className="justify-content-md-center">
        <Col md="auto" className="d-flex justify-content-center">
          <Card className="mb-4">
            <Card.Img variant="top" src={PremiumLogo1} />
            <Card.Body>
              <Card.Title>2-Day Access</Card.Title>
              <Card.Text>
                Enjoy all premium features for just $20. Perfect for short-term
                use.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCheckout(20, 2, "button1")}
                disabled={loadingButton !== null && loadingButton !== "button1"}
                className="checkout-btn"
                style={{ backgroundColor: "#ffa500", borderColor: "#ffa500" }} // Set button color
              >
                {loadingButton === "button1"
                  ? "Loading..."
                  : "Get 2-Day Access"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md="auto" className="d-flex justify-content-center">
          <Card className="mb-4">
            <Card.Img variant="top" src={PremiumLogo2} />
            <Card.Body>
              <Card.Title>3-Month Access</Card.Title>
              <Card.Text>
                Upgrade to premium for $100 and enjoy unlimited access for 3
                months.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCheckout(100, 90, "button2")}
                disabled={loadingButton !== null && loadingButton !== "button2"}
                className="checkout-btn"
                style={{ backgroundColor: "#ffa500", borderColor: "#ffa500" }} // Set button color
              >
                {loadingButton === "button2"
                  ? "Loading..."
                  : "Get 3-Month Access"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md="auto" className="d-flex justify-content-center">
          <Card className="mb-4">
            <Card.Img variant="top" src={PremiumLogo3} />
            <Card.Body>
              <Card.Title>1-Year Access</Card.Title>
              <Card.Text>
                Best value! Enjoy all premium features for a whole year at just
                $200.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCheckout(200, 365, "button3")}
                disabled={loadingButton !== null && loadingButton !== "button3"}
                className="checkout-btn"
                style={{ backgroundColor: "#ffa500", borderColor: "#ffa500" }} // Set button color
              >
                {loadingButton === "button3"
                  ? "Loading..."
                  : "Get 1-Year Access"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutComponent;
