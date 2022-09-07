import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { icons } from "../../assets";
import { InputField } from "../";
import styles from "./MoreInformation.module.scss";
import { Share } from "@mui/icons-material";
import { Popconfirm } from "antd";

const {
  purpleCoin,
  purpleEye,
  purplePerson,
  purpleBrandPlaceholder,
  searchIcon,
  addIcon,
} = icons;

const defaultMoreInformationProps = {
  isVisible: false,
};

const MoreInformation = ({
  moreInformationProps = defaultMoreInformationProps,
}) => {
  const {
    isVisible,
    agencyFees,
    brandAmount,
    totalAverageViews,
    totalCreator,
    averageROI,
    onClickAdd,
    onClickShare,
    totalViews,
    totalComments,
  } = { ...moreInformationProps };
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  function handleSearchButton(e, value) {
    e.stopPropagation();

    setShowSearchInput(value);
  }
  useEffect(() => {
    if (showSearchInput) searchRef.current.focus();
  }, [showSearchInput]);
  return (
    <div
      style={isVisible ? {} : { display: "none" }}
      className={styles.container}
    >
      <div
        style={showSearchInput ? { width: "800px" } : {}}
        className={styles.tags}
      >
        <InformationTag
          title={"Agency Fees"}
          value={agencyFees}
          icon={purpleCoin}
        />
        <InformationTag
          title={"Brand Amount"}
          value={brandAmount}
          icon={purpleBrandPlaceholder}
        />
        <InformationTag
          title={"Total Avg Views"}
          value={totalAverageViews}
          icon={purpleEye}
        />
        <InformationTag
          title={"Total Creator"}
          value={totalCreator}
          icon={purplePerson}
        />
        <InformationTag title={"Avg ROI"} value={averageROI} icon={purpleEye} />
        <InformationTag
          title={"Total Views"}
          value={totalViews}
          icon={purpleEye}
        />
        <InformationTag
          title={"Total Comments"}
          value={totalComments}
          icon={purpleBrandPlaceholder}
        />
      </div>
      <div className={styles.buttons}>
        {/* {showSearchInput ? (
          <InputField
            id="search"
            type="search"
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => handleSearchButton(e, false)}
            placeholder={"Search Campaign"}
          />
        ) : (
          <IconButton onClick={(e) => handleSearchButton(e, true)}>
            <img src={searchIcon} alt="Search" />
          </IconButton>
        )} */}
        <Popconfirm title="Sure, share with brand?" onConfirm={onClickShare}>
          <Tooltip title="Share with Brand" placement="top">
            <IconButton>
              <Share style={{ fill: "white" }} />
            </IconButton>
          </Tooltip>
        </Popconfirm>
        <Tooltip title="Add Column" placement="top">
          <IconButton onClick={onClickAdd}>
            <img src={addIcon} alt="Add" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

const InformationTag = ({ icon, value, title }) => {
  return (
    <div
      style={value !== undefined && value !== null ? {} : { display: "none" }}
      className={styles.tag}
    >
      <img src={icon} alt={value} />
      <p>
        {title + ":"} <span>{value}</span>
      </p>
    </div>
  );
};

export default MoreInformation;
