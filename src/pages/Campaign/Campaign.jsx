import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, CustomTable } from "../../components";
import { MainLayout } from "../../layouts";
import { CampaignContext } from "../../utils/contexts/CampaignContext";
import styles from "./Campaign.module.scss";
// import { TabContext, TabPanel, TabList } from "@mui/lab";
import {
  Tab,
  Tabs,
  Skeleton,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { TabIcon } from "../../assets";
import { CurrentContext } from "../../utils/contexts";
import {
  formatIndianCurrency,
  getCommercial,
  getCPVBrand,
  getROI,
  getYoutubeId,
  KMBFormatter,
  showAlert,
} from "../../utils";
import { tableData } from "../../utils/constants";
import SelectArtists from "./SelectArtists";
import NewColumn from "./NewColumn";
import { AuthContext } from "../../utils/auth/AuthContext";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@mui/icons-material";
import { API_ALL } from "../../utils/API";
import { useCallback } from "react";

function newSelectionArist(item, campaign) {
  console.log({ item });
  const commercial = getCommercial(campaign.deliverable, item);
  const brandCommercial =
    parseInt(item.brandCommercial) ||
    commercial + (20 * commercial) / 100 ||
    "NA";

  let newArtist = {
    ...item,
    key: item._id,
    _id: item._id,
    name: item.name,
    instagramLink: item.instagram?.link || "NA",
    youtubeLink: item.youtube?.link || "NA",
    link: campaign.deliverable?.includes("YT")
      ? item.youtube?.link
      : campaign.deliverable?.includes("IG")
      ? item.instagram?.link
      : "NA",
    followers: campaign.deliverable?.includes("YT")
      ? item.youtube?.subscribers
      : item.instagram
      ? item.instagram.followers
      : "NA",
    averageViews: campaign.deliverable?.includes("YT")
      ? item.youtube?.averageViews
      : campaign.deliverable?.includes("IG")
      ? item.instagram?.averageViews
      : "NA",
    deliverable: item.deliverable || campaign.deliverable || "NA",
    commercialCreator: commercial,
    brandCommercial,
    cpvBrand: getCPVBrand(item, brandCommercial, campaign?.deliverable),
    agencyFees:
      item.agencyFees || parseInt(brandCommercial) - parseInt(commercial) || 0,
    gender: item.gender,
    location: item.location,
    languages: item.languages,
    categories: item.categories,
    type: item.type,
    agencyName: item.agencyName,
    manager: item.manager,
    contact: item.contact,
    email: item.email,
    invoice: item.invoice,
    date: item.date,
    note: item.note || ".",
    deliverableLink: item.deliverableLink || "NA",
    views: item.views || "NA",
    comments: item.comments || "NA",
    roi: getROI(item, brandCommercial),
  };
  if (campaign.extras?.length) {
    campaign.extras.forEach((it) => {
      newArtist[it.dataIndex] = item[it.dataIndex] || ".";
    });
  }

  return newArtist;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Campaign = () => {
  // const [campaign, setCampaign] = useState({});
  const { tabIndex, setTabIndex, table, setCampaignId } =
    useContext(CurrentContext);
  const { updateCampaign, updateArtistsGlobal, updateBrand, fetchArtists } =
    useContext(CampaignContext);
  const handleTabsChange = (event, newValue) => {
    setTabIndex(newValue);
    setTab(newValue);
  };

  const [hasCampaignDataChanged, setHasCampaignDataChanged] = useState(false);
  const [selRows, setSelRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newColOpen, setNewColOpen] = useState(false);
  const [mainCols, setMainCols] = useState(tableData.campaign.main.columns);
  const [headerData, setHeaderData] = useState({
    totalAvgViews: 0,
    totalViews: 0,
    totalComments: 0,
    totalAgencyFees: 0,
    totalBrandAmount: 0,
    averageROI: 0,
    totalArtists: 0,
  });
  const [ytStatsPromises, setYTStatsPromises] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [averageROI, setAverageROI] = useState(0.0);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);

  const location = useLocation();

  const [tab, setTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  function handleClose() {
    setModalOpen(false);
  }

  const { fetchCampaign } = useContext(CampaignContext);

  const { campaign, setCampaign, loading, isInvalidCampaign } =
    useContext(CurrentContext);

  const { id } = useParams();
  const [test, setTest] = useState(campaign);
  // useEffect(() => {
  //   console.log({ campaign });
  // });

  function handleVisibilityColumn(currentItem) {
    return async (e) => {
      // console.log([campaign]);
      try {
        const newCampaign = {
          _id: campaign._id,
          id: campaign.id,
          // ...campaign,
          // selectedArtists: selectedRows,
          extras: campaign?.extras?.map((item) => {
            return item.dataIndex === currentItem.dataIndex
              ? { ...item, isVisible: item?.isVisible ? false : true }
              : item;
          }),
        };
        // console.log({ campaign, newCampaign });
        const res = await updateCampaign(newCampaign);
        setCampaign(res.data.data);
      } catch (err) {
        console.log({ err });
      }
    };
  }

  async function handleDeleteColumn(currentItem) {
    try {
      const newCampaign = {
        ...campaign,
        extras: campaign?.extras?.filter(
          (item) => item.dataIndex !== currentItem.dataIndex
        ),
      };
      const res = await updateCampaign(newCampaign);
      setCampaign(newCampaign);
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    setCampaignId(id);
    // console.log("set id");
  }, [id]);

  useEffect(() => {
    // console.log({ campaign });
    if (campaign.extras?.length) {
      setMainCols([
        ...tableData.campaign.main.columns,
        ...campaign.extras.map((item) => ({
          ...item,
          title: (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.title}
              <Tooltip
                title={item?.isVisible ? "Hide From Brand" : "Show to Brand"}
              >
                <Switch
                  checked={item?.isVisible}
                  onChange={handleVisibilityColumn(item)}
                />
              </Tooltip>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteColumn(item)}
              >
                <IconButton>
                  <DeleteOutlined htmlColor="pink" />
                </IconButton>
              </Popconfirm>
            </span>
          ),
          searchable: true,
          editable: true,
          width: "12%",
        })),
      ]);
    }
    if (campaign?.selectedArtists) {
      // console.log({ selected: campaign.selectedArtists });
      let tYtStatsPromises = {};
      setSelectedRows(
        campaign.selectedArtists.map((item) => {
          if (item.deliverableLink && item.deliverableLink !== "NA") {
            tYtStatsPromises[item._id] = getYoutubeStats(item.deliverableLink);
          }
          return newSelectionArist(item, campaign);
        })
      );
      setYTStatsPromises(tYtStatsPromises);
    }
  }, [campaign]);

  async function getYoutubeStats(link) {
    const ytId = getYoutubeId(link);
    return await API_ALL().get(`/youtube/getLikes`, {
      params: {
        videoId: ytId["1"],
      },
    });
  }

  useEffect(() => {
    setHeaderData({
      totalAvgViews: 0,
      totalViews: 0,
      totalComments: 0,
      totalAgencyFees: 0,
      totalBrandAmount: 0,
      averageROI: 0.0,
      totalArtists: 0,
    });
    if (selectedRows.length) {
      let tAvgViews = 0;
      let tAgencyFees = 0;
      let tBrandAmount = 0;
      let tViews = 0;
      let tComments = 0;
      let tCategories = [];
      let tLanguages = [];
      let tRoi = 0;

      selectedRows.forEach((item) => {
        tAvgViews += parseInt(item.averageViews) || 0;
        tAgencyFees += parseInt(item.agencyFees) || 0;
        tBrandAmount += parseInt(item.brandCommercial) || 0;
        tViews += parseInt(item.views) || 0;
        tComments += parseInt(item.comments) || 0;
        tCategories = [...tCategories, ...item.categories];
        tLanguages = [...tLanguages, ...item.languages];
        tRoi += parseFloat(item.roi) || 0;
      });

      setCategories([...new Set(tCategories)].filter((item) => item.length));
      setLanguages([...new Set(tLanguages)]);
      setAverageROI(tRoi / selectedRows.length);
      setHeaderData({
        totalAvgViews: tAvgViews,
        totalViews: tViews,
        totalComments: tComments,
        totalAgencyFees: tAgencyFees,
        totalBrandAmount: tBrandAmount,
        averageROI: tRoi / selectedRows.length,
        totalArtists: selectedRows.length,
      });
      // console.log({
      //   tCategories: [...new Set(tCategories)].filter((item) => item.length),
      //   tLanguages,
      // });
    }
  }, [selectedRows]);

  useEffect(() => {
    async function fetchYTData() {
      setTableLoading(() => true);
      const values = await Promise.all(Object.values(ytStatsPromises));

      setSelectedRows((prev) =>
        prev?.map((item) => {
          const ytId = getYoutubeId(item.deliverableLink);
          if (!ytId) {
            return item;
          }
          const ytStats = values.find((val) => val.data.videoId === ytId["1"]);
          return {
            ...item,
            likes: ytStats?.data?.likes,
            comments: ytStats?.data?.comments,
            views: ytStats?.data?.views,
          };
        })
      );
      setTableLoading(() => false);
    }
    if (
      Object.values(ytStatsPromises).length &&
      location.pathname.includes("analytics")
    ) {
      fetchYTData();
    }
  }, [ytStatsPromises, location.pathname]);

  function handleSelectRow(rows) {
    // setCampaign({ ...campaign, selectedArtists: rows });
    setSelRows(rows);
  }

  function handleSaveSelectedArtists(rows) {
    let newArtists = [
      ...selectedRows,
      ...rows?.map((item) => newSelectionArist(item, campaign)),
    ];
    // sessionStorage.setItem("data", JSON.stringify(newArtists));
    setSelectedRows(newArtists);
    let tBrandAmount = 0;
    let tAgencyFees = 0;
    let tTotalAvgViews = 0;
    newArtists.forEach((item) => {
      tBrandAmount += parseInt(item.brandCommercial) || 0;
      tAgencyFees += parseInt(item.agencyFees) || 0;
      tTotalAvgViews += parseInt(item.averageViews) || 0;
    });
    let newCampaign = {
      ...campaign,
      brandAmount: tBrandAmount,
      agencyFees: tAgencyFees,
      totalAverageViews: tTotalAvgViews,
      selectedArtists: newArtists,
    };
    // console.log({ newCampaign });
    setCampaign(newCampaign);

    updateCampaign(newCampaign);
    // setCampaign({
    //   ...campaign,
    //   selectedArtiss: rows?.map((item) => newSelectionArist(item, campaign)),
    // });
  }

  const handleClickSave = useCallback(() => {
    let newCampaign = {
      ...campaign,
      totalAverageViews: headerData?.totalAvgViews || 0,
      agencyFee: headerData?.totalAgencyFees || 0,
      brandAmount: headerData?.totalBrandAmount || 0,
      averageROI: averageROI || 0,
      selectedArtists: selectedRows?.map((item) =>
        newSelectionArist(item, campaign)
      ),
    };

    updateCampaign(newCampaign);
    showAlert("success", "Campaign Updated");
  }, [campaign, selectedRows, headerData, averageROI, updateCampaign]);

  async function handleSaveGlobal(modifiedArtists) {
    if (!Object.values(modifiedArtists).length) {
      return;
    }
    await updateArtistsGlobal(
      Object.values(modifiedArtists).map((item) => ({
        _id: item._id,
        youtube: { ...item.youtube, commercial: item.commercialCreatorYT },
        instagram: {
          ...item.instagram,
          reelCommercial: item.commercialCreatorIGReel,
          storyCommercial: item.commercialCreatorIGStory,
        },
      }))
    );
    fetchArtists();
    // console.log("Updated Global", res);
    showAlert("success", "Updated Artist(s) Successfully");
  }

  function handleClickShare() {
    updateCampaign({ _id: campaign._id, isSharedWithBrand: true });
    updateBrand(campaign?.brand?.poc?.email, campaign._id);
    showAlert("success", "Campaign shared with brand");
  }

  const handleClickRefresh = useCallback(() => {
    setTableLoading(true);
    fetchCampaign(id);
    setTableLoading(false);
  }, [id, fetchCampaign]);

  // useEffect(() => {
  //   setSelectedRows();
  // }, [selRows]);
  // console.log({ isInvalidCampaign });
  if (loading) {
    return (
      <div className={styles.tempContainer}>
        <CircularProgress />
      </div>
    );
  }
  if (isInvalidCampaign) {
    return (
      <div className={styles.tempContainer}>
        <InvalidCampaign />
      </div>
    );
  }

  return (
    <MainLayout
      classes={[styles.container]}
      isSideMenuVisible
      campaignId={id}
      navbarProps={{
        titleProps: {
          id: "name",
          disabled: true,
          isBackIconVisible: true,
          name: campaign?.name,
          brief: campaign?.brief,
        },
        brandName: campaign?.brand?.name,
        prevRoute: "/",
      }}
      moreInformationProps={{
        isVisible: true,
        onClickRefresh: handleClickRefresh,
        onClickAdd: () => setNewColOpen(true),
        onClickShare: handleClickShare,
        ...(location.pathname.includes("analytics")
          ? {
              totalViews: KMBFormatter(headerData?.totalViews),
              totalComments: KMBFormatter(headerData?.totalComments),
            }
          : {
              agencyFees:
                formatIndianCurrency(headerData?.totalAgencyFees) || 0,
              brandAmount:
                formatIndianCurrency(headerData?.totalBrandAmount) || 0,
              totalAverageViews: KMBFormatter(headerData?.totalAvgViews || 0),
              totalCreator: headerData?.totalArtists || "0",
              averageROI: averageROI.toFixed(2),
            }),
      }}
    >
      <div className={styles.tablesContainer}>
        {location.pathname.includes("commercials") && (
          <div className={styles.tableContainer}>
            <div className={styles.flexRow}>
              <Button onClick={() => setModalOpen(true)}>Add Artists</Button>

              <Button onClick={handleClickSave}>Save</Button>
            </div>
            {selectedRows?.length > 0 && (
              <CustomTable
                columns={tableData.campaign_commercials.columns}
                data={selectedRows}
                // isSelectable
                setData={setSelectedRows}
                onRowSelect={handleSelectRow}
                selectedRows={campaign?.selectedArtists || []}
                campaign={campaign}
              />
            )}
          </div>
        )}
        {location.pathname.includes("analytics") && (
          <div className={styles.tableContainer}>
            <div className={styles.flexRow}>
              <Button onClick={() => setModalOpen(true)}>Add Artists</Button>

              <Button onClick={handleClickSave}>Save</Button>
            </div>
            {selectedRows.length ? (
              <CustomTable
                columns={tableData.campaign_analytics.columns}
                data={selectedRows}
                // isSelectable
                tableLoading={tableLoading}
                setData={setSelectedRows}
                onRowSelect={handleSelectRow}
                selectedRows={campaign?.selectedArtists || []}
                campaign={campaign}
              />
            ) : null}
          </div>
        )}
        {!location.pathname.includes("commercials") &&
          !location.pathname.includes("analytics") && (
            <>
              <div className={styles.tabs}>
                <Tabs value={tab} onChange={handleTabsChange} aria-label="Tabs">
                  <Tab
                    icon={<TabIcon filled={tabIndex === 0} value={0} />}
                    // value={0}
                    aria-label="Overview"
                  />
                  <Tab
                    icon={<TabIcon filled={tabIndex === 1} value={1} />}
                    // value={1}
                  />
                  <Tab
                    icon={<TabIcon filled={tabIndex === 2} value={2} />}
                    // value={2}
                  />
                </Tabs>
                <div>
                  <Button onClick={() => setModalOpen(true)}>
                    Add Artists
                  </Button>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <Button onClick={handleClickSave}>Save</Button>
                </div>
              </div>

              {/* </Box> */}
              {/* )} */}
              <TabPanel value={tab} index={0}>
                <div className={styles.tableContainer}>
                  {selectedRows?.length > 0 ? (
                    <CustomTable
                      columns={mainCols}
                      width={2200}
                      data={selectedRows}
                      setData={setSelectedRows}
                      onRowSelect={handleSelectRow}
                      selectedRows={campaign?.selectedArtists || []}
                      campaign={campaign}
                      setDataChange={setHasCampaignDataChanged}
                    />
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  )}
                </div>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <div className={styles.tableContainer}>
                  {selectedRows?.length > 0 ? (
                    <CustomTable
                      columns={tableData.campaign.info.columns}
                      data={selectedRows}
                      languages={languages}
                      categories={categories}
                      setData={setSelectedRows}
                      onRowSelect={handleSelectRow}
                      selectedRows={campaign?.selectedArtists || []}
                      campaign={campaign}
                    />
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  )}
                </div>
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <div className={styles.tableContainer}>
                  {selectedRows?.length > 0 ? (
                    <CustomTable
                      columns={tableData.campaign.phone.columns}
                      data={selectedRows}
                      setData={setSelectedRows}
                      onRowSelect={handleSelectRow}
                      selectedRows={campaign?.selectedArtists || []}
                      campaign={campaign}
                    />
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  )}
                </div>
              </TabPanel>
            </>
          )}
        <br />
      </div>
      <SelectArtists
        open={modalOpen}
        handleClose={handleClose}
        handleSave={handleSaveSelectedArtists}
        handleSaveGlobal={handleSaveGlobal}
        selectedArtists={selectedRows}
      />
      <NewColumn open={newColOpen} handleClose={() => setNewColOpen(false)} />
    </MainLayout>
  );
};

// const StyledTabList = styled(TabList)(() => {
//   return {
//     ".MuiTabs-indicator": {
//       backgroundColor: "var(--clr-primary)",
//     },
//   };
// });

export default Campaign;

const InvalidCampaign = () => {
  return (
    <div className={styles.invalidCampaign}>
      <h3>Either this campaign is invalid or you do not have access to it!</h3>
    </div>
  );
};
