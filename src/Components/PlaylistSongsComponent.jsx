import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Dropdown,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaHeart,
  FaPlay,
  FaPause,
  FaRegHeart,
  FaMinus,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { useMusic } from "../contexts/MusicContext"; // Adjust the import path as necessary
import "../css/PlaylistSongsComponent.css"; // Adjust the import path as necessary
import {
  getSongsByPlaylistId,
  addSongToPlaylist,
  removeSongFromPlaylist,
  clearSongsFromPlaylist,
} from "../api/data/playlistsongs/playlistsongs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { getArtistById } from "../api/data/artists/artist";
import { getAlbumById } from "../api/data/albums/album";
import { formatDateTime } from "../api/utility/commonUtils";

const PlaylistSongsComponent = ({
  playlistSongs,
  playlist,
  handleBackClick,
  setPlaylistSongs,
  isUserPlaylist,
}) => {
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    toggleLike,
    songs,
  } = useMusic();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePlayPause = (song) => {
    if (currentSong.songId === song.songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleLike = (songId) => {
    toggleLike(songId);
  };

  const handleAddSong = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowClearModal(false);
  };

  const handleSongSelection = (song) => {
    setSelectedSong(song);
  };

  const handleAddToPlaylist = async () => {
    if (selectedSong && playlist) {
      try {
        await addSongToPlaylist(playlist.playlistId, selectedSong.songId);
        const updatedSongs = await getSongsByPlaylistId(playlist.playlistId);
        const enrichedSongs = await Promise.all(
          updatedSongs.map(async (song) => {
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
        toast.success("Song added to playlist!", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      } catch (error) {
        console.error("Error adding song to playlist:", error);
        toast.error(
          error?.response?.data?.message || "Error adding song to playlist",
          {
            position: "top-right",
            autoClose: 1500,
            pauseOnHover: false,
          }
        );
      } finally {
        handleModalClose();
      }
    }
  };

  const handleRemoveSong = async (songId) => {
    if (playlist) {
      try {
        await removeSongFromPlaylist(playlist.playlistId, songId);
        const updatedSongs = await getSongsByPlaylistId(playlist.playlistId);
        const enrichedSongs = await Promise.all(
          updatedSongs.map(async (song) => {
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
        toast.success("Song removed from playlist.", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      } catch (error) {
        console.error("Error removing song from playlist:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to remove song from playlist.",
          {
            position: "top-right",
            autoClose: 1500,
            pauseOnHover: false,
          }
        );
      }
    }
  };

  const handleClearPlaylist = async () => {
    if (playlist) {
      try {
        await clearSongsFromPlaylist(playlist.playlistId);
        setPlaylistSongs([]);
        toast.success("Playlist cleared.", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      } catch (error) {
        console.error("Error clearing playlist:", error);
        toast.error(
          error?.response?.data?.message || "Failed to clear playlist.",
          {
            position: "top-right",
            autoClose: 1500,
            pauseOnHover: false,
          }
        );
      }
    }
    handleModalClose();
  };

  // Filter out songs that are already in the current playlist
  const songsInPlaylist = new Set(playlistSongs?.map((song) => song.songId));
  const filteredSongs = songs.filter(
    (song) => !songsInPlaylist.has(song.songId)
  );

  const options = filteredSongs.map((song) => ({
    value: song.songId,
    label: song.title,
  }));

  return (
    <Container style={{ paddingBottom: "120px" }}>
      <Row className="mt-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <Button
                variant="link"
                onClick={handleBackClick}
                style={{
                  color: "#ffa500",
                  fontSize: "1.5rem",
                  padding: "0px",
                  paddingRight: "10px",
                }}
              >
                <FaArrowLeft />
              </Button>
              <h2 className="playlist-header m-0">{playlist.name}</h2>
            </div>
            {isUserPlaylist && (
              <div className="add-clear">
                <Button
                  variant="text"
                  onClick={handleAddSong}
                  style={{ color: "#ffa500", padding: "0px" }}
                  className="add-btn"
                >
                  <FaPlus /> <span id="md-screen">Add Songs</span>
                </Button>
                <Button
                  variant="text"
                  onClick={() => setShowClearModal(true)}
                  className="clear-btn"
                  style={{ color: "red", padding: "0px" }}
                >
                  <IoIosRemoveCircle />{" "}
                  <span id="md-screen">Clear Playlist</span>
                </Button>
              </div>
            )}
          </div>
          <div className="playlist-songs">
            {playlistSongs?.length > 0 ? (
              playlistSongs.map((song) => (
                <Card key={song.songId} className="song-card mb-3">
                  <div className="song-image-container">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="song-image m-0"
                    />
                    <div className="play-pause-overlay">
                      <Button
                        variant="link"
                        onClick={() => handlePlayPause(song)}
                        className="play-pause-btn"
                      >
                        {currentSong.songId === song.songId && isPlaying ? (
                          <FaPause
                            className="pause-btn"
                            style={{ color: "#ffa500", fontSize: "30px" }}
                          />
                        ) : (
                          <FaPlay
                            className="play-btn"
                            style={{ color: "#ffa500", fontSize: "30px" }}
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="song-info">
                      <div className="song-details">
                        <Card.Title>{song.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {song.artistName}
                        </Card.Subtitle>
                      </div>
                      <div className="song-actions">
                        <div className="like-remove">
                          <Button
                            variant="link"
                            onClick={() => handleLike(song.songId)}
                            className="like-btn"
                          >
                            {likedSongs.has(song.songId) ? (
                              <FaHeart
                                className="heart-icon"
                                style={{ color: "#ffa500" }}
                              />
                            ) : (
                              <FaRegHeart
                                className="heart-icon"
                                style={{ color: "#ffa500" }}
                              />
                            )}
                          </Button>
                          {isUserPlaylist && (
                            <Button
                              variant="link"
                              className="remove-btn"
                              onClick={() => handleRemoveSong(song.songId)}
                            >
                              <FaMinus
                                style={{ color: "red", fontSize: "30px" }}
                              />
                            </Button>
                          )}
                        </div>
                        <div className="release-date">{song.releaseDate}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div
                className="mt-3 ms-4"
                style={{ fontSize: "15px", fontWeight: "bold" }}
              >
                No songs in the playlist
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={showAddModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Songs to Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            options={options}
            onChange={(option) =>
              handleSongSelection(
                songs.find((song) => song.songId === option.value)
              )
            }
            placeholder="Search and select a song..."
            isSearchable
            isClearable
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddToPlaylist}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Clear Playlist Confirmation Modal */}
      <Modal show={showClearModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to clear this playlist?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearPlaylist}>
            Clear
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default PlaylistSongsComponent;
