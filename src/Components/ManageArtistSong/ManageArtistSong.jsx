import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useAuth } from "../../contexts/AuthContext"; // Custom hook for authentication
import {
  createSong,
  updateSong,
  deleteSongById,
  deleteSongsRange,
} from "../../api/data/songs/song"; // Mocked API functions
import { getSongsByArtistId } from "../../api/data/artists/artist"; // Mocked API functions
import {
  getEnrichedSongs,
  getEnrichedSong,
  formatDateTime,
} from "../../api/utility/commonUtils";
import "./ManageArtistSong.css";
import { FileUpload } from "primereact/fileupload";
import { uploadAudio, uploadImage } from "../../cloudinary/cloudinary";
import GenreTypes from "../../api/utility/genreTypes";
import { Dropdown } from "primereact/dropdown";
import { getAlbumByArtistId } from "../../api/data/albums/album";

export default function ManageArtistSong() {
  const { user } = useAuth(); // Assuming useAuth provides user details including artistId
  let emptySong = {
    songId: null,
    title: "",
    artistId: user.artistId,
    albumId: "",
    genre: "",
    duration: 0,
    releaseDate: "",
    url: "",
    imageUrl: "",
  };

  const [songs, setSongs] = useState(null);
  const [addSongDialog, setAddSongDialog] = useState(false);
  const [editSongDialog, setEditSongDialog] = useState(false);
  const [deleteSongDialog, setDeleteSongDialog] = useState(false);
  const [deleteSongsDialog, setDeleteSongsDialog] = useState(false);
  const [song, setSong] = useState(emptySong);
  const [addSong, setAddSong] = useState(emptySong);
  const [editSong, setEditSong] = useState(emptySong);
  const [selectedSongs, setSelectedSongs] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);

  const [editImageFile, setEditImageFile] = useState(null);
  const [editAudioFile, setEditAudioFile] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editAudioUrl, setEditAudioUrl] = useState("");
  const [editAudioDuration, setEditAudioDuration] = useState(0);

  const dt = useRef(null);

  const [albumOptions, setAlbumOptions] = useState([]);

  const [isDataFetched, setIsDataFetched] = useState(false);

  // Fetch albums by artistId and update the state
  const fetchAlbums = async (artistId) => {
    try {
      const response = await getAlbumByArtistId(artistId);
      let options = [];
      if (response) {
        options = [
          ...response.map((album) => ({
            label: album.title,
            value: album.albumId,
          })),
          // Add the "None" option
        ];
      }
      options.push({ label: "None", value: -1 });
      setAlbumOptions(options);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // Call fetchAlbums when the artistId changes or when the component mounts
  useEffect(() => {
    // if (song.artistId) {
    fetchAlbums(user.artistId);
    // }
  }, []);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await getSongsByArtistId(user.artistId);
        if (response.length > 0) {
          const enrichedSongs = await getEnrichedSongs(response);
          if (enrichedSongs) setSongs(enrichedSongs);
          console.log("hello :>> ");
        }
      } catch (error) {
        console.error(error);
      }
      setIsDataFetched(true);
    }
    fetchSongs();
  }, []);

  const openNew = () => {
    setAddSong(emptySong);
    setSubmitted(false);
    setAddSongDialog(true);
  };

  const openEdit = () => {
    setSubmitted(false);
    setEditSongDialog(true);
  };

  const hideAddDialog = () => {
    setSubmitted(false);
    setAddSongDialog(false);
  };

  const hideEditDialog = () => {
    setSubmitted(false);
    setEditSongDialog(false);
  };

  const hideDeleteSongDialog = () => {
    setDeleteSongDialog(false);
  };

  const hideDeleteSongsDialog = () => {
    setDeleteSongsDialog(false);
  };

  const handleEditClick = (selectedSong) => {
    openEdit();
    setEditSong({ ...selectedSong });
    setEditSongDialog(true);
  };

  const confirmDeleteSong = (song) => {
    setSong(song);
    setDeleteSongDialog(true);
  };

  const deleteSong = async () => {
    try {
      let _songs = songs.filter((val) => val.id !== song.songId);
      const response = await deleteSongById(song.songId);
      setSongs(_songs);
      setDeleteSongDialog(false);
      setSong(emptySong);
      toast.success(`Song Deleted Successfully`, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].songId === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteSongsDialog(true);
  };

  const deleteSelectedSongs = async () => {
    try {
      const selectedSongIds = selectedSongs.map((song) => song.songId);

      console.log("selectedSongs :>> ", selectedSongIds);
      let _songs = songs.filter((val) => !selectedSongs.includes(val));
      setSongs(_songs);

      const response = await deleteSongsRange(selectedSongIds);

      toast.success("Songs Deleted Successfully", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      toast.success(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
    setDeleteSongsDialog(false);
    setSelectedSongs(null);
  };

  const onAddInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _song = { ...addSong };
    _song[`${name}`] = val;
    setAddSong(_song);
  };

  const onEditInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _song = { ...editSong };
    _song[`${name}`] = val;
    setEditSong(_song);
  };

  const handleImageUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        setImageUrl(imageUrl);
      }
      setImageFile(file);
    }
  };

  const handleAudioUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.floor(audio.duration));
      };

      const audioUrlLink = await uploadAudio(file);
      setAudioFile(file);
      setAudioUrl(audioUrlLink);
    }
  };

  const handleEditImageUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        setEditImageUrl(imageUrl);
      }
      setEditImageFile(file);
    }
    return true;
  };

  const handleEditAudioUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        console.log(
          " Math.floor(audio.duration):>> ",
          Math.floor(audio.duration)
        );
        setEditAudioDuration(Math.floor(audio.duration));
      };

      const audioUrlLink = await uploadAudio(file);
      setEditAudioFile(file);
      setEditAudioUrl(audioUrlLink);
    }
  };

  const titleBodyTemplate = (rowData) => {
    return <span>{rowData.title}</span>;
  };

  const albumBodyTemplate = (rowData) => {
    return <span>{rowData.albumName}</span>;
  };

  const genreBodyTemplate = (rowData) => {
    return <span>{rowData.genre}</span>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="me-2"
          onClick={() => handleEditClick(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteSong(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="my-1">Manage Songs</h4>
      <div
        className="global-filter-container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="header-left" style={{ display: "flex", gap: "10px" }}>
          <InputText
            type="search"
            placeholder="Search"
            onInput={(e) => {
              setGlobalFilter(e.target.value);
            }}
            className="global-filter-input"
          />

          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedSongs || !selectedSongs.length}
          />
        </div>
        <div className="header-right">
          <Button
            label="Export"
            icon="pi pi-upload"
            className="p-button-help"
            onClick={() => dt.current.exportCSV()}
          />
        </div>
      </div>
    </div>
  );

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const imageBodyTemplate = (song) => {
    return (
      <img
        src={song.imageUrl}
        alt={song.title}
        style={{ height: "100px" }}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  const urlBodyTemplate = (song) => {
    // Display song URL or audio player if possible
    return (
      <audio
        controls
        controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
      >
        <source src={song.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  const updateSongDetails = async () => {
    setSubmitted(true);

    console.log(editSong);

    // Check for required fields
    const hasEditSongFields = editSong.imageUrl && editSong.url;
    const hasEditImageAudioFields = editImageUrl && editAudioUrl;

    if (!hasEditSongFields && !hasEditImageAudioFields) {
      console.error("Image and audio files are required");
      toast.error("Image and audio files are required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    if (!editSong.title || !editSong.genre) {
      toast.error("Title, Album and Genre are required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    const songToBeUpdated = {
      title: editSong.title,
      albumId: editSong.albumId != -1 ? editSong.albumId : null,
      genre: editSong.genre,
      imageUrl: editImageUrl ? editImageUrl : editSong.imageUrl,
      url: editAudioUrl ? editAudioUrl : editSong.url,
      duration: editAudioDuration ? editAudioDuration : editSong.duration,
      artistId: editSong.artistId,
    };

    console.log("songToBeUpdated :>> ", songToBeUpdated);

    let _songs = [...songs]; // Copy existing songs

    try {
      const response = await updateSong(editSong.songId, songToBeUpdated);
      const enrichedSong = await getEnrichedSong(response);
      const index = findIndexById(editSong.songId);
      _songs[index] = enrichedSong;
      setSongs(_songs);
      toast.success("Song Updated", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
    setEditSongDialog(false);
    setEditSong(emptySong);
    setEditImageFile(null);
    setEditAudioFile(null);
    setEditImageUrl("");
    setEditAudioUrl("");

    return;
  };

  const addNewSong = async () => {
    setSubmitted(true);

    if (!imageUrl || !audioUrl) {
      console.error("Image and audio files are required");
      toast.error("Image and audio files are required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    if (!addSong.title || !addSong.albumId || !addSong.genre) {
      toast.error("Title, Album and Genre are required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    const song = {
      title: addSong.title,
      albumId: addSong.albumId != -1 ? addSong.albumId : null,
      genre: addSong.genre,
      imageUrl: imageUrl,
      url: audioUrl,
      duration: audioDuration,
      artistId: addSong.artistId,
    };

    let _songs = [];
    if (songs) _songs = [...songs]; // Copy existing songs

    try {
      const response = await createSong(song);
      const enrichedSong = await getEnrichedSong(response);
      _songs.push(enrichedSong);
      setSongs(_songs);
      toast.success("Song Created", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
    setAddSongDialog(false);
    setAddSong(emptySong);
    setImageFile(null);
    setAudioFile(null);
    setImageUrl("");
    setAudioUrl("");
  };

  const songAddDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideAddDialog}
      />
      <Button label="Save" icon="pi pi-check" onClick={addNewSong} />
    </React.Fragment>
  );

  const songEditDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideEditDialog}
      />
      <Button label="Save" icon="pi pi-check" onClick={updateSongDetails} />
    </React.Fragment>
  );

  const deleteSongDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideDeleteSongDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSong}
      />
    </React.Fragment>
  );
  const deleteSongsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideDeleteSongsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedSongs}
      />
    </React.Fragment>
  );

  const genreOptions = Object.values(GenreTypes).map((genre) => ({
    label: genre.name,
    value: genre.name,
  }));

  if (!isDataFetched) {
    return (
      <div className="text-center mt-5 home-container">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#ffa500" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="grid crud-demo">
        <div className="col-12">
          <div className="card">
            <DataTable
              emptyMessage={"No Songs Available"}
              ref={dt}
              value={songs}
              selection={selectedSongs}
              onSelectionChange={(e) => setSelectedSongs(e.value)}
              dataKey="id"
              paginator
              rows={3}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} songs"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                field="title"
                header="Title"
                body={titleBodyTemplate}
                sortable
                headerStyle={{
                  textAlign: "center",
                  backgroundColor: "#ffa500",
                }}
                style={{ minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column
                field="albumName"
                header="Album"
                body={albumBodyTemplate}
                sortable
                headerStyle={{
                  textAlign: "center",
                  backgroundColor: "#ffa500",
                }}
                style={{ minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column
                field="genre"
                header="Genre"
                body={genreBodyTemplate}
                sortable
                headerStyle={{
                  textAlign: "center",
                  backgroundColor: "#ffa500",
                }}
                style={{ minWidth: "4rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column
                field="duration"
                header="Duration"
                body={(rowData) => formatDuration(rowData.duration)}
                headerStyle={{
                  backgroundColor: "#ffa500",
                  textAlign: "center",
                }}
                bodyStyle={{ textAlign: "center" }}
                style={{ minWidth: "4rem" }}
              />
              <Column
                field="releaseDate"
                header="Release Date"
                sortable
                filter
                style={{ minWidth: "4rem" }}
                body={(rowData) => formatDateTime(rowData.releaseDate)}
                headerStyle={{
                  backgroundColor: "#ffa500",
                  textAlign: "center",
                }}
                bodyStyle={{ textAlign: "center" }}
              />
              <Column
                field="imageUrl"
                header="Image"
                body={imageBodyTemplate}
                filter={false} // Disable filtering on imageUrl column
                headerStyle={{
                  backgroundColor: "#ffa500",
                  textAlign: "center",
                }}
                bodyStyle={{ textAlign: "center" }}
              />
              <Column
                field="url"
                header="Song"
                body={urlBodyTemplate}
                headerStyle={{
                  backgroundColor: "#ffa500",
                  textAlign: "center",
                }}
                bodyStyle={{ textAlign: "center" }}
                style={{ minWidth: "4rem" }}
              />
              <Column
                body={actionBodyTemplate}
                exportable={false}
                headerStyle={{
                  textAlign: "center",
                  backgroundColor: "#ffa500",
                }}
                style={{ minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            </DataTable>

            <Dialog
              visible={addSongDialog}
              style={{ width: "450px" }}
              header="Song Details"
              modal
              id="song-add-dialog"
              className="p-fluid"
              footer={songAddDialogFooter}
              onHide={hideAddDialog}
            >
              <div className="field">
                <label htmlFor="title">Title</label>
                <InputText
                  id="title"
                  value={addSong.title}
                  onChange={(e) => onAddInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !addSong.title,
                  })}
                />
                {submitted && !addSong.title && (
                  <small className="p-invalid">Title is required.</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="album">Album</label>
                <Dropdown
                  id="album"
                  value={addSong.albumId}
                  options={albumOptions}
                  onChange={(e) => onAddInputChange(e, "albumId")}
                  placeholder="Select an Album"
                  required
                  className={classNames({
                    "p-invalid": submitted && addSong.albumId,
                  })}
                />
                {submitted && !addSong.albumId && (
                  <small className="p-invalid">Album is required.</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="genre">Genre</label>
                <Dropdown
                  id="genre"
                  value={addSong.genre}
                  options={genreOptions}
                  onChange={(e) => onAddInputChange(e, "genre")}
                  placeholder="Select a Genre"
                  required
                  className={classNames({
                    "p-invalid": submitted && !addSong.genre,
                  })}
                />
                {submitted && !addSong.genre && (
                  <small className="p-invalid">Genre is required.</small>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="imageUpload">Uploaded Image</label>
                <FileUpload
                  name="addImageUpload"
                  customUpload
                  uploadHandler={handleImageUpload}
                  accept="image/*"
                  maxFileSize={1000000} // 1MB
                />
                {submitted && !addSong.imageFile && !addSong.imageUrl && (
                  <small className="p-invalid">Image file is required.</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="audioUpload">Upload Audio</label>
                <FileUpload
                  name="addAudioUpload"
                  customUpload
                  uploadHandler={handleAudioUpload}
                  accept="audio/*"
                  maxFileSize={10000000} // 10MB
                />
                {submitted && !addSong.audioFile && !addSong.url && (
                  <small className="p-invalid">Audio file is required.</small>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={editSongDialog}
              style={{ width: "450px" }}
              header="Song Details"
              modal
              id="song-edit-dialog"
              className="p-fluid"
              footer={songEditDialogFooter}
              onHide={hideEditDialog}
            >
              <div className="field">
                <label htmlFor="title">Title</label>
                <InputText
                  id="title"
                  value={editSong.title}
                  onChange={(e) => onEditInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !editSong.title,
                  })}
                />
                {submitted && !editSong.title && (
                  <small className="p-invalid">Title is required.</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="album">Album</label>
                <Dropdown
                  id="album"
                  value={editSong.albumId}
                  options={albumOptions}
                  onChange={(e) => onEditInputChange(e, "albumId")}
                  placeholder="Select an Album"
                  required
                  className={classNames({
                    "p-invalid": submitted && editSong.albumId,
                  })}
                />
                {submitted && !editSong.albumId && (
                  <small className="p-invalid">Album is required.</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="genre">Genre</label>
                <Dropdown
                  id="genre"
                  value={editSong.genre}
                  options={genreOptions}
                  onChange={(e) => onEditInputChange(e, "genre")}
                  placeholder="Select a Genre"
                  required
                  className={classNames({
                    "p-invalid": submitted && !editSong.genre,
                  })}
                />
                {submitted && !editSong.genre && (
                  <small className="p-invalid">Genre is required.</small>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="imageUpload">Upload Image</label>
                <div>
                  <img
                    src={editSong.imageUrl}
                    alt="Uploaded Image"
                    style={{ maxWidth: "100%", marginBottom: "10px" }}
                  />
                </div>
                <FileUpload
                  name="editImageUpload"
                  url={"/api/upload"}
                  customUpload
                  uploadHandler={handleEditImageUpload}
                  onUpload={async () => {
                    console.log("upload completed");
                  }}
                  accept="image/*"
                  maxFileSize={1000000} // 1MB
                />
                {submitted && !editSong.imageFile && !editSong.imageUrl && (
                  <small className="p-invalid">Image file is required.</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="audioUpload">Upload Audio</label>
                <FileUpload
                  name="editAudioUpload"
                  customUpload
                  uploadHandler={handleEditAudioUpload}
                  accept="audio/*"
                  maxFileSize={10000000} // 10MB
                />
                {submitted && !editSong.audioFile && !editSong.url && (
                  <small className="p-invalid">Audio file is required.</small>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteSongDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteSongDialogFooter}
              onHide={hideDeleteSongDialog}
            >
              <div className="confirmation-content">
                <i
                  className="pi pi-exclamation-triangle me-3"
                  style={{ fontSize: "2rem" }}
                />
                {song && (
                  <span>
                    Are you sure you want to delete <b>{song.title}</b>?
                  </span>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteSongsDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteSongsDialogFooter}
              onHide={hideDeleteSongsDialog}
            >
              <div className="confirmation-content">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedSongs && (
                  <span>
                    Are you sure you want to delete the selected songs?
                  </span>
                )}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
