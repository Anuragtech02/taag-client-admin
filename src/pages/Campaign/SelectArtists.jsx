import {
  AppBar,
  Dialog,
  IconButton,
  Button as Mbutton,
  Slide,
  Tab,
  Tabs,
  Toolbar,
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

const SelectArtists = ({ open, handleClose, handleSave, handleSaveGlobal }) => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [modifiedArtists, setModifiedArtists] = useState({});

  const { setTabIndex } = useContext(CurrentContext);
  const { artists } = useContext(CampaignContext);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleTabsChange = (event, newValue) => {
    setTabIndex(newValue);
    setTab(newValue);
  };

  const {
    campaign,
    setCampaign,
    setCampaignMain,
    setCampaignInfo,
    setCampaignContact,
  } = useContext(CurrentContext);

  function handleSelectRow(rows) {
    // setCampaign({ ...campaign, selectedArtists: rows });
    // setSelectedArtists(rows);
    setSelectedRows(rows);
  }

  useEffect(() => {
    if (campaign) {
      const selected = campaign?.selectedArtists?.map((artist) => artist._id);
      setData(
        artists
          ?.filter((artist) =>
            selected ? !selected.includes(artist._id) : artist
          )
          ?.map((artist) => ({
            ...artist,
            key: artist._id,
            commercialCreatorYT: artist.youtube?.commercial,
            commercialCreatorIGReel: artist.instagram?.reelCommercial,
            commercialCreatorIGStory: artist.instagram?.storyCommercial,
          }))
      );
    }
  }, [artists, campaign]);

  useEffect(() => {
    console.log({ data });
  });

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
          {/* <Button>Save</Button> */}
        </div>

        {/* </Box> */}
        {/* )} */}
        <TabPanel value={tab} index={0}>
          <div className={styles.tableContainer}>
            <CustomTable
              columns={selectArtistColumns.main}
              data={data}
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
              data={data}
              isSelectable
              setData={setData}
              setModifiedArtists={setModifiedArtists}
              onRowSelect={handleSelectRow}
              //   selectedRows={campaign?.selectedArtists || []}
            />
          </div>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <div className={styles.tableContainer}>
            <CustomTable
              columns={selectArtistColumns.contact}
              data={data}
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
