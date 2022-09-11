import { formatIndianCurrency, KMBFormatter, showAlert } from "..";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_CAMPAIGN } from "../API";

const props = {
  name: "file",
  action: `${process.env.REACT_APP_API_URL}/campaign/upload`,
  headers: {
    authorization: localStorage.getItem("token"),
  },

  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const handleChangeInvoice = async (e, record) => {
  const file = e.target.files[0];
  if (!file) {
    return showAlert("error", "Please Select a valid file");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("id", window.location.pathname.split("/")[2]);
  formData.append("artistId", record._id);
  console.log(file);
  const res = await API_CAMPAIGN().post(`/upload`, formData);
  showAlert("success", "Invoice Uploaded Successfully");
  console.log({ res });
};

const onClickDownloadInvoice = async (record) => {
  const res = await API_CAMPAIGN().get(`/download-invoice/`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
    params: {
      id: window.location.pathname.split("/")[2],
      artistId: record._id,
    },
    responseType: "blob",
  });
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", record.invoice);

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode.removeChild(link);
};

function getLink(record) {
  let link = record.deliverable?.includes("YT")
    ? record.youtube?.link || "NA"
    : record.instagram?.link || "NA";
  return link && link !== "NA" ? (
    <a
      style={{
        maxWidth: "100px",
        display: "block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      href={link ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link}
    </a>
  ) : (
    <span>NA</span>
  );
}

function removeArtist(record) {}

export const tableData = {
  campaign: {
    main: {
      columns: [
        {
          title: "Del",
          dataIndex: "remove",
          // sorter: (a, b) => parseInt(a.agencyFees) - parseInt(b.agencyFees),
          width: "4%",
          fixed: "left",
        },
        {
          title: "Name",
          fixed: "left",
          dataIndex: "name",
          key: "name",
          // width: "30%",
          searchable: true,
          // editable: true,
        },
        {
          title: "Link",
          dataIndex: "link",
          key: "link",
          // width: "20%",
          // searchable: true,
          render: (link, record) => getLink(record),
          editable: false,
        },
        {
          title: "Followers",
          dataIndex: "followers",
          key: "followers",
          render: (followers, record) => (
            <span>
              {KMBFormatter(
                record.deliverable?.includes("YT")
                  ? record.youtube?.subscribers
                  : record.instagram?.followers || "NA"
              )}
            </span>
          ),
          // width: "20%",
          sorter: (a, b) =>
            parseInt(a.instagram?.followers) - parseInt(b.instagram?.followers),
          // sortDirections: ["descend", "ascend"],
        },
        {
          title: "Avg. Views",
          dataIndex: "averageViews",
          key: "averageViews",
          render: (views, record) => <span>{KMBFormatter(views)}</span>,
          sorter: (a, b) => parseInt(a.averageViews) - parseInt(b.averageViews),
          // sortDirections: ["descend", "ascend"],
        },
        {
          title: "Deliverable",
          dataIndex: "deliverable",
          key: "deliverable",
          // width: "20%",
          searchable: true,
          editable: true,
        },
        {
          title: "Commercial Creator",
          dataIndex: "commercialCreator",
          key: "commercialCreator",
          // editable: true,
          render: (text) => <span>{formatIndianCurrency(text)}</span>,
          sorter: (a, b) =>
            parseInt(a.commercialCreator) - parseInt(b.commercialCreator),
          // width: "20%",
        },
        {
          title: "Brand Commercial",
          dataIndex: "brandCommercial",
          key: "brandCommercial",
          editable: true,
          render: (text) => <span>{formatIndianCurrency(text)}</span>,
          sorter: (a, b) =>
            parseInt(a.brandCommercial) - parseInt(b.brandCommercial),
          // width: "20%",
          // searchable: true,
        },
        {
          title: "CPV Brand",
          dataIndex: "cpvBrand",
          key: "cpvBrand",
          sorter: (a, b) => a.cpvBrand - b.cpvBrand,
          // width: "20%",
        },
        {
          title: "Agency Fees",
          dataIndex: "agencyFees",
          key: "agencyFees",
          render: (text, record) => (
            <span>
              {parseInt(text) < 0 ? "NA" : formatIndianCurrency(text)}
            </span>
          ),
          sorter: (a, b) => parseInt(a.agencyFees) - parseInt(b.agencyFees),
          // width: "20%",
        },
      ],
    },
    info: {
      columns: [
        {
          title: "Name",
          fixed: "left",
          dataIndex: "name",
          key: "name",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Gender",
          dataIndex: "gender",
          key: "gender",
          // width: "30%",
          // searchable: true,
          // filters: [
          //   {
          //     text: "Male",
          //     value: "male",
          //   },
          //   {
          //     text: "Female",
          //     value: "female",
          //   },
          // ],
          // onFilter: (value, record) =>
          //   record.gender.toLowerCase().indexOf(value) === 0,
          sorter: (a, b) => a.gender.length - b.gender.length,
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Language",
          dataIndex: "languages",
          key: "language",
          render: (languages) => (
            <span style={{ textTransform: "capitalize" }}>
              {languages.join(", ")}
            </span>
          ),
          // width: "30%",
          // searchable: true,
        },
        {
          title: "Category(Multiple#)",
          dataIndex: "categories",
          key: "categories",
          render: (categories) => <span>{categories?.join(", ")}</span>,
          // width: "30%",
          // searchable: true,
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          // width: "30%",
          searchable: true,
        },
      ],
    },
    phone: {
      columns: [
        {
          title: "Name",
          fixed: "left",
          dataIndex: "name",
          key: "name",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Agency Name",
          dataIndex: "agencyName",
          key: "agencyName",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Manager",
          dataIndex: "manager",
          key: "manager",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Contact",
          dataIndex: "contact",
          key: "contact",
          // width: "30%",
          searchable: true,
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          // width: "30%",
          searchable: true,
        },
      ],
    },
  },
  campaign_commercials: {
    columns: [
      {
        title: "Name",
        fixed: "left",
        dataIndex: "name",
        key: "name",
        // width: "30%",
        searchable: true,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        // width: "30%",
        render: (date) => <span>{new Date().toLocaleDateString()}</span>,
        // searchable: true,
      },
      {
        title: "Invoice Upload",
        dataIndex: "invoice",
        key: "invoice",
        render: (invoice, record) =>
          invoice ? (
            <Button
              // href={`${process.env.REACT_APP_API_URI}/camapaign/${invoice}`}
              // download
              onClick={() => onClickDownloadInvoice(record)}
            >
              Download
            </Button>
          ) : (
            <input
              type="file"
              placeholder="Upload"
              onChange={(e) => handleChangeInvoice(e, record)}
            />
          ),

        // width: "30%",
        // searchable: true,
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        // width: "30%",
        searchable: true,
        editable: true,
      },
    ],
  },
  campaign_analytics: {
    columns: [
      {
        title: "Name",
        fixed: "left",
        dataIndex: "name",
        key: "name",
        // width: "30%",
        searchable: true,
      },
      {
        title: "Upload Link",
        dataIndex: "deliverableLink",
        key: "deliverableLink",
        // width: "30%",
        searchable: true,
        editable: true,
      },
      {
        title: "Views",
        dataIndex: "views",
        key: "views",
        // width: "30%",
        searchable: true,
        sorter: (a, b) => parseInt(a.views) - parseInt(b.views),
        render: (text) => <span>{KMBFormatter(text)}</span>,
      },
      {
        title: "Comments",
        dataIndex: "comments",
        key: "comments",
        // width: "30%",
        searchable: true,
        sorter: (a, b) => parseInt(a.comments) - parseInt(b.comments),
        render: (text) => <span>{KMBFormatter(text)}</span>,
      },
      {
        title: "ROI",
        dataIndex: "roi",
        key: "ROI",
        // width: "30%",
        searchable: true,
      },
    ],
  },
};

export const selectArtistColumns = {
  main: [
    {
      title: "Name",
      fixed: "left",
      dataIndex: "name",
      key: "name",
      // width: "30%",
      searchable: true,
      // editable: true,
      render: (text) => {
        return <span>{text ?? "NA"}</span>;
      },
    },
    {
      title: "Youtube Link",
      dataIndex: "youtubeLink",
      key: "youtubeLink",
      // width: "20%",
      // searchable: true,
      render: (link, record) => (
        <span>
          {record?.youtube?.link ? (
            <a
              style={{
                maxWidth: "100px",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              href={record?.youtube?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {record?.youtube?.link || "NA"}
            </a>
          ) : (
            "NA"
          )}
        </span>
      ),
      editable: false,
      searchable: true,
    },
    {
      title: "Instagram Link",
      dataIndex: "instagramLink",
      key: "instagramLink",
      // width: "20%",
      // searchable: true,
      render: (link, record) => (
        <span>
          {record?.instagram?.link ? (
            <a
              style={{
                maxWidth: "100px",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              href={record?.instagram?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {record?.instagram?.link || "NA"}
            </a>
          ) : (
            "NA"
          )}
        </span>
      ),
      editable: false,
      searchable: true,
    },
    {
      title: "Followers",
      dataIndex: "igFollowers",
      key: "igFollowers",
      render: (followers, record) => (
        <span>{KMBFormatter(record.instagram?.followers || "NA")}</span>
      ),
      // width: "20%",
      sorter: (a, b) =>
        parseInt(a.instagram?.followers) - parseInt(b.instagram?.followers),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Subscribers",
      dataIndex: "ytSubscribers",
      key: "ytSubscribers",
      render: (sub, record) => (
        <span>{KMBFormatter(record.youtube?.subscribers || "NA")}</span>
      ),
      // width: "20%",
      sorter: (a, b) =>
        parseInt(a.instagram?.followers) - parseInt(b.instagram?.followers),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Avg. Views (YT)",
      dataIndex: "averageViewsYT",
      key: "averageViewsYT",
      render: (views, record) => (
        <span>{KMBFormatter(record.youtube?.averageViews)}</span>
      ),
      sorter: (a, b) =>
        parseInt(a.youtube?.averageViews) - parseInt(b.youtube?.averageViews),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Avg. Views (IG)",
      dataIndex: "averageViewsIG",
      key: "averageViewsIG",
      render: (views, record) => (
        <span>{KMBFormatter(record.instagram?.averageViews)}</span>
      ),
      sorter: (a, b) =>
        parseInt(a.instagram?.averageViews) -
        parseInt(b.instagram?.averageViews),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Commercial Creator (YT)",
      dataIndex: "commercialCreatorYT",
      key: "commercialCreatorYT",
      // editable: true,
      render: (text, record) => (
        <span>{formatIndianCurrency(text) ?? "NA"}</span>
      ),
      sorter: (a, b) =>
        parseInt(a.youtube?.commercial) - parseInt(b.youtube?.commercial),
      editable: true,
      // width: "20%",
    },
    {
      title: "Commercial Creator (Reel)",
      dataIndex: "commercialCreatorIGReel",
      key: "commercialCreatorIGReel",
      // editable: true,
      render: (text, record) => (
        <span>{formatIndianCurrency(text) ?? "NA"}</span>
      ),
      sorter: (a, b) =>
        parseInt(a.instagram?.reelCommercial) -
        parseInt(b.instagram?.reelCommercial),
      editable: true,
      // width: "20%",
    },
    {
      title: "Commercial Creator (IG Story)",
      dataIndex: "commercialCreatorIGStory",
      key: "commercialCreatorIGStory",
      // editable: true,
      render: (text, record) => (
        <span>{formatIndianCurrency(text) ?? "NA"}</span>
      ),
      sorter: (a, b) =>
        parseInt(a.instagram?.storyCommercial) -
        parseInt(b.instagram?.storyCommercial),
      editable: true,
      // width: "20%",
    },
    {
      title: "CPV Brand",
      dataIndex: "cpvBrand",
      key: "cpvBrand",
      // width: "20%",
    },
  ],
  contact: [
    {
      title: "Name",
      fixed: "left",
      dataIndex: "name",
      key: "name",
      // width: "30%",
      searchable: true,
    },
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      key: "agencyName",
      // width: "30%",
      searchable: true,
      editable: true,
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      // width: "30%",
      searchable: true,
      editable: true,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      // width: "30%",
      searchable: true,
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: "30%",
      searchable: true,
      editable: true,
    },
  ],
  info: [
    {
      title: "Name",
      fixed: "left",
      dataIndex: "name",
      key: "name",
      // width: "30%",
      searchable: true,
      render: (text) => {
        return <span>{text ?? "NA"}</span>;
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      // width: "30%",
      // searchable: true,
      // filters: [
      //   {
      //     text: "Male",
      //     value: "male",
      //   },
      //   {
      //     text: "Female",
      //     value: "female",
      //   },
      // ],
      // onFilter: (value, record) =>
      //   record.gender.toLowerCase().indexOf(value) === 0,
      sorter: (a, b) => a.gender.length - b.gender.length,
      render: (text) => {
        return <span>{text ?? "NA"}</span>;
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      editable: true,
      // width: "30%",
      searchable: true,
    },
    {
      title: "Language",
      dataIndex: "languages",
      key: "language",
      editable: true,
      render: (languages) => (
        <span style={{ textTransform: "capitalize" }}>
          {languages.join(", ")}
        </span>
      ),
      // width: "30%",
      // searchable: true,
    },
    {
      title: "Category(Multiple#)",
      dataIndex: "categories",
      key: "categories",
      editable: true,
      render: (categories) => <span>{categories?.join(", ") ?? "NA"}</span>,
      // width: "30%",
      // searchable: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      editable: true,
      // width: "30%",
      searchable: true,
      render: (text) => {
        return <span>{text ?? "NA"}</span>;
      },
    },
  ],
};
