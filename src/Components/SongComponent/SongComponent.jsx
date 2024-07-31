import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar, FaPlay, FaPause, FaRegStar } from "react-icons/fa";
import "./SongComponent.css";
import { formatDateTime } from "../../api/utility/commonUtils";
import Aos from "aos";
import "aos/dist/aos.css";
import { getArtistById } from "../../api/data/artists/artist";
import { getAlbumById } from "../../api/data/albums/album";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import {
  getRatingsByUserId,
  submitRating,
  updateRating,
} from "../../api/data/ratings/rating"; // Import rating functions
import { useMusic } from "../../contexts/MusicContext";

const SongDetailComponent = ({ song }) => {
  const { user } = useAuth(); // Get the current user
  const [rating, setRating] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [songDetails, setSongDetails] = useState(song);
  const [userRating, setUserRating] = useState(null); // Store the user's rating

  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    toggleLike,
    songs,
    isPlayerVisible,
    setIsPlayerVisible,
  } = useMusic();

  useEffect(() => {
    setIsPlayerVisible(false);
  }, []);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const artist = await getArtistById(song.artistId);
        const album = await getAlbumById(song.albumId);

        setSongDetails((prevDetails) => ({
          ...prevDetails,
          artistName: artist.name,
          albumName: album ? album.title : "Single",
          releaseDate: formatDateTime(song.releaseDate),
          id: song.songId,
        }));
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const ratings = await getRatingsByUserId(user.userId);
        const currentRating = ratings.find((r) => r.songId === song.songId);
        if (currentRating) {
          setUserRating(currentRating.ratingValue);
          setRating(currentRating.ratingValue); // Set the rating value if exists
        }
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    };

    fetchSongDetails();
    fetchUserRating();
  }, [song, user.userId]);

  const handleRatingClick = async (value) => {
    setRating(value);
    if (userRating) {
      // If the user already rated, update the rating
      await updateRating({
        userId: user.userId,
        songId: song.songId,
        ratingValue: value,
      });
    } else {
      // If not rated, submit a new rating
      await submitRating({
        userId: user.userId,
        songId: song.songId,
        ratingValue: value,
      });
    }
    setUserRating(value); // Update local state
  };

  const handlePlayPause = (song) => {
    if (currentSong.songId === song.songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Container fluid className="song-detail-container">
      <Row className="h-100">
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center song-image-col"
        >
          <Card.Img
            variant="top"
            src="https://res.cloudinary.com/deqk5oxse/image/upload/v1722346839/rock_iyotrj.jpg"
            className="song-image"
          />
        </Col>
        <Col md={6} className="song-info-col">
          <Card className="h-100" data-aos="fade-up">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div className="song-info-container">
                <Card.Title className="song-title">
                  {songDetails.title}
                </Card.Title>
                <Card.Text>
                  <span style={{ fontWeight: "bold" }}>Artist Name: </span>{" "}
                  {songDetails.artistName}
                </Card.Text>
                {songDetails.albumName && (
                  <Card.Text>
                    <span style={{ fontWeight: "bold" }}>Album Name: </span>{" "}
                    {songDetails.albumName}
                  </Card.Text>
                )}
                <Card.Text>
                  <span style={{ fontWeight: "bold" }}>Duration:</span>{" "}
                  {songDetails.duration}
                </Card.Text>
                <Card.Text>
                  <span style={{ fontWeight: "bold" }}>Release Date:</span>{" "}
                  {formatDateTime(songDetails.releaseDate)}
                </Card.Text>
                <Card.Text>
                  <span style={{ fontWeight: "bold" }}>Genre:</span>{" "}
                  {songDetails.genre}
                </Card.Text>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FaRegStar
                      key={value}
                      className={`rating-star ${
                        value <= rating ? "active" : ""
                      }`}
                      onClick={() => handleRatingClick(value)}
                    />
                  ))}
                  <Button
                    variant="outline-warning"
                    className="submit-btn"
                    onClick={() => handleRatingClick(rating)}
                  >
                    Submit
                  </Button>
                </div>
              </div>
              <div className="play-pause-container d-flex justify-content-end">
                <Button
                  variant="primary"
                  className="play-pause-btn"
                  onClick={() => handlePlayPause(song)}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SongDetailComponent;
