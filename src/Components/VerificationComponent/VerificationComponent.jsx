import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerificationComponent = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // Added for resend loading state
  const [resendMessage, setResendMessage] = useState(""); // Added for resend feedbacks

  const navigate = useNavigate();
  const location = useLocation();
  // Extract userId from state or URL parameters
  const userId =
    location.state?.userId ||
    new URLSearchParams(location.search).get("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!verificationCode) {
      //   setError("Verification code is required.");
      toast.error("Verification code is required.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/auth/verify/verify-code`,
        {
          userId: userId,
          code: verificationCode,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Redirecting to Login Page", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });

        setTimeout(() => {
          navigate("/login");
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during verification.",
        {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        }
      );
      setLoading(false);
    } finally {
      //   setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await axiosInstance.post(
        `/auth/verify/generate-verification-code?userId=${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setResendMessage("A new code was sent to your email.");
        toast.success("A new code was sent to your email.", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      //   setResendMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#b7d1d0" }}
      >
        <Card
          className="shadow-sm w-100"
          style={{ maxWidth: "400px", borderRadius: "15px", margin: "auto" }}
        >
          <Card.Body className="p-4">
            <Card.Title
              className="mb-3 text-center"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Verify Account
            </Card.Title>
            <Form onSubmit={handleVerification}>
              <Form.Group className="mb-3" controlId="formVerificationCode">
                <Form.Label className="fw-bold">
                  Verification Code<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength="6"
                  disabled={loading}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
              </Button>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={handleResendCode}
                  disabled={resendLoading || loading}
                >
                  {resendLoading ? "Sending..." : "Resend Verification Code"}
                </Button>
                {resendMessage && <div>{resendMessage}</div>}
              </div>
              {error && <div className="text-danger mt-3">{error}</div>}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default VerificationComponent;
