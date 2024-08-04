import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./ArtistComponent.css";
import {
  getAllArtists,
  getSongsByArtistId,
} from "../../api/data/artists/artist"; // Adjust the import path as necessary
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMusic } from "../../contexts/MusicContext";
import { getArtistById } from "../../api/data/artists/artist";
import { getAlbumById } from "../../api/data/albums/album";
import { formatDateTime } from "../../api/utility/commonUtils";
import PlaylistSongsComponent from "../PlaylistSongsComponent/PlaylistSongsComponent";

const ArtistComponent = () => {
  const { user } = useAuth();
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState(null);
  const [artists, setArtists] = useState([]);

  const { setIsPlayerVisible } = useMusic();

  useEffect(() => {
    setIsPlayerVisible(false);
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getAllArtists();

        setArtists(artists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast.error("Error fetching artists", {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
        });
      }
    };

    fetchArtists();
  }, [user.userId]);

  const handleViewArtistClick = async (artist) => {
    setSelectedArtist(artist);
    var result = await getSongsByArtistId(artist.artistId);

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

    setArtistSongs(enrichedSongs);
  };

  const handleBackClick = () => {
    setSelectedArtist(null);
  };

  return (
    <>
      {selectedArtist ? (
        <PlaylistSongsComponent
          playlistSongs={artistSongs}
          setPlaylistSongs={setArtistSongs}
          playlist={selectedArtist}
          handleBackClick={handleBackClick}
          isUserPlaylist={false}
        />
      ) : (
        <Container style={{ paddingBottom: "120px" }}>
          <Row className="mt-4">
            <Col>
              <div className="playlist-header-container">
                <h2 className="playlist-header">Artists</h2>
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
            {artists.length === 0 ? (
              <Col className="text-center">No Artists available</Col>
            ) : (
              artists.length > 0 &&
              artists.map((artist) => (
                <Col
                  key={artists.artistsId}
                  xs={12}
                  sm={6}
                  md={4}
                  className="mb-4"
                >
                  <Card className="playlist-card">
                    <Card.Img
                      variant="top"
                      src={artist.imageUrl}
                      className="playlist-image"
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Card.Title className="playlist-title">
                        {artist.name}
                      </Card.Title>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="primary"
                          style={{
                            backgroundColor: "#ffa500",
                            borderColor: "#ffa500",
                          }}
                          onClick={() => handleViewArtistClick(artist)}
                        >
                          View Artist Songs
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default ArtistComponent;
