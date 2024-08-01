import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ManageSongsComponent.css";
import { getAllSongs, deleteSongById } from "../../api/data/songs/song";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Tag } from "primereact/tag";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  formatDateTime,
  getEnrichedSongs,
} from "../../api/utility/commonUtils";
import { FileX } from "react-bootstrap-icons";

function ManageSongsComponent() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const dt = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSongs();
        const enrichedSongs = await getEnrichedSongs(response);
        setSongs(enrichedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError("Failed to fetch songs.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cols = [
    { field: "songId", header: "Song Id" },
    { field: "title", header: "Title" },
    { field: "artistName", header: "Artist" },
    { field: "genre", header: "Genre" },
    { field: "duration", header: "Duration" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    const doc = new jsPDF();

    doc.autoTable(exportColumns, songs);
    doc.save("songs.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(songs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Songs");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "songs");
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

  const confirmDeleteSong = () => {
    if (selectedSong) {
      deleteSongById(selectedSong.songId);
      setSongs(songs.filter((song) => song.songId !== selectedSong.songId));
      setSelectedSong(null);
      setIsDeleteDialogVisible(false);
    }
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
      <audio controls>
        <source src={song.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
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
          label="Delete Song"
          disabled={!selectedSong}
          onClick={() => setIsDeleteDialogVisible(true)}
        />
      </div>
    </div>
  );

  return (
    <div className="manage-songs-container p-2 card">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        ref={dt}
        value={songs}
        paginator
        rows={2}
        loading={loading}
        header={header}
        globalFilter={globalFilter}
        autoLayout
        scrollable
        scrollHeight="calc(100vh - 200px)"
        selection={selectedSong}
        onSelectionChange={(e) => setSelectedSong(e.value)}
        className="p-datatable-gridlines p-datatable-striped"
        dataKey="songId"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        globalFilterFields={["artistId", "name", "email", "bio", "status"]}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          field="songId"
          header="Song ID"
          sortable
          filter
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="title"
          header="Title"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="artistName"
          header="Artist Name"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        {/* <Column
          field="albumName"
          header="Album Name"
          sortable
          filter
          // body={(rowData) => (rowData.albumId ? rowData.albumId : "-")}
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        /> */}
        <Column
          field="genre"
          header="Genre"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="duration"
          header="Duration"
          body={(rowData) => formatDuration(rowData.duration)}
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="releaseDate"
          header="Release Date"
          sortable
          filter
          body={(rowData) => formatDateTime(rowData.releaseDate)}
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="imageUrl"
          header="Image"
          body={imageBodyTemplate}
          filter={false} // Disable filtering on imageUrl column
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="url"
          header="URL"
          body={urlBodyTemplate}
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
        />
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
              onClick={confirmDeleteSong}
              autoFocus
            />
          </div>
        }
        onHide={() => setIsDeleteDialogVisible(false)}
      >
        <p>
          Are you sure you want to delete song{" "}
          <b>{selectedSong && selectedSong.title}</b>?
        </p>
      </Dialog>
    </div>
  );
}

export default ManageSongsComponent;
