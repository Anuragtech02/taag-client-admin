import { useState, useEffect, createContext, useContext } from "react";
import { API_ALL, API_ARTIST, API_CAMPAIGN } from "../API";
import { AuthContext } from "../auth/AuthContext";

export const CampaignContext = createContext({});

const CampaignContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [artists, setArtists] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);

  const { currentUser } = useContext(AuthContext);

  // useEffect(() => {
  //   console.log({ currentUser });
  // }, [currentUser]);

  async function fetchSectors() {
    const res = await API_ALL().get("/sector/all");
    setSectorOptions(res.data);
  }

  async function createSector(newValue) {
    console.log({ newValue });
    const res = await API_ALL().post("/sector/create", {
      name: newValue?.name,
      value: newValue?.value,
    });
    setSectorOptions((prev) => [...prev, res.data]);
  }

  async function fetchArtists() {
    const art = await API_ARTIST().get(`/all`);
    setArtists(art.data);
  }

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
    const art = await API_ARTIST().get(`/all`);

    setArtists(art.data);
  }

  async function fetchCampaign(id) {
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

  async function deleteCampaign(id) {
    const res = await API_CAMPAIGN().delete("/delete", {
      params: { id },
    });
    return res;
  }

  async function updateArtistsGlobal(artists) {
    return await API_ARTIST().patch(`/update/bulk`, artists);
  }

  useEffect(() => {
    if (currentUser) {
      fetchCampaigns();
      fetchSectors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        fetchCampaign,
        artists,
        sectorOptions,
        createSector,
        setArtists,
        fetchArtists,
        deleteCampaign,
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
