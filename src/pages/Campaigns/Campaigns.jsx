import React, { useContext, useEffect } from "react";
import { CustomTable } from "../../components";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import styles from "./Campaigns.module.scss";
import { CampaignContext } from "../../utils/contexts/CampaignContext";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const columns = [
    {
      headerName: "Date",
      field: "createdAt",
      key: "date",
      renderCell: (row) => (
        <span>{new Date(row.value).toLocaleDateString()}</span>
      ),
      // width: "30%",
      // ...getColumnSearchProps("name"),
    },
    {
      headerName: "Brand Name",
      field: "brand",
      key: "brandName",
      renderCell: (brand) => <span>{brand.value.name}</span>,
      // width: "30%",
      // ...getColumnSearchProps("name"),
    },
    {
      headerName: "Campaign Name",
      field: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      // width: "30%",
      // ...getColumnSearchProps("name"),
    },
    {
      headerName: "Amount",
      field: "brandAmount",
      key: "brandAmount",
      // width: "30%",
      // ...getColumnSearchProps("name"),
    },
    {
      headerName: "Status",
      field: "status",
      key: "status",
      renderCell: (row) => (
        <span style={{ textTransform: "capitalize " }}>{row.value}</span>
      ),
      // width: "20%",
      // ...getColumnSearchProps("age"),
    },
    {
      headerName: "View",
      field: "id",
      key: "open",
      renderCell: (row) => <Link to={`/campaign/${row.value}`}>View</Link>,
      // width: "20%",
      // ...getColumnSearchProps("age"),
    },
  ];

  const { campaigns } = useContext(CampaignContext);

  useEffect(() => {
    console.log({ campaigns });
  }, [campaigns]);

  return (
    <MainLayout
      navbarProps={{
        titleProps: {
          title: "Campaigns",
        },
      }}
      classes={[styles.container]}
      isSideMenuVisible
    >
      <div className={styles.tableContainer}>
        <CustomTable columns={columns} data={campaigns} />
      </div>
    </MainLayout>
  );
};

export default Campaigns;
