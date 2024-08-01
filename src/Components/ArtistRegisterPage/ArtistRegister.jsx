import React, { useState } from "react";
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
import { Spinner } from "react-bootstrap";
import { artistRegister } from "../../api/data/auth/auth"; // Import your register function
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../cloudinary/cloudinary";

const defaultTheme = createTheme();

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm Password is required";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!bio) errors.bio = "Bio is required";
    if (!imageUrl) errors.imageUrl = "Image is required";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await artistRegister({
          name: username,
          email,
          password,
          bio,
          imageUrl,
        });
        if (response) {
          toast.success("Registration successful!", {
            position: "top-right",
            autoClose: 2000,
            pauseOnHover: false,
          });

          setTimeout(() => {
            login(response, response.token);
            navigate("/login");
            setLoading(false);
          }, 1500);
        } else {
          toast.error(response.error.data.message, {
            position: "top-right",
            autoClose: 2000,
            pauseOnHover: false,
          });
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message, {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
      }
    } else {
      if (errors.imageUrl) {
        toast.error("Upload Profile Image.", {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Please fix the validation errors.", {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImage(e.target.files[0]);
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setImageUrl(imageUrl);
      }
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
              my: 2,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Register</h3>
            {/* <img
              src={Logo}
              alt="Logo"
              style={{
                width: "200px",
                height: "80px",
              }}
            /> */}
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
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="bio"
                label="Bio"
                type="text"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                error={Boolean(errors.bio)}
                helperText={errors.bio}
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Profile Picture
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Register"
                )}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/artist/login" variant="body2">
                    {"Already have an account? Sign In"}
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
