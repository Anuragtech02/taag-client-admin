import styles from "./SelectArtists.module.scss";
import { MainLayout } from "../../layouts";
import { Button, CustomTable } from "../../components";
import { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../../utils/contexts";
import clsx from "clsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { KMBFormatter } from "../../utils";
import { API_CAMPAIGN } from "../../utils/API";

const SelectArtists = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // width: "30%",
      searchable: true,
    },
    {
      title: "Followers",
      dataIndex: "followers",
      key: "followers",
      render: (followers) => <span>{KMBFormatter(followers)}</span>,
      // width: "20%",
      sorter: (a, b) => parseInt(a) - parseInt(b),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span style={{ textTransform: "capitalize" }}>{type}</span>
      ),
      // sorter: (a, b) => a - b,
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <span style={{ textTransform: "capitalize" }}>{gender}</span>
      ),
      // width: "20%",
      searchable: true,
    },
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      key: "agencyName",
      // width: "20%",
      searchable: true,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => <span>{categories.join(", ")}</span>,
      // width: "20%",
      searchable: true,
    },
    {
      title: "Languages",
      dataIndex: "languages",
      key: "languages",
      render: (languages) => <span>{languages.join(", ")}</span>,
      // width: "20%",
      searchable: true,
    },
  ];

  const { artists } = useContext(CampaignContext);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ artists });
  }, [artists]);

  function handleSelectRow(selectedRows) {
    setSelectedArtists(
      selectedRows?.map((item) => ({
        _id: item._id,
        link: "",
        averageViews: 0,
        deliverable: "",
        commercialCreator: 0,
        brandCommercial: 0,
        cpvBrand: 0,
        agencyFees: 0,
        invoice: "",
        date: "",
        note: "",
      }))
    );
  }

  async function onClickContinue() {
    console.log({ selectedArtists });
    const res = await API_CAMPAIGN().patch(
      `/update/${id}`,

      { selectedArtists }
    );
    if (res.status === 200) {
      navigate(`/campaigns/${id}`);
    }
  }

  return (
    <MainLayout classes={[styles.container]}>
      <div className={clsx(styles.header, styles.flexRow)}>
        <h3>Select Artists</h3>
        <Button onClick={onClickContinue}>Save & Continue</Button>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable
          columns={columns}
          data={artists || []}
          onRowSelect={handleSelectRow}
        />
      </div>
    </MainLayout>
  );
};

export default SelectArtists;
