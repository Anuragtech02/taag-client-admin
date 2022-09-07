import { Button, CustomTable, InputField, InputSelect } from "../../components";
import styles from "./ManageUsers.module.scss";
// import "antd/dist/antd.css";
import { MainLayout } from "../../layouts";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  CampaignContext,
  CampgaignContext,
} from "../../utils/contexts/CampaignContext";
import { campaignsOfLast7Days, campaignsOfLastMonth } from "../../utils";
import { Dropdown, Menu, Popconfirm } from "antd";
import {
  DownOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button as AButton } from "antd";
import { Delete, SupervisedUserCircle } from "@mui/icons-material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
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
    editable: true,
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
    editable: true,
  },
  {
    title: "Delete",
    dataIndex: ".",
    key: ".",
    isObj: false,
    render: () => (
      <Popconfirm>
        <IconButton>
          <Delete />
        </IconButton>
      </Popconfirm>
    ),
    editable: true,
  },
];

const ManageUsers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const { users } = useContext(AuthContext);

  function debounce(func, timeout) {
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  }

  function onSearch(e) {
    const { value } = e.target;
    setData(
      users?.filter((campaign) =>
        campaign.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  function handleChange(e) {
    const { id, value, name } = e.target;

    setFilters((prev) => {
      return {
        ...prev,
        [name || id]: value,
      };
    });
  }

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
        <CustomTable columns={columns} data={data} />
      </div>
    </MainLayout>
  );
};

// const Header = ({ filters, handleChange, navigate }) => {
//   return (

//   );
// };

export default ManageUsers;
