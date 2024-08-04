import React, { useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import LogoWithNoBackground from "../../assets/logo/logo_no_background.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavbarComponent.css"; // Custom styles for additional styling
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../api/data/auth/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getArtistById } from "../../api/data/artists/artist";

const NavbarComponent = ({ activeLink, setActiveComponent, userRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  var profileImage;

  var profileImage =
    userRole.toLowerCase() !== "artist"
      ? "https://res.cloudinary.com/deqk5oxse/image/upload/v1722757749/profile_tmhwcg.jpg"
      : user.imageUrl;

  const handleLogout = async () => {
    toast.loading("Logging out", {
      position: "top-right",
      autoClose: 100,
      pauseOnHover: false,
    });
    setTimeout(async () => {
      const response = await logoutUser();
      logout();
      if (userRole.toLowerCase() === "artist") {
        navigate("/artist/login");
      } else {
        navigate("/login");
      }
    }, 1000);
  };
  return (
    <>
      <ToastContainer />
      <Navbar expand="md" className="custom-navbar">
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="hamburger-icon"
          >
            <FaBars />
          </Navbar.Toggle>
          <img
            src={LogoWithNoBackground}
            alt="Logo"
            className="logo"
            style={{
              marginRight: "10px",
              maxHeight: "40px",
              cursor: "pointer",
            }}
            onClick={() => setActiveComponent("songs")}
          />
          <Navbar.Brand
            className="app-name"
            style={{ cursor: "pointer" }}
            onClick={() => setActiveComponent("songs")}
          >
            Vibe - Vault
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav" className="me-2">
            <Nav className="me-auto nav-links">
              {/* Conditionally render nav links based on user role */}
              {userRole.toLowerCase() === "premiumuser" ||
              userRole.toLowerCase() === "normaluser" ? (
                <>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("profile")}
                    style={{
                      color: activeLink === "profile" ? "#ffa500" : "inherit",
                    }}
                  >
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("songs")}
                    style={{
                      color: activeLink === "songs" ? "#ffa500" : "inherit",
                    }}
                  >
                    Songs
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("playlists")}
                    style={{
                      color: activeLink === "playlists" ? "#ffa500" : "inherit",
                    }}
                  >
                    Playlists
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("artists")}
                    style={{
                      color: activeLink === "artists" ? "#ffa500" : "inherit",
                    }}
                  >
                    Artists
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("explore-premium")}
                    style={{
                      color:
                        activeLink === "explore-premium"
                          ? "#ffa500"
                          : "inherit",
                    }}
                  >
                    Explore Premium
                  </Nav.Link>
                </>
              ) : userRole === "admin" ? (
                <>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("admin-profile")}
                    style={{
                      color:
                        activeLink === "admin-profile" ? "#ffa500" : "inherit",
                    }}
                  >
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-users")}
                    style={{
                      color:
                        activeLink === "manage-users" ? "#ffa500" : "inherit",
                    }}
                  >
                    Users
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-songs")}
                    style={{
                      color:
                        activeLink === "manage-songs" ? "#ffa500" : "inherit",
                    }}
                  >
                    Songs
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-artists")}
                    style={{
                      color:
                        activeLink === "manage-artists" ? "#ffa500" : "inherit",
                    }}
                  >
                    Artists
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-playlists")}
                    style={{
                      color:
                        activeLink === "manage-playlists"
                          ? "#ffa500"
                          : "inherit",
                    }}
                  >
                    Playlists
                  </Nav.Link>
                </>
              ) : userRole === "artist" ? (
                <>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("artist-profile")}
                    style={{
                      color:
                        activeLink === "artist-profile" ? "#ffa500" : "inherit",
                    }}
                  >
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-artist-songs")}
                    style={{
                      color:
                        activeLink === "manage-artist-songs"
                          ? "#ffa500"
                          : "inherit",
                    }}
                  >
                    Your Songs
                  </Nav.Link>
                  <Nav.Link
                    className="navbar-link-item"
                    onClick={() => setActiveComponent("manage-artist-albums")}
                    style={{
                      color:
                        activeLink === "manage-artist-albums"
                          ? "#ffa500"
                          : "inherit",
                    }}
                  >
                    Your Albums
                  </Nav.Link>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
          <Nav className="ms-auto">
            <Dropdown align="end" className="user-info-dropdown">
              {" "}
              {/* Align dropdown to the end */}
              <Dropdown.Toggle
                as={Nav.Item}
                className="user-info"
                id="user-dropdown"
              >
                <div className="user-avatar">
                  <img
                    src={profileImage}
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                </div>
                {/* {user.username ? */}
                <span span className="user-name">
                  {user?.username || user?.name}
                </span>

                {/* // } */}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="user-dropdown-menu"
                style={{ cursor: "pointer" }}
              >
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
