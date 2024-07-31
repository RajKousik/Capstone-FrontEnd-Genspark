import React, { useEffect, useState } from "react";
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

function ManageArtistsComponent() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [statuses] = useState(["Active", "InActive"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllArtists();
        setArtists(response);
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

  const header = (
    <div className="table-header">
      <h2 className="p-m-0">Artists List</h2>
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
        <Button
          icon="pi pi-minus"
          className="ms-2 color-bg border border-none rounded"
          style={{ backgroundColor: "red" }}
          label="Delete Artist"
          disabled={!selectedArtist}
          onClick={() => setIsDeleteDialogVisible(true)}
        />
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

  const cellEditor = (options) => {
    if (options.field === "status") return statusEditor(options);
    else return textEditor(options);
  };

  return (
    <div className="manage-artists-container p-2">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        value={artists}
        editMode="cell"
        paginator
        rows={5}
        loading={loading}
        header={header}
        globalFilter={globalFilter}
        autoLayout
        scrollable
        scrollHeight="calc(100vh - 200px)"
        selection={selectedArtist}
        onSelectionChange={(e) => setSelectedArtist(e.value)}
        className="p-datatable-gridlines p-datatable-striped"
        dataKey="artistId"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        globalFilterFields={["artistId", "name", "email", "bio", "status"]}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
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
          field="actions"
          header="Actions"
          body={actionsBodyTemplate}
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
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
