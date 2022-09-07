import { Button, CustomTable, InputField, InputSelect } from "../../components";
import styles from "./ManageUsers.module.scss";
// import "antd/dist/antd.css";
import { MainLayout } from "../../layouts";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Popconfirm } from "antd";
import { DeleteOutline } from "@mui/icons-material";
import { AuthContext } from "../../utils/auth/AuthContext";
import { IconButton } from "@mui/material";

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
    title: "Delete",
    dataIndex: ".",
    key: ".",
    isObj: false,
    render: () => (
      <Popconfirm title="Sure to delete?">
        <IconButton>
          <DeleteOutline htmlColor="pink" />
        </IconButton>
      </Popconfirm>
    ),
  },
];

const ManageUsers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const { users } = useContext(AuthContext);

  useEffect(() => {
    setData(users);
    console.log({ users });
  }, [users]);

  return (
    <MainLayout
      classes={[styles.container]}
      navbarProps={{
        titleProps: {
          name: "Users",
          disabled: true,
        },
      }}
    >
      <div className={styles.header}></div>
      <div className={styles.tableContainer}>
        <CustomTable columns={columns} data={data} setData={setData} />
      </div>
    </MainLayout>
  );
};

// const Header = ({ filters, handleChange, navigate }) => {
//   return (

//   );
// };

export default ManageUsers;
