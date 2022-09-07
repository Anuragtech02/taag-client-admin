import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { API_CAMPAIGN } from "../API";
import { AuthContext } from "../auth/AuthContext";
import { tableData } from "../constants";
import { CampaignContext } from "./CampaignContext";

export const CurrentContext = createContext({});

const CurrentContextProvider = ({ children }) => {
  const location = useLocation();
  const [table, setTable] = useState({
    columns: [],
    data: [],
  });
  const [campaignId, setCampaignId] = useState("");
  const [tabIndex, setTabIndex] = useState("1");
  const [campaign, setCampaign] = useState({});
  const [campaignMain, setCampaignMain] = useState([]);
  const [campaignInfo, setCampaignInfo] = useState([]);
  const [campaignContact, setCampaignContact] = useState([]);
  const [campaignInvoice, setCampaignInvoice] = useState([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState([]);
  const [isInvalidCampaign, setIsInvalidCampaign] = useState(false);
  const { fetchCampaign, artists } = useContext(CampaignContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        let temp = await API_CAMPAIGN().get(`/single/`, {
          params: { id: campaignId },
        });
        temp.data.totalCreator = temp.data.selectedArtists.length.toString();
        temp.data.agencyFees = getTotal(
          temp.data.selectedArtists,
          "agencyFees"
        );
        console.log({ temp });
        setCampaign(temp.data);
        setCampaignMain(
          temp.data.selectedArtists.map((item) => ({
            key: item._id,
            _id: item._id,
            name: item.name,
            link: item.link || "",
            followers: item.instagram ? item.instagram.followers : "NA",
            averageViews: item.averageViews,
            deliverable: temp.data.deliverable,
            // commercialCreator: item.commercialCreator || 0,
            brandCommercial: item.brandCommercial || 0,
            cpvBrand: item.cpvBrand || 0,
            agencyFees:
              item.agencyFees ||
              parseInt(item.brandCommercial) -
                parseInt(item.commercialCreator) ||
              0,
          }))
        );
        setCampaignInfo(
          temp.data.selectedArtists.map((item) => ({
            key: item._id,
            _id: item._id,
            name: item.name,
            gender: item.gender,
            location: item.location,
            languages: item.languages,
            categories: item.categories,
            type: item.type,
          }))
        );
        setCampaignContact(
          temp.data.selectedArtists.map((item) => ({
            key: item._id,
            _id: item._id,
            name: item.name,
            agencyName: item.agencyName,
            manager: item.manager,
            contact: item.contact,
            email: item.email,
          }))
        );
        setCampaignInvoice(
          temp.data.selectedArtists.map((item) => ({
            key: item._id,
            _id: item._id,
            name: item.name,
            invoice: item.invoice,
            date: item.date,
            note: item.note,
          }))
        );
        setCampaignAnalytics(
          temp.data.selectedArtists.map((item) => ({
            key: item._id,
            _id: item._id,
            name: item.name,
            deliverableLink: item.deliverableLink || "NA",
            views: item.views || "NA",
            comments: item.comments,
            roi: item.roi,
          }))
        );
        // handleTable(location);
        console.log("inside");
        setLoading(false);
      } catch (error) {
        setIsInvalidCampaign(true);
        setLoading(false);
      }
    }
    // console.log("fdsddddddddd ", { campaignId, len: artists?.length });
    if (campaignId && artists?.length) {
      console.log("fd ", { campaignId, len: artists?.length });
      fetchData();
    }
    // console.warn("useeffect");
  }, [campaignId, artists]);

  // function handleTable(location) {
  //   let newTable = {};

  //   if (location?.pathname === "/campaigns/" + campaignId) {
  //     switch (tabIndex) {
  //       case "1": {
  //         newTable.data = campaignMain;
  //         newTable.columns = tableData.campaign.main.columns;
  //         console.log(newTable);
  //         break;
  //       }
  //       case "2": {
  //         newTable.data = campaignInfo;
  //         newTable.columns = tableData.campaign.info.columns;
  //         break;
  //       }
  //       case "3": {
  //         newTable.data = campaignContact;
  //         newTable.columns = tableData.campaign.phone.columns;
  //         break;
  //       }
  //       default:
  //         newTable.data = [];
  //         newTable.columns = [];
  //     }
  //   } else if (
  //     location?.pathname ===
  //     "/campaigns/" + campaignId + "/commercials"
  //   ) {
  //     newTable.columns = tableData.campaign_commercials.columns;
  //     newTable.data = campaignInvoice;
  //   } else if (
  //     location?.pathname ===
  //     "/campaigns/" + campaignId + "/analytics"
  //   ) {
  //     newTable.columns = tableData.campaign_analytics.columns;
  //     newTable.data = campaignAnalytics;
  //   }
  //   setTable(newTable);
  // }

  // useEffect(() => {
  //   if (location?.pathname === "/campaigns/" + campaignId) setTabIndex("1");
  //   else setTabIndex(undefined);
  // }, [location, campaignId]);

  // useEffect(() => {
  //   handleTable(location);
  //   console.log(tabIndex);
  // }, [tabIndex, location]);

  // useEffect(() => {
  //   console.log({ table, location, tabIndex, campaignId });
  // });

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await axios.get("http://localhost:5000/youtube/getLikes", {
  //       params: {
  //         videoId: "ABCq_VHfsUM",
  //       },
  //     });
  //     console.log({ data });
  //   }
  //   fetchData();
  // }, []);

  return (
    <CurrentContext.Provider
      value={{
        campaign,
        setCampaign,
        table,
        setTable,
        campaignId,
        setCampaignId,
        setTabIndex,
        tabIndex,
        isInvalidCampaign,
        campaignMain,
        campaignInfo,
        campaignContact,
        campaignInvoice,
        campaignAnalytics,
        setCampaignMain,
        setCampaignInfo,
        setCampaignContact,
        loading,
        setCampaignInvoice,
        setCampaignAnalytics,
      }}
    >
      {children}
    </CurrentContext.Provider>
  );
};

export default CurrentContextProvider;

function getTotal(data, key) {
  return data.reduce((acc, item) => acc + item[key], 0);
}
