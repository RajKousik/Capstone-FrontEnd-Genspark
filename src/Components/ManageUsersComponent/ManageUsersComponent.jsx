import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeReact Icons
import "./ManageUsersComponent.css";
import { getAllUsers, deleteUserById } from "../../api/data/users/user";

function ManageUsersComponent() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();
        setUsers(() =>
          response.filter((user) => user.role.toLowerCase() === "normaluser")
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString();
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUserById(selectedUser.userId);
      setUsers(users.filter((user) => user.userId !== selectedUser.userId));
      setSelectedUser(null);
      setIsDeleteDialogVisible(false);
    }
  };

  const header = (
    <div className="table-header">
      <h2 className="p-m-0">Users List</h2>
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
          label="Delete User"
          disabled={!selectedUser}
          onClick={() => setIsDeleteDialogVisible(true)}
        />
      </div>
    </div>
  );

  return (
    <div className="manage-users-container p-2">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        showGridlines
        resizableColumns
        columnResizeMode="expand"
        value={users}
        paginator
        rows={5}
        loading={loading}
        header={header}
        // autoLayout
        // scrollable
        // scrollHeight="calc(100vh - 300px)"
        globalFilter={globalFilter}
        selection={selectedUser}
        onSelectionChange={(e) => setSelectedUser(e.value)}
        className="p-datatable-gridlines p-datatable-striped"
        dataKey="userId"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        globalFilterFields={["userId", "username", "email", "phone", "dob"]}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          field="userId"
          header="User ID"
          sortable
          filter
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="username"
          header="Username"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
          bodyStyle={(rowData) => ({
            fontWeight: rowData.role === "normaluser" ? "bold" : "normal",
          })}
        />
        <Column
          field="email"
          header="Email"
          sortable
          filter
          headerStyle={{ backgroundColor: "#ffa500" }}
        />
        <Column
          field="phone"
          header="Phone"
          sortable
          filter
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          field="dob"
          header="Date of Birth"
          sortable
          filter
          body={(rowData) => formatDate(rowData.dob)}
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
              onClick={confirmDeleteUser}
              autoFocus
            />
          </div>
        }
        onHide={() => setIsDeleteDialogVisible(false)}
      >
        <p>
          Are you sure you want to delete user{" "}
          <b>{selectedUser && selectedUser.username}</b>?
        </p>
      </Dialog>
    </div>
  );
}

export default ManageUsersComponent;
