import axios from "axios";
import { TAAG_ADMIN_TOKEN } from "./constants/constants";

export const API_ALL = () =>
  axios.create({
    baseURL: `${process.env.REACT_APP_API_URI}`,
    headers: {
      accesskey: localStorage.getItem(TAAG_ADMIN_TOKEN),
    },
  });

export const API_ARTIST = () =>
  axios.create({
    baseURL: `${process.env.REACT_APP_API_URI}/artist`,
    headers: {
      accesskey: localStorage.getItem(TAAG_ADMIN_TOKEN),
    },
  });

export const API_CAMPAIGN = () =>
  axios.create({
    baseURL: `${process.env.REACT_APP_API_URI}/campaigns`,
    headers: {
      accesskey: localStorage.getItem(TAAG_ADMIN_TOKEN),
    },
  });

export const API_AUTH = () =>
  axios.create({
    baseURL: `${process.env.REACT_APP_API_URI}/auth`,
    headers: {
      accesskey: localStorage.getItem(TAAG_ADMIN_TOKEN),
    },
  });
