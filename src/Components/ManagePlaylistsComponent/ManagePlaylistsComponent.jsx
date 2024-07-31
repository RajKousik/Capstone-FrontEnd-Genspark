import React, { useEffect, useState } from "react";
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
import { getUserById } from "../../api/data/users/user";
import { getEnrichedPlaylists } from "../../api/utility/commonUtils";

function ManagePlaylistsComponent() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPublicPlaylists();
        const enrichedPlaylists = await getEnrichedPlaylists(response);
        setPlaylists(enrichedPlaylists);
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

  const header = (
    <div className="table-header">
      <h2 className="p-m-0">Playlists List</h2>
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

  return (
    <div className="manage-playlists-container p-2 card">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        value={playlists}
        paginator
        rows={5}
        loading={loading}
        header={header}
        globalFilter={globalFilter}
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
        <Column
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
