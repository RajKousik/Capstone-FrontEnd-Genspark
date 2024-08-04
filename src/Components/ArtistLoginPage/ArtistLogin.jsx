import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArtistRegisterLoginImage from "../../assets/images/ArtistRegisterLoginImage.png";
import Logo from "../../assets/logo/logo_no_background.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { artistLogin } from "../../api/data/auth/auth"; // Import your artistLogin function
import { Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignInSide() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { user, login } = useAuth();

  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setLoading(false);

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const errors = validate();
    setErrors(errors);

    //

    if (Object.keys(errors).length === 0) {
      try {
        const response = await artistLogin(email, password);
        if (response) {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 2000,
            pauseOnHover: false,
          });

          setTimeout(() => {
            login(response, response.token);
            navigate("/artist/login");
            setLoading(false);
            setEmail("");
            setPassword("");
          }, 1500);
          // Redirect or handle successful login
        } else {
          toast.error(response.error.data.message, {
            position: "top-right",
            autoClose: 2000,
            pauseOnHover: false,
          });
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
      }
    } else {
      toast.error("Please fix the validation errors.", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${ArtistRegisterLoginImage})`,
            backgroundColor: "#b6d1cf",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "200px",
                height: "120px",
              }}
            />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Log In"}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/artist/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                  <br />
                  <Link href="/login" variant="body2">
                    {"Wanna enjoy some music? Login Now"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </ThemeProvider>
  );
}
