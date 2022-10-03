import {
  AppBar,
  Dialog,
  IconButton,
  Button as Mbutton,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Button, CustomTable } from "../../components";
import { Close } from "@mui/icons-material";
import { TabIcon } from "../../assets";
import styles from "./Campaign.module.scss";
import { CampaignContext, CurrentContext } from "../../utils/contexts";
import { tableData } from "../../utils/constants";
import { selectArtistColumns } from "../../utils/constants/tableData";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SelectArtists = ({
  open,
  handleClose,
  handleSave,
  handleSaveGlobal,
  selectedArtists,
}) => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [modifiedArtists, setModifiedArtists] = useState({});
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ytVisible, setYtVisibile] = useState(true);
  const [igVisible, setIgVisibile] = useState(true);

  const { setTabIndex } = useContext(CurrentContext);
  const { artists } = useContext(CampaignContext);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleTabsChange = (event, newValue) => {
    setTabIndex(newValue);
    setTab(newValue);
  };

  const { campaign } = useContext(CurrentContext);

  function handleSelectRow(rows) {
    // setCampaign({ ...campaign, selectedArtists: rows });
    // setSelectedArtists(rows);
    setSelectedRows(rows);
  }

  useEffect(() => {
    if (campaign) {
      const selected = selectedArtists?.map((artist) => artist._id);
      let finalData = [];
      let tLanguages = new Set();
      let tCategories = new Set();
      artists
        ?.filter((artist) =>
          selected ? !selected.includes(artist._id) : artist
        )
        .forEach((artist) => {
          finalData.push({
            ...artist,
            key: artist._id,
            instagramLink: artist.instagram?.link || "NA",
            youtubeLink: artist.youtube?.link || "NA",
            ytSubscribers: artist.youtube?.subscribers || "NA",
            igFollowers: artist.instagram?.followers || "NA",
            averageViewsYT: artist.youtube?.averageViews || "NA",
            averageViewsIG: artist.instagram?.averageViews || "NA",
            commercialCreatorYT: artist.youtube?.commercial,
            commercialCreatorIGReel: artist.instagram?.reelCommercial,
            commercialCreatorIGStory: artist.instagram?.storyCommercial,
          });
          tCategories.add(...artist.categories);
          tLanguages.add(...artist.languages);
        });
      setLanguages([...tLanguages]?.filter((lang) => lang.length));
      setCategories([...tCategories]?.filter((cat) => cat.length));
      setData(finalData);
    }
  }, [artists, campaign, selectedArtists]);

  // useEffect(() => {
  //   console.log({ data });
  // });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      className={styles.dialog}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Mbutton
            autoFocus
            color="inherit"
            onClick={() => {
              handleSave(selectedRows);
              handleClose();
            }}
          >
            save
          </Mbutton>
          <Mbutton
            style={{ marginLeft: "auto" }}
            color="inherit"
            onClick={() => handleSaveGlobal(modifiedArtists)}
          >
            Save Global
          </Mbutton>
        </Toolbar>
      </AppBar>
      <div className={styles.tablesContainer}>
        <div className={styles.tabs}>
          <Tabs value={tab} onChange={handleTabsChange} aria-label="Tabs">
            <Tab
              icon={<TabIcon filled={tab === 0} value={0} />}
              // value={0}
              aria-label="Overview"
            />
            <Tab
              icon={<TabIcon filled={tab === 1} value={1} />}
              // value={1}
            />
            <Tab
              icon={<TabIcon filled={tab === 2} value={2} />}
              // value={2}
            />
          </Tabs>
          <div>
            <FormControlLabel
              style={{ color: "white" }}
              control={
                <Switch
                  checked={ytVisible}
                  onChange={(e) => setYtVisibile(e.target.checked)}
                />
              }
              label="YT"
            />
            <FormControlLabel
              style={{ color: "white" }}
              control={
                <Switch
                  checked={igVisible}
                  onChange={(e) => setIgVisibile(e.target.checked)}
                />
              }
              label="IG"
            />
          </div>
          {/* <Button>Save</Button> */}
        </div>

        {/* </Box> */}
        {/* )} */}
        <TabPanel value={tab} index={0}>
          <div className={styles.tableContainer}>
            <CustomTable
              columns={selectArtistColumns.main?.filter(
                (item) =>
                  checkForYT(ytVisible, item) && checkForIG(igVisible, item)
              )}
              data={data?.filter((item) =>
                checkDataForVisibility(ytVisible, igVisible, item)
              )}
              isSelectable
              width={2200}
              setData={setData}
              setModifiedArtists={setModifiedArtists}
              onRowSelect={handleSelectRow}
              //   selectedRows={campaign?.selectedArtists || []}
            />
          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <div className={styles.tableContainer}>
            <CustomTable
              columns={selectArtistColumns.info}
              data={data?.filter((item) =>
                checkDataForVisibility(ytVisible, igVisible, item)
              )}
              isSelectable
              setData={setData}
              setModifiedArtists={setModifiedArtists}
              onRowSelect={handleSelectRow}
              categories={categories}
              languages={languages}
              //   selectedRows={campaign?.selectedArtists || []}
            />
          </div>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <div className={styles.tableContainer}>
            <CustomTable
              columns={selectArtistColumns.contact}
              data={data?.filter((item) =>
                checkDataForVisibility(ytVisible, igVisible, item)
              )}
              isSelectable
              setData={setData}
              setModifiedArtists={setModifiedArtists}
              onRowSelect={handleSelectRow}
              //   selectedRows={campaign?.selectedArtists || []}
            />
          </div>
        </TabPanel>
      </div>
    </Dialog>
  );
};

export default SelectArtists;

function checkForYT(isVisible, item) {
  if (!isVisible) {
    switch (item.dataIndex) {
      case "youtubeLink":
      case "ytSubscribers":
      case "averageViewsYT":
      case "commercialCreatorYT":
        return false;

      default:
        return true;
    }
  }
  return true;
}
function checkForIG(isVisible, item) {
  if (!isVisible) {
    switch (item.dataIndex) {
      case "instagramLink":
      case "igFollowers":
      case "averageViewsIG":
      case "commercialCreatorIGReel":
      case "commercialCreatorIGStory":
        return false;

      default:
        return true;
    }
  }
  return true;
}

function checkDataForVisibility(ytVisible, igVisible, item) {
  if (ytVisible && igVisible) {
    if (
      (!item.youtubeLink || item.youtubeLink === "NA") &&
      (!item.instagramLink || item.instagramLink === "NA") &&
      (!item.ytSubscribers || item.ytSubscribers === "NA") &&
      (!item.igFollowers || item.igFollowers === "NA")
    ) {
      return false;
    }
  }
  if (!ytVisible && igVisible) {
    if (
      (!item.instagramLink || item.instagramLink === "NA") &&
      (!item.igFollowers || item.igFollowers === "NA")
    ) {
      return false;
    }
  }
  if (ytVisible && !igVisible) {
    if (
      (!item.youtubeLink || item.youtubeLink === "NA") &&
      (!item.ytSubscribers || item.ytSubscribers === "NA")
    ) {
      return false;
    }
  }
  return true;
}
// function checkDataForIG(isVisible, item) {
//   if (isVisible) {
//     if (!item.instagramLink) {
//       return false;
//     }
//     if (!item.igFollowers) {
//       return false;
//     }
//   }
//   return true;
// }
