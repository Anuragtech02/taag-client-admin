import { Button, CustomTable, InputField, InputSelect } from "../../components";
import styles from "./Home.module.scss";
// import "antd/dist/antd.css";
import { MainLayout } from "../../layouts";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  CampaignContext,
  CampgaignContext,
} from "../../utils/contexts/CampaignContext";
import { campaignsOfLast7Days, campaignsOfLastMonth } from "../../utils";
import { Dropdown, Menu } from "antd";
import {
  DownOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button as AButton } from "antd";
import { SupervisedUserCircle } from "@mui/icons-material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const Home = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const { campaigns } = useContext(CampaignContext);

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
      campaigns?.filter((campaign) =>
        campaign.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  function handleChange(e) {
    const { id, value, name } = e.target;

    if (id === "search") {
      debounce(onSearch, 500)(e);
    }

    if (id !== "search") {
      if (value === "week") setData(campaignsOfLast7Days(campaigns));
      else if (value === "month") setData(campaignsOfLastMonth(campaigns));
      else setData(data);
    }

    setFilters((prev) => {
      return {
        ...prev,
        [name || id]: value,
      };
    });
  }

  useEffect(() => {
    setData(campaigns);
    console.log({ campaigns });
  }, [campaigns]);

  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "name",
      key: "name",
      // width: "30%",
      render: (text, record) => (
        <Link to={`/campaigns/${record.id}`}>{text}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      searchable: true,
      isObj: false,
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
      // width: "30%",
    },
    {
      title: "Brand Name",
      dataIndex: "brand",
      key: "brand",
      searchable: true,
      isObj: true,
      render: (text) => <span>{text?.name}</span>,
      // width: "30%",
    },
    {
      title: "Amount",
      dataIndex: "brandAmount",
      key: "brandAmount",
      // width: "30%",
      searchable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      isObj: false,
      render: (status) => (
        <span style={{ textTransform: "capitalize " }}>{status}</span>
      ),
    },

    // {
    //   title: "View",
    //   dataIndex: "id",
    //   key: "open",
    //   isObj: false,
    //   render: (id) => <Link to={`/campaigns/${id}`}>View</Link>,
    //   // width: "20%",
    //   // searchable: true,
    // },
  ];

  function handleClickUploadArtist({ key }) {
    if (key === "single") {
      navigate("/add-artist");
    } else if (key === "bulk") {
      navigate("/upload-artists");
    }
  }

  const menu = (
    <Menu
      onClick={handleClickUploadArtist}
      items={[
        {
          label: "Single",
          key: "single",
          icon: <UserOutlined />,
        },
        {
          label: "Bulk",
          key: "bulk",
          icon: <UsergroupAddOutlined />,
        },
      ]}
    />
  );

  return (
    <MainLayout
      classes={[styles.container]}
      navbarProps={{
        titleProps: {
          name: "Campaigns",
          disabled: true,
        },
      }}
    >
      <div className={styles.header}>
        <Dropdown overlay={menu}>
          <AButton
          // onClick={() => {
          //   navigate("/upload-artists");
          // }}
          >
            Upload Artists
            <UsergroupAddOutlined />
          </AButton>
        </Dropdown>
        <div>
          <Button
            onClick={() => {
              navigate("/users");
            }}
            rightIcon={<SupervisedUserCircle />}
          >
            Manage Users
          </Button>
          <Button
            onClick={() => {
              navigate("/new-campaign");
            }}
            rightIcon={<NoteAddIcon />}
          >
            New Campaign
          </Button>
        </div>
      </div>
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

export default Home;
