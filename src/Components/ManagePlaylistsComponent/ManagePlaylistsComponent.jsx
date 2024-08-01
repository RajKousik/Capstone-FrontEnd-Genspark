import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ManagePlaylistsComponent.css";
import {
  getAllPlaylists,
  deletePlaylist,
  getPublicPlaylists,
} from "../../api/data/playlists/playlist";
import { getSongsByPlaylistId } from "../../api/data/playlistsongs/playlistsongs";
import { getUserById } from "../../api/data/users/user";
import {
  formatDateTime,
  getEnrichedPlaylists,
} from "../../api/utility/commonUtils";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Tooltip } from "primereact/tooltip";

function ManagePlaylistsComponent() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const dt = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPublicPlaylists();
        const enrichedPlaylists = await getEnrichedPlaylists(response);
        const playlistsWithSongs = await Promise.all(
          enrichedPlaylists.map(async (playlist) => {
            const songs = await getSongsByPlaylistId(playlist.playlistId);
            return { ...playlist, songs };
          })
        );
        setPlaylists(playlistsWithSongs);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setError("Failed to fetch playlists.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const confirmDeletePlaylist = () => {
    if (selectedPlaylist) {
      deletePlaylist(selectedPlaylist.playlistId);
      setPlaylists(
        playlists.filter(
          (playlist) => playlist.playlistId !== selectedPlaylist.playlistId
        )
      );
      setSelectedPlaylist(null);
      setIsDeleteDialogVisible(false);
    }
  };

  const imageBodyTemplate = (playlist) => {
    return (
      <img
        src={playlist.imageUrl}
        alt={playlist.name}
        style={{ height: "100px" }}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  const cols = [
    { field: "playlistId", header: "Playlist Id" },
    { field: "name", header: "Name" },
    { field: "userId", header: "User Id" },
    { field: "songId", header: "Song Id" },
    { field: "title", header: "Song Title" },
    { field: "genre", header: "Song Genre" },
    { field: "duration", header: "Song Duration" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    const doc = new jsPDF();
    const rows = [];

    playlists.forEach((playlist) => {
      if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach((song) => {
          rows.push({
            playlistId: playlist.playlistId,
            name: playlist.name,
            userId: playlist.userId,
            songId: song.songId,
            title: song.title,
            genre: song.genre,
            duration: formatDuration(song.duration),
          });
        });
      } else {
        rows.push({
          playlistId: playlist.playlistId,
          name: playlist.name,
          userId: playlist.userId,
          songId: "N/A",
          title: "N/A",
          genre: "N/A",
          duration: "N/A",
        });
      }
    });

    doc.autoTable(exportColumns, rows);
    doc.save("public_playlists.pdf");
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(playlists);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Public Playlists");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "Public Playlists");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data = new Blob([buffer], { type: EXCEL_TYPE });

    saveAs(
      data,
      `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
    );
  };

  const header = (
    <div className="table-header">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "2px" }}>
        <Tooltip target=".export-buttons>button" position="bottom" />
        {/* <h2 className="p-m-0">Songs List</h2> */}
        <Button
          type="button"
          title="Download as CSV"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          title="Download as XLS"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          title="Download as PDF"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
      <div
        className="group"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span className="global-filter-container">
          <InputText
            type="search"
            placeholder="Search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            className="global-filter-input"
          />
        </span>
        <Button
          icon="pi pi-minus"
          className="ms-2 color-bg border border-none rounded"
          style={{ backgroundColor: "red" }}
          label="Delete Playlist"
          disabled={!selectedPlaylist}
          onClick={() => setIsDeleteDialogVisible(true)}
        />
      </div>
    </div>
  );

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h6>Songs Information for Playlist '{data.name}'</h6>

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

  const allowExpansion = (rowData) => {
    return rowData.songs && rowData.songs.length > 0;
  };

  return (
    <div className="manage-playlists-container p-2 card">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        value={playlists}
        paginator
        rows={5}
        ref={dt}
        loading={loading}
        header={header}
        globalFilter={globalFilter}
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        autoLayout
        scrollable
        scrollHeight="calc(100vh - 200px)"
        selection={selectedPlaylist}
        onSelectionChange={(e) => setSelectedPlaylist(e.value)}
        className="p-datatable-gridlines p-datatable-striped"
        dataKey="playlistId"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        globalFilterFields={["playlistId", "name", "userId"]}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          expander={allowExpansion}
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="playlistId"
          header="Playlist ID"
          sortable
          filter
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="name"
          header="Name"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="username"
          header="User"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="imageUrl"
          header="Image"
          body={imageBodyTemplate}
          filter={false} // Disable filtering on imageUrl column
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        {/* <Column
          header="Actions"
          body={(rowData) => (
            <div>
              <Button
                label="Songs"
                className="p-button-info"
                style={{ marginRight: ".5em" }}
              />
            </div>
          )}
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        /> */}
      </DataTable>

      <Dialog
        visible={isDeleteDialogVisible}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setIsDeleteDialogVisible(false)}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDeletePlaylist}
              autoFocus
            />
          </div>
        }
        onHide={() => setIsDeleteDialogVisible(false)}
      >
        <p>
          Are you sure you want to delete the playlist{" "}
          <b>{selectedPlaylist && selectedPlaylist.name}</b>?
        </p>
      </Dialog>
    </div>
  );
}

export default ManagePlaylistsComponent;
