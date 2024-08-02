import React, { useEffect, useState } from "react";
import { Button, Spinner, Image, Form } from "react-bootstrap";
import {
  BsPencilSquare,
  BsCheck,
  BsX,
  BsEye,
  BsEyeSlash,
} from "react-icons/bs";
import { FaCrown, FaChessKing, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ProfileComponent/ProfileComponent.css";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserById,
  updateUserById,
  changeUserPassword,
  getPremiumUserById,
} from "../../api/data/users/user";
import { formatDateTime } from "../../api/utility/commonUtils";
import { useMusic } from "../../contexts/MusicContext";

const AdminProfileComponent = ({ activeLink, setActiveComponent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tempUserData, setTempUserData] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileActions, setShowProfileActions] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getUserById(user.userId);
        setUserData(userInfo);
        // Ensure DOB is formatted correctly for the input
        const formattedDOB = userInfo.dob.split("T")[0]; // Format to YYYY-MM-DD
        setTempUserData({ ...userInfo, dob: formattedDOB }); // Set tempUserData with formatted DOBs
        setTempUserData(userInfo);
      } catch (error) {
        toast.error("Failed to fetch user data.", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      }
    };
    fetchUserData();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // setTempUserData({ ...userData });
    setTempUserData({ ...userData, dob: userData.dob.split("T")[0] }); // Reset to formatted DOB
    setIsEditing(false);
    setShowPasswordChange(false); // Reset password change visibility
    setShowProfileActions(true);
    setShowUserInfo(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserById(user.userId, {
        username: tempUserData.username,
        dob: tempUserData.dob,
      });
      setUserData(tempUserData);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setShowProfileActions(true); // Show profile actions when saving successfully
      setShowUserInfo(true);
    } catch (error) {
      toast.error("Failed to update profile.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setTempUserData({
      ...tempUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      return;
    }
    setIsLoading(true);
    try {
      await changeUserPassword(user.userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowProfileActions(true); // Show profile actions when password update is successful
      setShowUserInfo(true); // Show user info when password update is successful
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdminInfo = () => (
    <div className="info-card" id="admin-info-card">
      <h2>
        <FaChessKing style={{ marginRight: "5px" }} /> Welcome Admin!
      </h2>
      <p>
        As an admin, you have the power to manage various aspects of the
        application.
      </p>
      <ul>
        <li>
          <span style={{ fontWeight: "bold" }}>Handle user accounts:</span>{" "}
          View, update, and delete user information.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Oversee artists:</span> Add new
          artists, update existing profiles, and manage their songs.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Manage playlists:</span> Create,
          update, and delete playlists for users.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Generate reports:</span> View
          detailed reports
        </li>
      </ul>
      <p>Explore the admin dashboard to utilize all available features.</p>
      <div className="text-center">
        <Button
          variant="outline-none"
          style={{ color: "white" }}
          onClick={() => setActiveComponent("manage-users")}
        >
          Manage Users
        </Button>
      </div>
    </div>
  );

  //   const renderNormalInfo = () => (
  //     <div className="info-card">
  //       <h2>
  //         <FaExclamationCircle /> Explore Premium
  //       </h2>
  //       <p>Unlock exclusive features with our Premium plan.</p>
  //       <p>Benefits include:</p>
  //       <ul>
  //         <li>Ad-free listening</li>
  //         <li>Offline mode</li>
  //         <li>High-quality audio</li>
  //       </ul>
  //       <p>
  //         Can't create more playlists? Become a premium user to enjoy more
  //         features!
  //       </p>
  //       <div className="text-center">
  //         <Button
  //           variant="outline-none"
  //           style={{ color: "white" }}
  //           onClick={() => setActiveComponent("explore-premium")}
  //         >
  //           Explore Premium
  //         </Button>
  //       </div>
  //     </div>
  //   );

  if (!userData) {
    return <Spinner animation="border" />;
  }

  const isSaveDisabled =
    tempUserData.username === userData.username &&
    tempUserData.dob === userData.dob;

  return (
    <div className="profile-container" style={{ paddingBottom: "120px" }}>
      <div className="profile-section">
        <div className="profile-image">
          <Image
            src="https://res.cloudinary.com/deqk5oxse/image/upload/v1721715723/samples/smile.jpg"
            className="profile-img"
            roundedCircle={!isEditing && window.innerWidth < 768}
          />
        </div>
        <div className="profile-info">
          {!showPasswordChange && (
            <>
              <Form.Group className="profile-field">
                <Form.Label>Name:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="username"
                    value={tempUserData.username}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{userData.username}</span>
                )}
              </Form.Group>
              <Form.Group className="profile-field">
                <Form.Label>Email:</Form.Label>
                <span>{userData.email}</span>
              </Form.Group>
              <Form.Group className="profile-field">
                <Form.Label>Date of Birth:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="date"
                    name="dob"
                    value={tempUserData.dob}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{userData.dob.split("T")[0]}</span>
                )}
              </Form.Group>
            </>
          )}
          {showProfileActions && (
            <div className="profile-actions">
              {isEditing && (
                <>
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={isLoading || isSaveDisabled}
                  >
                    {isLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "100vh",
                        }}
                      >
                        <Spinner animation="border" size="sm" />
                      </div>
                    ) : (
                      <BsCheck />
                    )}
                    &nbsp;Save
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <BsX />
                    &nbsp;Cancel
                  </Button>
                </>
              )}
              {!showPasswordChange && !isEditing && (
                <Button variant="primary" onClick={handleEdit}>
                  <BsPencilSquare />
                  &nbsp;Edit
                </Button>
              )}
              {!isEditing && !showPasswordChange && (
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  Change Password
                </Button>
              )}
            </div>
          )}

          {/* Change Password Section */}
          {showPasswordChange && (
            <div className="password-change-section">
              <Form.Group className="profile-field">
                <Form.Label>Current Password:</Form.Label>
                <div className="password-input">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {showPassword ? (
                    <BsEye
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  ) : (
                    <BsEyeSlash
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  )}
                </div>
              </Form.Group>
              <Form.Group className="profile-field">
                <Form.Label>New Password:</Form.Label>
                <div className="password-input">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {showPassword ? (
                    <BsEye
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  ) : (
                    <BsEyeSlash
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  )}
                </div>
              </Form.Group>
              <Form.Group className="profile-field">
                <Form.Label>Confirm Password:</Form.Label>
                <div className="password-input">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {showPassword ? (
                    <BsEye
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  ) : (
                    <BsEyeSlash
                      className="password-eye-icon"
                      onClick={toggleShowPassword}
                    />
                  )}
                </div>
              </Form.Group>
              <div className="profile-actions">
                <Button
                  variant="danger"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="vertical-line"></div>
      <div className="info-section">{renderAdminInfo()}</div>
    </div>
  );
};

export default AdminProfileComponent;
