import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeReact Icons
import "./ManageUsersComponent.css";
import {
  getAllUsers,
  deleteUserById,
  getPremiumUsers,
} from "../../api/data/users/user";
import { formatDateTime } from "../../api/utility/commonUtils";
import { Tag } from "primereact/tag";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Tooltip } from "primereact/tooltip";

function ManageUsersComponent() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const dt = useRef(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getAllUsers();
  //
  //       setUsers(response);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       setError("Failed to fetch users.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allUsers, premiumUsers] = await Promise.all([
          getAllUsers(),
          getPremiumUsers(),
        ]);

        const usersWithPremium = allUsers.map((user) => {
          // Find the premium user information for the current user
          const premiumUserData = premiumUsers.find(
            (pu) => pu.userId === user.userId
          );

          // Add the premium user data if available, or an empty array if not
          return {
            ...user,
            premiumusers: premiumUserData ? [premiumUserData] : [],
          };
        });

        setUsers(usersWithPremium);
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

  // const expandAll = () => {
  //   let _expandedRows = {};

  //   users.forEach((u) => (_expandedRows[`${u.userId}`] = true));

  //   setExpandedRows(_expandedRows);
  // };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h6>Subscription Information {data.username}</h6>

        <DataTable value={data.premiumusers} globalFilter={globalFilter}>
          <Column
            field="startDate"
            header="Start Date"
            sortable
            bodyStyle={{ textAlign: "center" }}
            body={(rowData) => formatDate(rowData.startDate)}
          ></Column>
          <Column
            field="endDate"
            header="End Date"
            sortable
            bodyStyle={{ textAlign: "center" }}
            body={(rowData) => formatDate(rowData.endDate)}
          ></Column>
          <Column
            field="money"
            header="Subscription Price in $"
            sortable
            bodyStyle={{ textAlign: "center" }}
            body={(rowData) => rowData.money}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUserById(selectedUser.userId);
      setUsers(users.filter((user) => user.userId !== selectedUser.userId));
      setSelectedUser(null);
      setIsDeleteDialogVisible(false);
    }
  };

  const cols = [
    { field: "userId", header: "User Id" },
    { field: "username", header: "Name" },
    { field: "dob", header: "Date of Birth" },
    { field: "email", header: "Email" },
    { field: "phone", header: "Phone" },
    { field: "role", header: "Role" },
    { field: "premiumusers.startDate", header: "Premium Start Date" },
    { field: "premiumusers.endDate", header: "Premium End Date" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    const doc = new jsPDF();
    const data = users.map((user) => ({
      ...user,
      dob: formatDateTime(user.dob),
      "premiumusers.startDate": user.premiumusers[0]?.startDate
        ? formatDateTime(user.premiumusers[0]?.startDate)
        : "N/A",
      "premiumusers.endDate": user.premiumusers[0]?.endDate
        ? formatDateTime(user.premiumusers[0]?.endDate)
        : "N/A",
    }));

    doc.autoTable(exportColumns, data);
    doc.save("users.pdf");
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "Users");
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
          label="Delete User"
          disabled={!selectedUser}
          onClick={() => setIsDeleteDialogVisible(true)}
        />
      </div>
    </div>
  );

  const getUserType = (value) => {
    switch (value.toLowerCase()) {
      case "normaluser":
        return "success";
      case "premiumuser":
        return "warning";
      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.role} severity={getUserType(rowData.role)}></Tag>
    );
  };

  const allowExpansion = (rowData) => {
    return rowData.premiumusers.length > 0;
  };

  return (
    <div className="manage-users-container p-2">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <DataTable
        ref={dt}
        showGridlines
        resizableColumns
        columnResizeMode="expand"
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
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
          expander={allowExpansion}
          headerStyle={{ textAlign: "center", backgroundColor: "#ffa500" }}
          bodyStyle={{ textAlign: "center" }}
        />
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
        <Column
          field="role"
          header="Role"
          body={statusBodyTemplate}
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
