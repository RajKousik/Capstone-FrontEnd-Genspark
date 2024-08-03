import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPageImage from "../../assets/images/RegisterLoginImage.jpg"; // Ensure the image path is correct
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      toast.error("Both fields are required", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/auth/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Successfully logged in! Redirecting...", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });

        setTimeout(() => {
          const { role } = response.data;
          login(response.data, response.data.token);

          if (role.toLowerCase() === "admin") {
            navigate("/admin-dashboard");
          } else if (
            role.toLowerCase() === "normaluser" ||
            role.toLowerCase() === "premiumuser"
          ) {
            navigate("/user-dashboard");
          } else if (role === "artist") {
            navigate("/artist-dashboard");
          }
          setLoading(false);
          setEmail("");
          setPassword("");
        }, 1500);
      }
    } catch (error) {
      console.error(error.response);
      // setError(error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const errorDiv = document.getElementById("error-message");
      if (errorDiv) {
        errorDiv.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [error]);

  return (
    <>
      <ToastContainer />
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#b7d1d0",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <Card
          className="shadow-sm w-100"
          style={{
            maxWidth: "900px",
            borderRadius: "15px",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          }}
        >
          <Row className="g-0">
            <Col md={6} className="p-4 d-flex flex-col justify-content-center">
              <Card.Body>
                <Card.Title
                  className="text-center"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                  }}
                >
                  Log In
                </Card.Title>
                <Form onSubmit={handleLogin} style={{ marginTop: "2.5rem" }}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="fw-bold">
                      Email address<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="fw-bold">
                      Password<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                    style={{ marginTop: "1rem" }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Log In"
                    )}
                  </Button>
                  {error && (
                    <div id="error-message" className="text-danger mt-3">
                      {error}
                    </div>
                  )}
                </Form>
                <div className="text-center mt-3">
                  <small>
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                  </small>
                </div>
              </Card.Body>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <img
                src={LoginPageImage}
                alt="Login"
                className="img-fluid rounded-end"
                style={{ height: "100%", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default LoginComponent;
