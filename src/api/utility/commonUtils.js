import { getArtistById } from "../data/artists/artist";
import { getAlbumById } from "../data/albums/album";
import { getUserById } from "../data/users/user";

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = months[dateTime.getMonth()];
  const year = dateTime.getFullYear();

  return `${day} ${month} ${year}`;
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
};

const getEnrichedSongs = async (songs) => {
  const enrichedSongs = await Promise.all(
    songs.map(async (song) => {
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
  return enrichedSongs;
};

const getEnrichedSong = async (song) => {
  const artist = await getArtistById(song.artistId);
  const album = await getAlbumById(song.albumId);
  const enrichedSong = {
    ...song,
    artistName: artist.name,
    albumName: album ? album.title : "Single",
    releaseDate: formatDateTime(song.releaseDate),
    id: song.songId,
  };
  return enrichedSong;
};

const getEnrichedPlaylists = async (playlists) => {
  const enrichedPlaylists = await Promise.all(
    playlists.map(async (playlist) => {
      const user = await getUserById(playlist.userId);
      return {
        ...playlist,
        username: user.username,
      };
    })
  );
  return enrichedPlaylists;
};

export {
  formatDateTime,
  getEnrichedSongs,
  getEnrichedPlaylists,
  getEnrichedSong,
  formatDuration,
};
