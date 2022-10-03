import styles from "./NewCampaign.module.scss";
import {
  Button,
  CreatableMultipleSelect,
  InputField,
  InputSelect,
  RadioButton,
} from "../../components";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CreatableSingleSelect } from "../../components";
import { deliverableOptions } from "../../utils/constants";
import { showAlert } from "../../utils";
import { AuthContext } from "../../utils/auth/AuthContext";
import { API_ALL, API_CAMPAIGN } from "../../utils/API";
import { CampaignContext } from "../../utils/contexts";
import { message } from "antd";

const brandOptions = [
  {
    name: "Nike",
    value: "nike",
  },
  {
    name: "Hello Kitty",
    value: "helloKitty",
  },
  {
    name: "Rolex",
    value: "rolex",
  },
];

const AddCampaign = () => {
  const totalNoOfFields = 12; //12 considering campaign name
  const [progress, setProgress] = useState(0.000001);
  const [value, setValue] = useState("");
  const [values, setValues] = useState({});
  const [brand, setBrand] = useState({ name: "" });
  const [newBrand, setNewBrand] = useState({ name: "" });
  const [brandOptions, setBrandOptions] = useState([]);
  const [brandSectors, setBrandSectors] = useState([]);
  const [platformSectors, setPlatformSectors] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { sectorOptions, createSector } = useContext(CampaignContext);

  function handleChange(e) {
    const { id, value, name } = e.target;
    // console.log(id, value, name);
    setValues((prev) => {
      return {
        ...prev,
        [name ? name : id]: value,
      };
    });
  }

  async function createBrand(brandData) {
    console.log(brandData);

    const {
      name,
      sectors,
      website,
      picName,
      position,
      contact,
      email,
      password,
    } = brandData;

    const finalData = {
      name,
      sectors, // Beauty | Fashion | Health
      website, // URL
      poc: {
        name: picName,
        position,
        contact, // +91xxxxxxxxxx
        email: email?.toLowerCase(),
      },
      campaigns: [],
      password,
    };
    try {
      let brandLoading = message.loading("Creating brand...");
      let temp = await API_ALL().post(`/brand/create`, finalData);
      console.log({ hello: temp.data.data, finalData });
      setNewBrand(temp.data.data);
      setBrandOptions((prev) => [...prev, temp.data]);
      brandLoading();
      showAlert("success", "Brand created successfully");
      console.log({ res: temp });
      return {
        status: "success",
      };
    } catch (error) {
      showAlert("error", error.response.data.message);
      // console.log(error);
    }
  }

  async function getBrands() {
    let temp = await API_ALL().get(`/brand/all`);
    setBrandOptions(temp.data);
  }
  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    console.log({ brand });
    if (brand?.name && brand?.poc) {
      setBrandSectors(brand.sectors);
      setValues((prev) => ({
        ...prev,
        brandName: brand.name,
        website: brand.website,
        PICName: brand.poc.name,
        PICPosition: brand.poc.position,
        PICEmail: brand.poc.email,
        PICContact: brand.poc.contact,
      }));
    }
  }, [brand]);
  useEffect(() => {
    console.log({ brand });
    if (newBrand?.name && newBrand?.poc) {
      setBrandSectors(newBrand.sectors);
      setValues((prev) => ({
        ...prev,
        brandName: newBrand.name,
        website: newBrand.website,
        PICName: newBrand.poc.name,
        PICPosition: newBrand.poc.position,
        PICEmail: newBrand.poc.email,
        PICContact: newBrand.poc.contact,
      }));
    }
  }, [newBrand]);

  async function handleAddBrand(valueToAdd) {
    return await createBrand(valueToAdd);
  }

  function handleAddBrandSectors(newValue) {
    createSector(newValue);
  }
  function handleAddPlatFormSectors(newValue) {
    createSector(newValue);
  }

  function handleProgress() {}

  useEffect(() => {
    function flattenObject(obj) {
      let result = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object") {
            let flatObject = flattenObject(obj[key]);
            for (let i in flatObject) {
              if (flatObject.hasOwnProperty(i)) {
                result[key + "." + i] = flatObject[i];
              }
            }
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    }
    let ob = flattenObject(values);
    console.log({ ob, values });
    setProgress(
      (Object.values(values).filter((item) => item.length).length /
        totalNoOfFields) *
        100 || 0.0000001
    );
  }, [values]);

  useEffect(() => {
    console.log(values);
  });

  async function submitHandler(e) {
    e.preventDefault();

    if (!values.campaignName) {
      document.getElementById("campaignName").focus();
      return showAlert("error", "Campaign name is required");
    }
    const finalBrand = brand?.poc ? brand : newBrand;
    console.log({ brand });
    let campaign = {
      name: values.campaignName || "Test",
      brand: {
        name: finalBrand.name,
        sectors: brandSectors, // Beauty | Fashion | Health
        website: finalBrand.website, // URL
        poc: {
          id: finalBrand.poc.name,
          position: finalBrand.poc.position,
          email: finalBrand.poc.email,
          contact: finalBrand.poc.contact, // +91xxxxxxxxxx
        },
      },
      platform: values.platform, // youtube | instagram
      sectors: platformSectors, // Beauty | Fashion | Health | Lifestyle
      deliverable: values.deliverable, // video | image
      brief: values.brief,
      selectedArtists: [],
      brandAmount: 0,
      currency: "INR", // INR | USD
      agencyFee: 0,
      totalCreators: 0,
      totalAverageViews: 0,
      status: "draft", // draft | locked | finished
      sharedWith: [],
      createdAt: new Date().toISOString(), // ISOString
      updatedAt: new Date().toISOString(), // ISOString
      createdBy: {
        id: currentUser.id,
        userType: currentUser.userType,
      },
    };
    // console.log({ campaign });
    const res = await API_CAMPAIGN().post(`/create`, campaign);

    console.log({ res });

    if (res.status.toString().includes("20")) {
      navigate(`/campaigns/${res.data.data._id}`);
    }
  }

  useEffect(() => {
    setValues((prev) => ({ ...prev, brandSectors, platformSectors }));
  }, [brandSectors, platformSectors]);

  return (
    <MainLayout
      classes={[styles.container]}
      // isSideMenuVisible
      navbarProps={{
        titleProps: {
          id: "campaignName",
          name: values?.campaignName,
          onChange: handleChange,
          isEditIconVisible: true,
          isBackIconVisible: true,
        },
        progress,
      }}
    >
      <form onSubmit={submitHandler}>
        <FormSection sectionName={"Brand / Agency"} sectionNumber={1}>
          <section className={styles.inputs}>
            <CreatableSingleSelect
              required
              name="brandName"
              label={"Brand Name"}
              id="brandName"
              value={brand}
              setValue={setBrand}
              options={brandOptions}
              onAddModalSubmit={handleAddBrand}
            />
            <InputField
              required
              onChange={handleChange}
              id="website"
              value={values?.website}
              label={"Website"}
            />
            <CreatableMultipleSelect
              required
              options={sectorOptions}
              width="650px"
              setValue={setBrandSectors}
              id="brandSectors"
              value={brandSectors}
              label={"Sectors"}
              onAddModalSubmit={handleAddBrandSectors}
            />

            <div className={styles.personInContact}>
              <InputField
                required
                onChange={handleChange}
                id="PICName"
                value={values?.PICName}
                label={"Person in Contact Name"}
              />
              <InputField
                required
                onChange={handleChange}
                id="PICPosition"
                value={values?.PICPosition}
                label={"Position"}
              />
              <InputField
                required
                onChange={handleChange}
                id="PICEmail"
                value={values?.PICEmail}
                type="email"
                label={"Email Id"}
              />
              <InputField
                required
                onChange={handleChange}
                id="PICContact"
                value={values?.PICContact}
                type="tel"
                label={"Contact"}
              />
            </div>
          </section>
        </FormSection>
        <FormSection sectionName={"Platform"} sectionNumber={2}>
          <section className={styles.inputs}>
            <div className={styles.radioButtonGroup}>
              <RadioButton
                required
                name="platform"
                label={"Youtube"}
                value={"youtube"}
                onChange={handleChange}
              />
              <RadioButton
                required
                name="platform"
                label={"Instagram"}
                value={"instagram"}
                onChange={handleChange}
              />
            </div>
            <InputSelect
              required
              name="deliverable"
              label={"Deliverable"}
              value={values?.deliverable}
              onChange={handleChange}
              options={deliverableOptions.filter((del) =>
                del.value.includes(values.platform === "youtube" ? "YT" : "IG")
              )}
            />
            <CreatableMultipleSelect
              required
              options={sectorOptions}
              setValue={setPlatformSectors}
              id="platformSectors"
              width="650px"
              value={platformSectors}
              label={"Sectors"}
              onAddModalSubmit={handleAddPlatFormSectors}
            />
          </section>
        </FormSection>
        <FormSection sectionName={"Brief"} sectionNumber={3}>
          <section className={styles.inputs}>
            <InputField
              required
              id="brief"
              value={values?.brief}
              variant="large"
              onChange={handleChange}
              placeholder={"Enter Brief for Influencer"}
            />
          </section>
        </FormSection>
        <Button disabled={progress < 1} type="submit">
          Continue
        </Button>
      </form>
    </MainLayout>
  );
};

const FormSection = ({ sectionName, children, sectionNumber }) => {
  return (
    <div className={styles.formSection}>
      <div className={clsx(styles.fontG500, styles.header)}>
        <div className={styles.sectionNumber}>{sectionNumber}</div>
        <div className={styles.sectionName}>{sectionName}</div>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default AddCampaign;
