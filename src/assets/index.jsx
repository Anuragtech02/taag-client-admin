import logo from "./icons/logo.svg";
import bell from "./icons/bell.svg";
import editing from "./icons/editing.svg";
import profile from "./images/profile.png";
import back from "./icons/back.svg";
import papers from "./icons/papers.svg";
import speaker from "./icons/speaker.svg";
import eye from "./icons/eye.svg";
import addIcon from "./icons/add.svg";
import searchIcon from "./icons/search.svg";
import purplePerson from "./icons/purplePerson.svg";
import info from "./icons/info.svg";
import phone from "./icons/phone.svg";
import selectedBrandPlaceholder from "./icons/selectedBrandPlaceholder.svg";
import purpleBrandPlaceholder from "./icons/purpleBrandPlaceholder.svg";
import brandPlaceholder from "./icons/brandPlaceholder.svg";
import purpleCoin from "./icons/purpleCoin.svg";
import purpleEye from "./icons/purpleEye.svg";
import selectedInfo from "./icons/selectedInfo.svg";
import selectedPhone from "./icons/selectedPhone.svg";

export const icons = {
  logo,
  bell,
  editing,
  back,
  papers,
  speaker,
  eye,
  addIcon,
  searchIcon,
  purplePerson,
  purpleCoin,
  purpleEye,
  selectedBrandPlaceholder,
  brandPlaceholder,
  info,
  purpleBrandPlaceholder,
  phone,
  selectedInfo,
  selectedPhone,
};

export const images = {
  profile,
};

export const TabIcon = ({ filled, value }) => {
  console.log(filled);
  if (value === 0 && !filled)
    return <img src={brandPlaceholder} alt="Brands" />;
  if (value === 0 && filled)
    return <img src={selectedBrandPlaceholder} alt="Brands" />;
  if (value === 1 && !filled) return <img src={info} alt="Information" />;
  if (value === 1 && filled)
    return <img src={selectedInfo} alt="Information" />;
  if (value === 2 && !filled) return <img src={phone} alt="Phone" />;
  if (value === 2 && filled) return <img src={selectedPhone} alt="Phone" />;

  return <div>Hello</div>;
};
