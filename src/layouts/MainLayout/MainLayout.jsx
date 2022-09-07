import { Navbar, SideMenu } from "../../components";
import styles from "./MainLayout.module.scss";
import clsx from "clsx";
import MoreInformation from "../../components/MoreInformation/MoreInformation";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { createContext } from "react";
import { useContext } from "react";
import { AuthContext } from "../../utils/auth/AuthContext";

const defaultNavbarProps = {
  titleProps: {
    name: "",
    isEditIconVisible: false,
    isBackIconVisible: false,
    brandName: "",
    disabled: false,
  },
  progress: 0,
};

const MainLayout = ({
  children,
  campaignId,
  navbarProps = defaultNavbarProps,
  classes = [],
  isSideMenuVisible = false,
  moreInformationProps,
}) => {
  const { loading } = useContext(AuthContext);

  return (
    <section className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar {...navbarProps} />
          <SideMenu
            campaignId={campaignId}
            isSideMenuVisible={isSideMenuVisible}
          />
          <MoreInformation moreInformationProps={moreInformationProps} />
          <main className={clsx(classes)}>{children}</main>
        </>
      )}
    </section>
  );
};

export default MainLayout;

const Loading = () => {
  return (
    <div className={styles.loading}>
      <CircularProgress />
    </div>
  );
};
