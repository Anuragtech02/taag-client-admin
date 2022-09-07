import { Button, CustomTable, InputField, InputSelect } from "../../components";
import styles from "./ManageUsers.module.scss";
// import "antd/dist/antd.css";
import { MainLayout } from "../../layouts";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Popconfirm } from "antd";
import { DeleteOutline, ManageAccounts, Save } from "@mui/icons-material";
import { AuthContext } from "../../utils/auth/AuthContext";
import { IconButton, Modal } from "@mui/material";
import { API_ALL } from "../../utils/API";
import { showAlert } from "../../utils";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { users } = useContext(AuthContext);

  useEffect(() => {
    setData(users);
    console.log({ users });
  }, [users]);

  async function handleDeleteUser(user) {
    if (!user) {
      return;
    }
    try {
      const res = await API_ALL().delete("/user/delete", {
        data: {
          id: user._id,
        },
      });
      console.log({ res });
      setData((prev) => prev.filter((item) => item._id !== user._id));
      showAlert("success", "Succesfully Deleted " + user.name);
    } catch (error) {
      console.log(error);
      showAlert("error", "Error Deleting " + user.name);
    }
  }

  async function handleClickSave() {
    console.log("save");
  }

  async function handleClickEdit(user) {
    setSelectedUser(user);
    setEditModalOpen(true);
  }

  async function handleSubmitNewPassword(user) {
    setSelectedUser(null);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      // width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true,
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      searchable: true,
      isObj: false,
      editable: true,
      // width: "30%",
    },
    {
      title: "Password",
      dataIndex: "nothing",
      key: "nothing",
      render: (text) => <span>********</span>,
      editable: true,
      // width: "30%",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      isObj: false,
      render: (type) => (
        <span style={{ textTransform: "uppercase" }}>{type}</span>
      ),
      filters: [
        {
          text: "Admin",
          value: "admin",
        },
        {
          text: "Team",
          value: "team",
        },
        {
          text: "Agency",
          value: "agency",
        },
        {
          text: "Brand",
          value: "brand",
        },
      ],
      onFilter: (value, record) =>
        record.userType.toLowerCase().indexOf(value) === 0,
      // width: "20%",
      // searchable: true,
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      isObj: false,
      render: (createdAt) => (
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Edit",
      dataIndex: ".",
      key: ".",
      isObj: false,
      width: "8%",
      render: (_, record) => (
        <IconButton onClick={() => handleClickEdit(record)}>
          <ManageAccounts htmlColor="pink" />
        </IconButton>
      ),
    },
    {
      title: "Delete",
      dataIndex: ".",
      key: ".",
      isObj: false,
      width: "8%",
      render: (_, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDeleteUser(record)}
        >
          <IconButton>
            <DeleteOutline htmlColor="pink" />
          </IconButton>
        </Popconfirm>
      ),
    },
  ];

  return (
    <MainLayout
      classes={[styles.container]}
      navbarProps={{
        titleProps: {
          name: "Users",
          disabled: true,
          isBackIconVisible: true,
        },
      }}
    >
      <div className={styles.header} style={{ justifyContent: "flex-end" }}>
        <Button onClick={() => handleClickSave()} rightIcon={<Save />}>
          Save
        </Button>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable columns={columns} data={data} setData={setData} />
      </div>
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        handleSubmit={handleSubmitNewPassword}
      />
    </MainLayout>
  );
};

export default ManageUsers;

const EditModal = ({ open, handleClose, handleSubmit }) => {
  const [password, setPassword] = useState("");

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={styles.editModal}>
        <form onSubmit={handleSubmit}>
          <h2>Enter New Password</h2>
          <InputField
            label="Password"
            type="password"
            value={password}
            newPassword={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </Modal>
  );
};
