import { Drawer } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { Button, InputField } from "../../components";
import { camelize, showAlert, titleCase } from "../../utils";
import { API_CAMPAIGN } from "../../utils/API";
import { CampaignContext, CurrentContext } from "../../utils/contexts";
import styles from "./Campaign.module.scss";

const NewColumn = ({ open, handleClose }) => {
  const onClose = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    handleClose();
  };

  const [name, setName] = useState("");
  const [type, setType] = useState("text");

  const { campaign, setCampaign } = useContext(CurrentContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const newCampaign = { ...campaign };
    newCampaign.extras = [
      ...newCampaign.extras,
      {
        title: titleCase(name),
        type,
        dataIndex: camelize(name),
      },
    ];
    const res = await API_CAMPAIGN().patch(`/update`, newCampaign);
    console.log({ res });
    setCampaign(res.data.data);
    showAlert("success", `Added new column ${titleCase(name)}`);
    // onClose();
    handleClose();
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit} className={styles.newColDrawer}>
        <h3>Add New Column</h3>
        <InputField
          required
          value={name}
          placeholder="Column Name"
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          required
          value={type}
          placeholder="Column Type"
          onChange={(e) => setType(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Drawer>
  );
};

export default NewColumn;
