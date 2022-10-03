import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button as AntButton,
  Form,
  Input,
  Popconfirm,
  Space,
  // Table,
} from "antd";
import { Table } from "ant-table-extensions";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import styles from "./CustomTable.module.scss";
import "antd/dist/antd.css";
import axios from "axios";
import {
  checkAndSplitStrToArray,
  getROI,
  getYoutubeId,
  KMBFormatter,
  replaceCommaAndSpaceWithEmptyString,
  showAlert,
} from "../../utils";
import { DeleteOutlined } from "@mui/icons-material";
import { API_ALL } from "../../utils/API";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values, dataIndex });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const CustomTable = ({
  columns,
  data,
  setData,
  onRowSelect,
  selectedRows,
  isSelectable,
  campaign,
  languages,
  categories,
  width,
  setModifiedArtists,
  tableLoading,
  setDataChange,
}) => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  // useState(() => {
  //   console.log({})
  //   setLoading(tableLoading);
  // }, [tableLoading]);

  useEffect(() => {
    setLoading(true);
    console.log("Changed", { data });
    sessionStorage.setItem("data", JSON.stringify(data));
    setLoading(false);
  }, [data]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [cols, setCols] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // useEffect(() => {
  //   if (selectedRows) {
  //     setLoading(true);
  //     console.log({ selectedRows });
  //     setSelectedRowKeys(selectedRows.map((item) => item._id));
  //     setLoading(false);
  //   }
  // }, [selectedRows]);

  const onSelectChange = (newSelectedRowKeys, rows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    console.log({ rows });
    onRowSelect(rows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]?.trim());
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, CompCustomRender, customProps) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys?.map((item) => item?.trim()),
              confirm,
              dataIndex
            )
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <AntButton
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys?.map((item) => item?.trim()),
                confirm,
                dataIndex
              )
            }
            icon={<SearchOutlined />}
            size="small"
            // style={{
            //   width: 90,
            // }}
          >
            Search
          </AntButton>
          <AntButton
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            // style={{
            //   width: 90,
            // }}
          >
            Reset
          </AntButton>
          <AntButton
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </AntButton>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text, record) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : CompCustomRender ? (
    //     <CompCustomRender text={text} record={record} />
    //   ) : (
    //     text
    //   ),
  });

  function handleDelete(record) {
    setData(data.filter((item) => item._id !== record._id));
  }

  useEffect(() => {
    setLoading(true);

    if (data) {
      setCols([
        ...columns?.map((col) => {
          let finalCol = {
            ...col,
          };
          if (col.dataIndex === "remove") {
            finalCol.render = (_, record) =>
              data.length >= 1 ? (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record)}
                >
                  <a>
                    <DeleteOutlined />
                  </a>
                </Popconfirm>
              ) : null;
          }
          if (col.dataIndex === "categories") {
            finalCol.filters = categories?.map((cat) => ({
              text: cat,
              value: cat,
            }));
            finalCol.onFilter = (value, record) =>
              record.categories.includes(value);
          }
          if (col.dataIndex === "languages") {
            finalCol.filters = languages?.map((lang) => ({
              text: lang,
              value: lang,
            }));
            finalCol.onFilter = (value, record) =>
              record.languages.includes(value);
          }
          if (col.editable) {
            finalCol = {
              ...finalCol,
              onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
              }),
            };
          }
          if (col.searchable) {
            finalCol = {
              ...finalCol,
              ...getColumnSearchProps(
                col.dataIndex,
                col.render,
                col.isObj ? {} : { [col.dataIndex]: "" }
              ),
            };
          }
          if (
            campaign?.deliverable?.includes("YT") &&
            col.dataIndex === "followers"
          ) {
            finalCol = {
              ...finalCol,
              title: "Subscribers",
              render: (text, record) => (
                <span>
                  {KMBFormatter(record?.youtube?.subscribers) || "NA"}
                </span>
              ),
            };
          }
          return finalCol;
        }),
      ]);
    }

    setLoading(false);
  }, [columns, data]);

  const handleSave = async (row) => {
    setLoading(true);
    console.log("----------------------------------------------------");
    console.log({ data, row });
    // const dat = JSON.parse(sessionStorage.getItem("data"));
    const newData = [...data];
    const index = newData.findIndex((item) => row._id === item._id);
    let item = newData[index];
    let newItem = newData[index];
    console.log({ newData, index, item, row });

    if (row.dataIndex?.toLowerCase()?.includes("commercial")) {
      newItem = {
        ...newItem,
        [row.dataIndex]: parseInt(
          replaceCommaAndSpaceWithEmptyString(row[row.dataIndex])
        ),
      };

      newData.splice(index, 1, { ...item, ...newItem });
      setData(newData);
      if (setModifiedArtists) {
        setModifiedArtists((prev) => ({ ...prev, [row._id]: newItem }));
      }
      setLoading(false);
      return;
    }

    switch (row.dataIndex) {
      case "languages":
        newItem = {
          ...item,
          languages: checkAndSplitStrToArray("languages", row),
        };
        break;
      case "categories":
        newItem = {
          ...item,
          categories: checkAndSplitStrToArray("categories", row),
        };
        break;
      case "deliverableLink": {
        if (item?.deliverableLink !== row?.deliverableLink) {
          setLoading(true);
          const ytId = getYoutubeId(row.deliverableLink);
          if (!ytId) return showAlert("error", `Invalid Youtube Link`);
          const ytData = await API_ALL().get(`/youtube/getLikes`, {
            params: {
              videoId: ytId["1"],
            },
          });
          newItem = row;
          newItem.views = ytData.data.views;
          newItem.comments = ytData.data.comments;
          newItem.roi = getROI(newItem);
        }
        break;
      }
      default:
        newItem = { ...newItem, ...row };
        break;
    }

    // Change data in newData array
    newData.splice(index, 1, { ...item, ...newItem });
    // check if seaprate state for modified artists is passed
    // set that state with new data
    if (setModifiedArtists) {
      setModifiedArtists((prev) => ({ ...prev, [row._id]: newItem }));
    }
    setData(newData);
    setLoading(false);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Table
      className={styles.customTable}
      columns={cols}
      dataSource={data}
      rowClassName={() => "editable-row"}
      rowSelection={isSelectable ? rowSelection : null}
      components={components}
      // selectedRowKeys={selectedRowKeys}
      pagination={{
        position: ["right", "bottom"],
        showSizeChanger: true,
        size: "small",
      }}
      sticky
      scroll={{
        x: width || 1500,
        y: 350,
      }}
      loading={tableLoading ?? loading}
      // exportableProps={{ showColumnPicker: true }}
    />
  );
};

export default CustomTable;
