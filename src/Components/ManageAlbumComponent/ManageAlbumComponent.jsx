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
  createAlbum,
  updateAlbum,
  deleteAlbumById,
  deleteAlbumsRange,
} from "../../api/data/albums/album"; // Mocked API functions
// import { getAlbumByArtistId } from "../../api/data/albums/album"; // Mocked API functions
import { formatDateTime } from "../../api/utility/commonUtils";
import "../ManageArtistSong/ManageArtistSong.css";
import { FileUpload } from "primereact/fileupload";
import { uploadImage } from "../../cloudinary/cloudinary";
import GenreTypes from "../../api/utility/genreTypes";
import { getAlbumByArtistId } from "../../api/data/albums/album";
import { getSongsByAlbumId } from "../../api/data/songs/song";

export default function ManageAlbumComponent() {
  const { user } = useAuth(); // Assuming useAuth provides user details including artistId
  let emptyAlbum = {
    albumId: null,
    title: "",
    artistId: user.artistId,
    coverImageUrl: "",
    releaseDate: "",
  };

  const [albums, setAlbums] = useState(null);
  const [addAlbumDialog, setAddAlbumDialog] = useState(false);
  const [editAlbumDialog, setEditAlbumDialog] = useState(false);
  const [deleteAlbumDialog, setDeleteAlbumDialog] = useState(false);
  const [deleteAlbumsDialog, setDeleteAlbumsDialog] = useState(false);
  const [album, setAlbum] = useState(emptyAlbum);
  const [addAlbum, setAddAlbum] = useState(emptyAlbum);
  const [editAlbum, setEditAlbum] = useState(emptyAlbum);
  const [selectedAlbums, setSelectedAlbums] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [editImageFile, setEditImageFile] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [expandedRows, setExpandedRows] = useState(null);

  const [isDataFetched, setIsDataFetched] = useState(false);

  const dt = useRef(null);

  //   const [albumOptions, setAlbumOptions] = useState([]);

  // Fetch albums by artistId and update the state
  //   const fetchAlbums = async (artistId) => {
  //     try {
  //       const response = await getAlbumByArtistId(artistId);
  //       const options = [
  //         ...response.map((album) => ({
  //           label: album.title,
  //           value: album.albumId,
  //         })),
  //         // Add the "None" option
  //       ];

  //       options.push({ label: "None", value: -1 });
  //       setAlbumOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching albums:", error);
  //     }
  //   };

  //   // Call fetchAlbums when the artistId changes or when the component mounts
  //   useEffect(() => {
  //     // if (song.artistId) {
  //     fetchAlbums(user.artistId);
  //     // }
  //   }, []);

  useEffect(() => {
    async function fetchAlbums() {
      const response = await getAlbumByArtistId(user.artistId);

      if (response.length > 0) {
        const albumsWithSongs = await Promise.all(
          response.map(async (album) => {
            const songs = await getSongsByAlbumId(album.albumId);

            return { ...album, songs };
          })
        );

        setAlbums(albumsWithSongs);
        setIsDataFetched(true);
      }
    }
    fetchAlbums();
  }, [user.artistId]);

  const openNew = () => {
    setAddAlbum(emptyAlbum);
    setSubmitted(false);
    setAddAlbumDialog(true);
  };

  const openEdit = () => {
    setSubmitted(false);
    setEditAlbumDialog(true);
  };

  const hideAddDialog = () => {
    setSubmitted(false);
    setAddAlbumDialog(false);
  };

  const hideEditDialog = () => {
    setSubmitted(false);
    setEditAlbumDialog(false);
  };

  const hideDeleteAlbumDialog = () => {
    setDeleteAlbumDialog(false);
  };

  const hideDeleteAlbumsDialog = () => {
    setDeleteAlbumsDialog(false);
  };

  const handleEditClick = (selectedAlbum) => {
    openEdit();
    setEditAlbum({ ...selectedAlbum });
    setEditAlbumDialog(true);
  };

  const confirmDeleteAlbum = (Album) => {
    setAlbum(Album);
    setDeleteAlbumDialog(true);
  };

  const deleteAlbum = async () => {
    try {
      let _albums = albums.filter((val) => val.albumId !== album.albumId);
      const response = await deleteAlbumById(album.albumId);

      setAlbums(_albums);
      setDeleteAlbumDialog(false);
      setAlbum(emptyAlbum);
      toast.success(`Album Deleted Successfully`, {
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
    for (let i = 0; i < albums.length; i++) {
      if (albums[i].albumId === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteAlbumsDialog(true);
  };

  const deleteSelectedAlbums = async () => {
    try {
      const selectedAlbumIds = selectedAlbums.map((album) => album.albumId);

      let _albums = albums.filter((val) => !selectedAlbums.includes(val));

      const response = await deleteAlbumsRange(selectedAlbumIds);

      setAlbums(_albums);

      toast.success("Albums Deleted Successfully", {
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
    setDeleteAlbumsDialog(false);
    setSelectedAlbums(null);
  };

  const onAddInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _album = { ...addAlbum };
    _album[`${name}`] = val;
    setAddAlbum(_album);
  };

  const onEditInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _album = { ...editAlbum };
    _album[`${name}`] = val;
    setEditAlbum(_album);
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

  //   const handleAudioUpload = async (event) => {
  //     const file = event.files[0];
  //     if (file) {
  //       const audio = new Audio(URL.createObjectURL(file));
  //       audio.onloadedmetadata = () => {
  //
  //           " Math.floor(audio.duration):>> ",
  //           Math.floor(audio.duration)
  //         );
  //         setAudioDuration(Math.floor(audio.duration));
  //       };

  //       const audioUrlLink = await uploadAudio(file);
  //       setAudioFile(file);
  //       setAudioUrl(audioUrlLink);
  //     }
  //   };

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

  //   const handleEditAudioUpload = async (event) => {
  //     const file = event.files[0];
  //     if (file) {
  //       const audio = new Audio(URL.createObjectURL(file));
  //       audio.onloadedmetadata = () => {
  //
  //           " Math.floor(audio.duration):>> ",
  //           Math.floor(audio.duration)
  //         );
  //         setEditAudioDuration(Math.floor(audio.duration));
  //       };

  //       const audioUrlLink = await uploadAudio(file);
  //       setEditAudioFile(file);
  //       setEditAudioUrl(audioUrlLink);
  //     }
  //   };

  const titleBodyTemplate = (rowData) => {
    return <span>{rowData.title}</span>;
  };

  //   const albumBodyTemplate = (rowData) => {
  //     return <span>{rowData.albumName}</span>;
  //   };

  //   const genreBodyTemplate = (rowData) => {
  //     return <span>{rowData.genre}</span>;
  //   };

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
          onClick={() => confirmDeleteAlbum(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="my-1">Manage Albums</h4>
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
            disabled={!selectedAlbums || !selectedAlbums.length}
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

  const songImageBodyTemplate = (song) => {
    return (
      <img
        src={song.imageUrl}
        alt={song.title}
        style={{ height: "100px" }}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  const imageBodyTemplate = (album) => {
    return (
      <img
        src={album.coverImageUrl}
        alt={album.title}
        style={{ height: "100px" }}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  //   const urlBodyTemplate = (song) => {
  //     // Display song URL or audio player if possible
  //     return (
  //       <audio
  //         controls
  //         controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
  //       >
  //         <source src={song.url} type="audio/mpeg" />
  //         Your browser does not support the audio element.
  //       </audio>
  //     );
  //   };

  const updateAlbumDetails = async () => {
    setSubmitted(true);

    // if (!editImageUrl) {
    //   console.error("Image file is required");
    //   toast.error("Image file is required", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     pauseOnHover: false,
    //   });
    //   return;
    // }

    if (!editAlbum.title || !editAlbum.coverImageUrl) {
      toast.error("Title, Image are required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    const albumToBeUpdated = {
      title: editAlbum.title,
      coverImageUrl: editImageUrl ? editImageUrl : editAlbum.coverImageUrl,
      artistId: editAlbum.artistId,
    };

    let _albums = [];
    if (albums) _albums = [...albums]; // Copy existing Albums

    try {
      const response = await updateAlbum(editAlbum.albumId, albumToBeUpdated);
      const index = findIndexById(editAlbum.albumId);
      _albums[index] = response;
      setAlbums(_albums);
      toast.success("Album Updated", {
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
    setEditAlbumDialog(false);
    setEditAlbum(emptyAlbum);
    setEditImageFile(null);
    setEditAudioFile(null);
    setEditImageUrl("");
    setEditAudioUrl("");

    return;
  };

  const addNewAlbum = async () => {
    setSubmitted(true);

    if (!addAlbum.title) {
      toast.error("Title is required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    if (!imageUrl) {
      console.error("Image file is required");
      toast.error("Image file is required", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    const album = {
      title: addAlbum.title,
      coverImageUrl: imageUrl,
      artistId: addAlbum.artistId,
    };

    let _albums = [];
    if (albums) _albums = [...albums]; // Copy existing albums

    try {
      const response = await createAlbum(album);
      _albums.push(response);
      setAlbums(_albums);
      toast.success("Album Created", {
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
    setAddAlbumDialog(false);
    setAddAlbum(emptyAlbum);
    setImageFile(null);
    setImageUrl("");
  };

  const albumAddDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideAddDialog}
      />
      <Button label="Save" icon="pi pi-check" onClick={addNewAlbum} />
    </React.Fragment>
  );

  const albumEditDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        className="me-2"
        onClick={hideEditDialog}
      />
      <Button label="Save" icon="pi pi-check" onClick={updateAlbumDetails} />
    </React.Fragment>
  );

  const deleteAlbumDialogFooter = (
    <React.Fragment>
      <Button
        className="me-2"
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteAlbumDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteAlbum}
      />
    </React.Fragment>
  );
  const deleteAlbumsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="me-2"
        outlined
        onClick={hideDeleteAlbumsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedAlbums}
      />
    </React.Fragment>
  );

  const allowExpansion = (rowData) => {
    return rowData.songs && rowData.songs.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h6>Songs Information for Album '{data.title}'</h6>

        <DataTable value={data.songs} globalFilter={globalFilter}>
          <Column
            field="songId"
            header="Song Id"
            sortable
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            field="title"
            header="Title"
            sortable
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            field="genre"
            header="Genre"
            sortable
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            field="duration"
            header="Duration"
            body={(rowData) => formatDuration(rowData.duration)}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            field="releaseDate"
            header="Release Date"
            sortable
            filter
            body={(rowData) => formatDateTime(rowData.releaseDate)}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            field="imageUrl"
            header="Image"
            body={songImageBodyTemplate}
            filter={false} // Disable filtering on imageUrl column
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    );
  };

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
              emptyMessage={"No Albums Available"}
              ref={dt}
              rowExpansionTemplate={rowExpansionTemplate}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              value={albums}
              selection={selectedAlbums}
              onSelectionChange={(e) => setSelectedAlbums(e.value)}
              dataKey="albumId"
              paginator
              rows={3}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Albums"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                expander={allowExpansion}
                headerStyle={{
                  textAlign: "center",
                  backgroundColor: "#ffa500",
                }}
                bodyStyle={{ textAlign: "center" }}
              />
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
                field="coverImageUrl"
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
              visible={addAlbumDialog}
              style={{ width: "450px" }}
              header="Album Details"
              modal
              id="album-add-dialog"
              className="p-fluid"
              footer={albumAddDialogFooter}
              onHide={hideAddDialog}
            >
              <div className="field">
                <label htmlFor="title">Title</label>
                <InputText
                  id="title"
                  value={addAlbum.title}
                  onChange={(e) => onAddInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !addAlbum.title,
                  })}
                />
                {submitted && !addAlbum.title && (
                  <small className="p-invalid">Title is required.</small>
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
                {submitted && !addAlbum.imageFile && !addAlbum.imageUrl && (
                  <small className="p-invalid">Image file is required.</small>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={editAlbumDialog}
              style={{ width: "450px" }}
              header="Album Details"
              modal
              id="album-edit-dialog"
              className="p-fluid"
              footer={albumEditDialogFooter}
              onHide={hideEditDialog}
            >
              <div className="field">
                <label htmlFor="title">Title</label>
                <InputText
                  id="title"
                  value={editAlbum.title}
                  onChange={(e) => onEditInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !editAlbum.title,
                  })}
                />
                {submitted && !editAlbum.title && (
                  <small className="p-invalid">Title is required.</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="imageUpload">Upload Image</label>
                <div>
                  <img
                    src={editAlbum.coverImageUrl}
                    alt="Uploaded Image"
                    style={{ maxWidth: "100%", marginBottom: "10px" }}
                  />
                </div>
                <FileUpload
                  name="editImageUpload"
                  url={"/api/upload"}
                  customUpload
                  uploadHandler={handleEditImageUpload}
                  onUpload={async () => {}}
                  accept="image/*"
                  maxFileSize={1000000} // 1MB
                />
                {submitted &&
                  !editAlbum.imageFile &&
                  !editAlbum.coverImageUrl && (
                    <small className="p-invalid">Image file is required.</small>
                  )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteAlbumDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteAlbumDialogFooter}
              onHide={hideDeleteAlbumDialog}
            >
              <div className="confirmation-content d-flex align-items-center">
                <i
                  className="pi pi-exclamation-triangle me-3 vertical-align-center"
                  style={{ fontSize: "2rem", color: "red" }}
                />
                {album && (
                  <p className="d-inline-block mt-2">
                    Are you sure you want to delete <b>{album.title}</b>?
                  </p>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteAlbumsDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteAlbumsDialogFooter}
              onHide={hideDeleteAlbumsDialog}
            >
              <div className="confirmation-content">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedAlbums && (
                  <span>
                    Are you sure you want to delete the selected Albums?
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
