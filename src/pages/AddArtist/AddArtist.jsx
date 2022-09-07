import styles from "./AddArtist.module.scss";
import {
  Button,
  CreatableMultipleSelect,
  InputField,
  InputSelect,
  RadioButton,
} from "../../components";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ALL } from "../../utils/API";

const sectorOptions = [
  {
    name: "Vlog",
    value: "vlog",
  },
  {
    name: "Makeup",
    value: "makeup",
  },
  {
    name: "Genz",
    value: "genz",
  },
  {
    name: "Skincare",
    value: "skincare",
  },
  {
    name: "Fitness",
    value: "fitness",
  },
  {
    name: "Couple",
    value: "couple",
  },
  {
    name: "Dance",
    value: "dance",
  },
  {
    name: "Comedy",
    value: "comedy",
  },
  {
    name: "Music",
    value: "music",
  },
];

const genderOptions = [
  {
    name: "Male",
    value: "male",
  },
  {
    name: "Female",
    value: "female",
  },
  {
    name: "Other",
    value: "other",
  },
];

const typeOptions = [
  {
    name: "Macro",
    value: "macro",
  },
  {
    name: "Mini",
    value: "mini",
  },
  {
    name: "Mega",
    value: "mega",
  },
];

const languageOptions = [
  {
    name: "Hindi",
    value: "hindi",
  },
  {
    name: "English",
    value: "english",
  },
  {
    name: "Marathi",
    value: "marathi",
  },
];

const AddArtist = () => {
  const totalNoOfFields = 13;
  const [progress, setProgress] = useState(0.000001);
  const [value, setValue] = useState("");
  const [instagram, setInstagram] = useState({});
  const [youtube, setYoutube] = useState({});
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [values, setValues] = useState({});
  useEffect(() => {
    console.log(categories);
  });
  const navigate = useNavigate();

  async function handleAddLanguage(valueToAdd) {
    console.log(valueToAdd);
  }

  async function handleAddCategories(valueToAdd) {
    console.log(valueToAdd);
  }

  function handleChange(e) {
    const { id, value, name } = e.target;
    setValues((prev) => {
      return {
        ...prev,
        [name ? name : id]: value,
      };
    });
  }

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      instagram,
      youtube,
      categories: categories?.map((cat) => cat.value),
      languages,
    }));
  }, [instagram, youtube, categories, languages]);

  function handleInstagram(param) {
    return (e) => {
      setInstagram((prev) => ({ ...prev, [param]: e.target.value }));
    };
  }
  function handleYoutube(param) {
    return (e) => {
      setYoutube((prev) => ({ ...prev, [param]: e.target.value }));
    };
  }
  useEffect(() => {
    console.log(values);
  }, [values]);

  function handleProgress() {}

  async function submitHandler(e) {
    e.preventDefault();
  }
  useEffect(() => {
    async function getSubsribers() {
      const res = await API_ALL().get("/youtube/subscribers", {
        params: {
          youtubeURI: values?.youtube?.link,
        },
      });
      setYoutube((prev) => ({ ...prev, subscribers: res?.data?.subscribers }));
    }
    if (values?.youtube?.link) {
      getSubsribers();
    }
  }, [values?.youtube?.link]);
  return (
    <MainLayout
      classes={[styles.container]}
      isSideMenuVisible={false}
      navbarProps={{
        titleProps: {
          disabled: true,
          id: "name",
          name: "Add Artist",
          isBackIconVisible: true,
          isEditIconVisible: false,
        },
      }}
    >
      <form onSubmit={submitHandler}>
        <section className={styles.inputs}>
          <FormSection sectionName={"Artist Information"} sectionNumber={1}>
            <InputField
              required
              onChange={handleChange}
              id="artistName"
              value={values?.artistName}
              label={"Artist Name"}
            />
            <CreatableMultipleSelect
              value={categories}
              width={"950px"}
              setValue={setCategories}
              label={"Categories"}
              id="categories"
              onAddModalSubmit={handleAddCategories}
              options={sectorOptions}
            />
            <CreatableMultipleSelect
              required
              width={"900px"}
              name="languages"
              label={"Languages"}
              id="languages"
              value={languages}
              setValue={setLanguages}
              options={languageOptions}
              onAddModalSubmit={handleAddLanguage}
            />
            <InputSelect
              required
              name="type"
              label={"Type"}
              value={values?.type}
              onChange={handleChange}
              options={typeOptions}
            />
            <InputSelect
              required
              name="gender"
              label={"Gender"}
              value={values?.gender}
              onChange={handleChange}
              options={genderOptions}
            />
            <InputField
              required
              onChange={handleChange}
              id="location"
              value={values?.location}
              label={"Location"}
            />
          </FormSection>
          <FormSection sectionName={"Instagram"} sectionNumber={2}>
            <InputField
              required
              onChange={handleInstagram("link")}
              value={instagram?.link}
              label={"Link"}
            />
            <InputField
              required
              onChange={handleInstagram("followers")}
              value={instagram?.followers}
              label={"Followers"}
            />

            <InputField
              required
              onChange={handleInstagram("reelCommercial")}
              value={instagram?.reelCommercial}
              label={"Reel Commercial"}
            />
            <InputField
              required
              onChange={handleInstagram("storyCommercial")}
              value={instagram?.storyCommercial}
              label={"Story Commercial"}
            />
            <InputField
              required
              onChange={handleInstagram("averageViews")}
              value={instagram?.averageViews}
              label={"Average Views"}
            />
          </FormSection>
          <FormSection sectionName={"Youtube"} sectionNumber={3}>
            <InputField
              required
              onChange={handleYoutube("link")}
              value={youtube?.link}
              label={"Link"}
            />
            <InputField
              required
              onChange={handleYoutube("subscribers")}
              value={youtube?.subscribers}
              label={"Subscribers"}
              disabled
            />

            <InputField
              required
              onChange={handleYoutube("commercial")}
              value={youtube?.commercial}
              label={"Commercial"}
            />
            <InputField
              required
              onChange={handleYoutube("averageViews")}
              value={youtube?.averageViews}
              label={"Average Views"}
            />
          </FormSection>
          <FormSection sectionName={"Other"} sectionNumber={4}>
            <InputField
              required
              onChange={handleChange}
              id="agencyName"
              value={values?.agencyName}
              label={"Agency Name"}
            />
            <InputField
              required
              onChange={handleChange}
              id="manager"
              value={values?.manager}
              type="tel"
              label={"Manager"}
            />
            <InputField
              required
              onChange={handleChange}
              id="contact"
              value={values?.contact}
              type="tel"
              label={"Contact"}
            />
            <InputField
              required
              onChange={handleChange}
              id="email"
              value={values?.email}
              type="email"
              label={"Email"}
            />
          </FormSection>
        </section>
        <Button style={{ margin: "1rem 0" }} type="submit">
          Submit
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

export default AddArtist;
