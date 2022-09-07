import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { API_ALL, API_ARTIST, API_CAMPAIGN } from "../API";
import { AuthContext } from "../auth/AuthContext";

export const CampaignContext = createContext({});

const CampaignContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [artists, setArtists] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    console.log({ currentUser });
  }, [currentUser]);

  async function fetchCampaigns(status = "all") {
    const res = await API_CAMPAIGN().get(`/all`, {
      params: {
        status,
        userId: currentUser?.id,
      },
    });
    setCampaigns(
      res.data?.map((campaign) => {
        let newObj = { ...campaign };
        newObj.id = newObj._id;
        delete newObj._id;
        return newObj;
      })
    );
    console.log("Yahi hai sab kuch", res.data);
    const art = await API_ARTIST().get(`/all`);

    setArtists(art.data);
  }

  async function fetchCampaign(id) {
    console.log({ id });
    try {
      const res = await API_CAMPAIGN().get(`/single/`, {
        params: { id },
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async function updateCampaign(campaign) {
    const res = await API_CAMPAIGN().patch(`/update/`, campaign);

    return res;
  }

  async function updateBrand(brandEmail, campaignId) {
    const res = await API_ALL().post(`/brand/push-campaign/`, {
      campaignId,
      email: brandEmail,
    });

    return res;
  }

  async function updateArtistsGlobal(artists) {
    return await API_ARTIST().patch(`/update/bulk`, artists);
  }

  useEffect(() => {
    fetchCampaigns();
  }, [currentUser]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        fetchCampaign,
        artists,
        updateCampaign,
        updateArtistsGlobal,
        updateBrand,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export default CampaignContextProvider;
