import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ManageArtistComponent.css";
import {
  getArtistById,
  getAllArtists,
  deleteArtist,
  updateArtist,
  changeArtistPassword,
  getSongsByArtistId,
} from "../../api/data/artists/artist";
import { Tag } from "primereact/tag";
import { formatDateTime } from "../../api/utility/commonUtils";
import { Tooltip } from "primereact/tooltip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ManageArtistsComponent() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [statuses] = useState(["Active", "InActive"]);
  const [expandedRows, setExpandedRows] = useState(null);
  const dt = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllArtists();
        const artistsWithSongs = await Promise.all(
          response.map(async (artist) => {
            const songs = await getSongsByArtistId(artist.artistId);
            return { ...artist, songs };
          })
        );
        setArtists(artistsWithSongs);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setError("Failed to fetch artists.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const confirmDeleteArtist = () => {
    if (selectedArtist) {
      deleteArtist(selectedArtist.artistId);
      setArtists(
        artists.filter((artist) => artist.artistId !== selectedArtist.artistId)
      );
      setSelectedArtist(null);
      setIsDeleteDialogVisible(false);
    }
  };

  const imageBodyTemplate = (artist) => {
    return (
      <img
        src={artist.imageUrl}
        alt={artist.name}
        style={{ height: "100px" }}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  // const cols = [
  //   { field: "artistId", header: "Artist Id" },
  //   { field: "name", header: "Name" },
  //   { field: "bio", header: "Bio" },
  //   { field: "email", header: "Email" },
  // ];

  // const exportColumns = cols.map((col) => ({
  //   title: col.header,
  //   dataKey: col.field,
  // }));

  // const exportPdf = () => {
  //   const doc = new jsPDF();

  //   doc.autoTable(exportColumns, artists);
  //   doc.save("artists.pdf");
  // };

  const cols = [
    { field: "artistId", header: "Artist Id" },
    { field: "name", header: "Name" },
    { field: "bio", header: "Bio" },
    { field: "email", header: "Email" },
    { field: "songId", header: "Song Id" },
    { field: "title", header: "Song Title" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    const doc = new jsPDF();
    const rows = [];

    artists.forEach((artist) => {
      if (artist.songs != null && artist.songs.length > 0) {
        artist.songs.forEach((song) => {
          rows.push({
            artistId: artist.artistId,
            name: artist.name,
            bio: artist.bio,
            email: artist.email,
            songId: song.songId,
            title: song.title,
          });
        });
      } else {
        rows.push({
          artistId: artist.artistId,
          name: artist.name,
          bio: artist.bio,
          email: artist.email,
          songId: "N/A",
          title: "N/A",
        });
      }
    });

    doc.autoTable(exportColumns, rows);
    doc.save("artists.pdf");
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(artists);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Artists");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "Artists");
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
      {/* <div style={{ display: "flex", justifyContent: "flex-end", gap: "2px" }}>
        <Tooltip target=".export-buttons>button" position="bottom" />
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
      </div> */}
      <div
        className="group"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span className="global-filter-container">
          <InputText
            type="search"
            placeholder="Search"
            onInput={(e) => {
              setGlobalFilter(e.target.value);
            }}
            className="global-filter-input"
          />
        </span>
        <div>
          <Button
            type="button"
            title="Download as CSV"
            icon="pi pi-file"
            rounded
            className="me-2"
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
            className="me-2"
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            title="Download as PDF"
            severity="warning"
            rounded
            className="me-2"
            onClick={exportPdf}
            data-pr-tooltip="PDF"
          />
          <Button
            icon="pi pi-minus"
            className="color-bg border border-none rounded"
            style={{ backgroundColor: "red" }}
            label="Delete Artist"
            disabled={!selectedArtist}
            onClick={() => setIsDeleteDialogVisible(true)}
          />
        </div>
      </div>
    </div>
  );

  const getSeverity = (value) => {
    switch (value.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "danger";
      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)}></Tag>
    );
  };

  const onCellEditComplete = async (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    if (newValue.trim().length === 0) {
      event.preventDefault();
      return;
    }

    rowData[field] = newValue;
    setArtists([...artists]);

    try {
      await updateArtist(rowData.artistId, {
        name: rowData.name,
        bio: rowData.bio,
        imageUrl: rowData.imageUrl,
        status: rowData.status,
      });
    } catch (error) {
      console.error("Error updating artist:", error);
      setError("Failed to update artist status.");
    }
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const actionsBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Songs"
          icon="pi pi-music"
          className="p-button-text p-mr-2"
        />
        <Button label="Albums" icon="pi pi-book" className="p-button-text" />
      </React.Fragment>
    );
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const cellEditor = (options) => {
    if (options.field === "status") return statusEditor(options);
    else return textEditor(options);
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h6>Songs Information {data.artistName}</h6>

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

  const allowExpansion = (rowData) => {
    return rowData.songs && rowData.songs != null && rowData.songs.length > 0;
  };

  return (
    <div className="manage-artists-container p-2">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        showGridlines
        value={artists}
        editMode="cell"
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
        selection={selectedArtist}
        onSelectionChange={(e) => setSelectedArtist(e.value)}
        className="p-datatable-gridlines p-datatable-striped"
        dataKey="artistId"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        globalFilterFields={[
          "artistId",
          "name",
          "email",
          "bio",
          "status",
          "songs",
          "title",
        ]}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          expander={allowExpansion}
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="artistId"
          header="Artist ID"
          sortable
          filter
          editor="true"
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
          field="email"
          header="Email"
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
        <Column
          field="bio"
          header="Bio"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          editor={(options) => cellEditor(options)}
          headerStyle={{ backgroundColor: "#ffa500", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
          onCellEditComplete={onCellEditComplete}
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
              onClick={confirmDeleteArtist}
              autoFocus
            />
          </div>
        }
        onHide={() => setIsDeleteDialogVisible(false)}
      >
        <p>
          Are you sure you want to delete artist{" "}
          <b>{selectedArtist && selectedArtist.name}</b>?
        </p>
      </Dialog>
    </div>
  );
}

export default ManageArtistsComponent;
