import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPageImage from "../../assets/images/RegisterLoginImage.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const { register } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !username ||
      !email ||
      !dob ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits long.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/user/register", {
        username,
        email,
        dob,
        phone,
        password,
      });

      if (response.status === 201) {
        toast.success("Redirecting to verification page", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
        const user = response.data;
        setTimeout(async () => {
          navigate(`/verify-code?userId=${user.userId}`, {
            state: { userId: user.userId },
          });
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error.response.data);
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
        className="d-flex align-items-center justify-content-center vh-100"
        style={{
          backgroundColor: "#f8f9fa",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        <Card
          className="shadow-sm w-100"
          style={{ maxWidth: "900px", borderRadius: "15px", margin: "auto" }}
        >
          <Row className="g-0">
            <Col md={5} className="d-none d-md-block">
              <img
                src={RegisterPageImage}
                alt="Register"
                className="img-fluid rounded-start"
                style={{ height: "100%", objectFit: "cover" }}
              />
            </Col>
            <Col md={7} className="p-4">
              <Card.Body>
                <Card.Title
                  className="mb-3 text-center"
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  Register
                </Card.Title>
                <Form onSubmit={handleRegister}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label className="fw-bold">
                          Username<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
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
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formDOB">
                        <Form.Label className="fw-bold">
                          Date of Birth<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label className="fw-bold">
                          Phone Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength="10"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="formConfirmPassword"
                      >
                        <Form.Label className="fw-bold">
                          Confirm Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="input-group">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Register"
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
                    Already signed up? <Link to="/login">Log in here</Link>
                  </small>
                  <br />
                  <small>
                    <Link to="/artist/register">
                      Get Register yourself as artist
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default RegisterComponent;
