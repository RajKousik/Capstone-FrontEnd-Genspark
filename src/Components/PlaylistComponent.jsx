import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  Modal,
  Form,
} from "react-bootstrap";
import { FaHeart, FaPlus, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import "../css/PlaylistComponent.css";
import {
  getPublicPlaylists,
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../api/data/playlists/playlist"; // Adjust the import path as necessary

import {
  getFavoritePlaylistsByUserId,
  addFavoritePlaylist,
  deleteFavoritePlaylist,
} from "../api/data/favorites/favorite"; // Adjust the import path as necessary

import { getUserById } from "../api/data/users/user";

import { useAuth } from "../contexts/AuthContext"; // Adjust the import path as necessary
import { uploadImage } from "../cloudinary/cloudinary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SongsComponent from "./SongsComponent";
import { useMusic } from "../contexts/MusicContext";
import { getSongById } from "../api/data/songs/song";
import { getArtistById } from "../api/data/artists/artist";
import { getAlbumById } from "../api/data/albums/album";
import { formatDateTime } from "../api/utility/commonUtils";
import PlaylistSongsComponent from "./PlaylistSongsComponent";
import { getSongsByPlaylistId } from "../api/data/playlistsongs/playlistsongs";

const PlaylistComponent = () => {
  const { user } = useAuth();
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState(null);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    isPublic: false,
    imageUrl: "",
  });

  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    setLikedSongs,
    songs, // Access songs from context
    setSongs,
  } = useMusic();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const userPlaylists = await getUserPlaylists(user.userId);
        const publicPlaylists = await getPublicPlaylists();
        const favoritePlaylists = await getFavoritePlaylistsByUserId(
          user.userId
        );

        const updatedUserPlaylists = await Promise.all(
          userPlaylists.map(async (playlist) => {
            //
            const response = await getUserById(playlist.userId);
            return { ...playlist, owner: response.username };
          })
        );

        const updatedPublicPlaylists = await Promise.all(
          publicPlaylists.map(async (playlist) => {
            //
            const response = await getUserById(playlist.userId);
            return { ...playlist, owner: response.username };
          })
        );

        setMyPlaylists(updatedUserPlaylists);
        setPublicPlaylists(updatedPublicPlaylists);
        setFavorites(new Set(favoritePlaylists.map((pl) => pl.playlistId)));
      } catch (error) {
        console.error("Error fetching playlists:", error);
        toast.error("Error fetching playlists", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      }
    };

    fetchPlaylists();
  }, [user.userId]);

  const handleViewPlaylistClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    // here get playlist songs as of now some dummy data
    const result = await getSongsByPlaylistId(playlist.playlistId);
    // const songOne = await getSongById(1);

    // const artist = await getArtistById(songOne.artistId);
    // const album = await getAlbumById(songOne.albumId);
    // const enrichedSongOne = {
    //   ...songOne,
    //   artistName: artist.name,
    //   albumName: album ? album.title : "Single",
    //   releaseDate: formatDateTime(songOne.releaseDate),
    //   id: songOne.songId,
    // };

    const enrichedSongs = await Promise.all(
      result.map(async (song) => {
        const artist = await getArtistById(song.artistId);
        const album = await getAlbumById(song.albumId);
        return {
          ...song,
          artistName: artist.name,
          albumName: album ? album.title : "Single",
          releaseDate: formatDateTime(song.releaseDate),
          id: song.songId,
        };
      })
    );

    setPlaylistSongs(enrichedSongs);
  };

  const toggleFavorite = async (playlistId) => {
    try {
      if (favorites.has(playlistId)) {
        await deleteFavoritePlaylist(user.userId, playlistId);
        setFavorites((prevFavorites) => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.delete(playlistId);
          return newFavorites;
        });
      } else {
        await addFavoritePlaylist(user.userId, playlistId);
        setFavorites((prevFavorites) => new Set(prevFavorites).add(playlistId));
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Error updating favorite status", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    }
  };

  const handleEdit = (playlist) => {
    setEditPlaylist(playlist);
    setShowEditModal(true);
  };

  const handleDelete = async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      setMyPlaylists(myPlaylists.filter((pl) => pl.playlistId !== playlistId));
      setPublicPlaylists(
        publicPlaylists.filter((pl) => pl.playlistId !== playlistId)
      );
      toast.success("Playlist deleted successfully", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    }
  };

  const handleAddPlaylist = async () => {
    try {
      const addedPlaylist = await createPlaylist({
        ...newPlaylist,
        userId: user.userId,
      });
      setMyPlaylists([...myPlaylists, addedPlaylist]);
      setShowAddModal(false);
      setNewPlaylist({ name: "", isPublic: true, imageUrl: "" }); // Reset form
      toast.success("Playlist added successfully", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error adding playlist:", error);
      setShowAddModal(false);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedPlaylist = await updatePlaylist(
        editPlaylist.playlistId,
        editPlaylist
      );
      setMyPlaylists(
        myPlaylists.map((pl) =>
          pl.playlistId === updatedPlaylist.playlistId ? updatedPlaylist : pl
        )
      );
      setPublicPlaylists(
        publicPlaylists.map((pl) =>
          pl.playlistId === updatedPlaylist.playlistId ? updatedPlaylist : pl
        )
      );
      setShowEditModal(false);
      setEditPlaylist(null); // Reset form
      toast.success("Playlist updated successfully", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error saving edited playlist:", error);
      setShowEditModal(false);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (editPlaylist) {
        setEditPlaylist({ ...editPlaylist, imageUrl });
      } else {
        setNewPlaylist({ ...newPlaylist, imageUrl });
      }
    }
  };

  const handleBackClick = () => {
    setSelectedPlaylist(null);
  };

  return (
    <>
      {selectedPlaylist ? (
        // <Container style={{ paddingBottom: "120px" }}>
        //   <Row className="mt-4">
        //     <Col>
        //       <div className="d-flex align-items-center">
        //         <Button
        //           variant="link"
        //           onClick={handleBackClick}
        //           style={{ color: "#ffa500", fontSize: "1.5rem" }}
        //         >
        //           <FaArrowLeft />
        //         </Button>
        //         <h2 className="playlist-header m-0">{selectedPlaylist.name}</h2>
        //       </div>
        <PlaylistSongsComponent
          playlistSongs={playlistSongs}
          setPlaylistSongs={setPlaylistSongs}
          playlist={selectedPlaylist}
          handleBackClick={handleBackClick}
        />
      ) : (
        /* </Col>
          </Row>
        </Container> */
        <Container style={{ paddingBottom: "120px" }}>
          <Row className="mt-4">
            <Col>
              <div className="playlist-header-container">
                <h2 className="playlist-header">My Playlists</h2>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#ffa500",
                    borderColor: "#ffa500",
                  }}
                  onClick={() => setShowAddModal(true)}
                >
                  Create Playlist
                </Button>
              </div>
            </Col>
          </Row>
          <Row
            className="mt-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {myPlaylists.length === 0 ? (
              <Col className="text-center">No playlists available</Col>
            ) : (
              myPlaylists.map((playlist) => (
                <Col
                  key={playlist.playlistId}
                  xs={12}
                  sm={6}
                  md={4}
                  className="mb-4"
                >
                  <Card className="playlist-card">
                    <Card.Img
                      variant="top"
                      src={playlist.imageUrl}
                      className="playlist-image"
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Card.Title className="playlist-title">
                        {playlist.name}
                        <Dropdown className="playlist-options-dropdown">
                          <Dropdown.Toggle
                            variant="link"
                            style={{
                              color: "#ffa500",
                            }}
                            id="dropdown-basic"
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              style={{
                                fontWeight: "bold",
                              }}
                              onClick={() => handleEdit(playlist)}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}
                              onClick={() => handleDelete(playlist.playlistId)}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Card.Title>
                      <Card.Text>
                        <small>Owned by: {playlist.owner}</small>
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="primary"
                          style={{
                            backgroundColor: "#ffa500",
                            borderColor: "#ffa500",
                          }}
                          onClick={() => handleViewPlaylistClick(playlist)}
                        >
                          View Playlist
                        </Button>
                        <FaHeart
                          className="favorite-icon me-3"
                          onClick={() => toggleFavorite(playlist.playlistId)}
                          style={{
                            cursor: "pointer",
                            color: favorites.has(playlist.playlistId)
                              ? "#ffa500"
                              : "#ddd",
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <Row className="mt-4">
            <Col>
              <h2 className="playlist-header">Public Playlists</h2>
            </Col>
          </Row>
          <Row
            className="mt-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {publicPlaylists.length === 0 ? (
              <Col className="text-center">No public playlists available</Col>
            ) : (
              publicPlaylists
                .filter(
                  (playlist) =>
                    !myPlaylists.some(
                      (myPlaylist) =>
                        myPlaylist.playlistId === playlist.playlistId
                    )
                )
                .map((playlist) => (
                  <Col
                    key={playlist.playlistId}
                    xs={12}
                    sm={6}
                    md={4}
                    className="mb-4"
                  >
                    <Card className="playlist-card">
                      <Card.Img
                        variant="top"
                        src={playlist.imageUrl}
                        className="playlist-image"
                      />
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <Card.Title className="playlist-title">
                          {playlist.name}
                        </Card.Title>
                        <Card.Text>
                          <small>Owned by: {playlist.owner}</small>
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            variant="primary"
                            style={{
                              backgroundColor: "#ffa500",
                              borderColor: "#ffa500",
                            }}
                          >
                            View Playlist
                          </Button>
                          <FaHeart
                            className="favorite-icon me-3"
                            onClick={() => toggleFavorite(playlist.playlistId)}
                            style={{
                              cursor: "pointer",
                              color: favorites.has(playlist.playlistId)
                                ? "#ffa500"
                                : "#ddd",
                            }}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
            )}
          </Row>

          {/* Add Playlist Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Playlist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPlaylistName">
                  <Form.Label>Playlist Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newPlaylist.name}
                    onChange={(e) =>
                      setNewPlaylist({ ...newPlaylist, name: e.target.value })
                    }
                    placeholder="Enter playlist name"
                  />
                </Form.Group>

                <Form.Group controlId="formPlaylistImage" className="mt-3">
                  <Form.Label>Playlist Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Form.Group>

                <Form.Group controlId="formPlaylistVisibility" className="mt-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Public"
                    name="visibilityOptions"
                    checked={newPlaylist.isPublic}
                    onChange={() =>
                      setNewPlaylist({ ...newPlaylist, isPublic: true })
                    }
                  />
                  <Form.Check
                    type="radio"
                    label="Private"
                    name="visibilityOptions"
                    checked={!newPlaylist.isPublic}
                    onChange={() =>
                      setNewPlaylist({ ...newPlaylist, isPublic: false })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleAddPlaylist}
                style={{
                  backgroundColor: "#ffa500",
                  borderColor: "#ffa500",
                }}
              >
                Add Playlist
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Playlist Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Playlist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPlaylistName">
                  <Form.Label>Playlist Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editPlaylist?.name || ""}
                    onChange={(e) =>
                      setEditPlaylist({
                        ...editPlaylist,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter playlist name"
                  />
                </Form.Group>

                <Form.Group controlId="formPlaylistImage" className="mt-3">
                  <Form.Label>Playlist Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Form.Group>

                <Form.Group controlId="formPlaylistVisibility" className="mt-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Public"
                    name="visibilityOptions"
                    checked={editPlaylist?.isPublic}
                    onChange={() =>
                      setEditPlaylist({
                        ...editPlaylist,
                        isPublic: true,
                      })
                    }
                  />
                  <Form.Check
                    type="radio"
                    label="Private"
                    name="visibilityOptions"
                    checked={!editPlaylist?.isPublic}
                    onChange={() =>
                      setEditPlaylist({
                        ...editPlaylist,
                        isPublic: false,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                style={{
                  backgroundColor: "#ffa500",
                  borderColor: "#ffa500",
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default PlaylistComponent;
