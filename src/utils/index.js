import { message } from "antd";

export function KMBFormatter(num) {
  if (num > 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num > 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num;
  }
}

export function showAlert(type, msg) {
  switch (type) {
    case "success":
      message.success(msg);
      break;
    case "error":
      message.error(msg);
      break;
    default:
      message.success(msg);
      break;
  }
}

export function getYoutubeId(url) {
  return /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.exec(
    url
  );
}

export function campaignsOfLastMonth(campaigns) {
  let lastMonth = [];
  let today = new Date();
  let lastMonthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  for (let i = 0; i < campaigns.length; i++) {
    let campaign = campaigns[i];
    let startDate = new Date(campaign.createdAt);
    if (startDate >= lastMonthStart && startDate <= today) {
      lastMonth.push(campaign);
    }
  }
  return lastMonth;
}

export function campaignsOfLast7Days(campaigns) {
  let last7Days = [];
  let today = new Date();
  let last7DaysStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  for (let i = 0; i < campaigns.length; i++) {
    let campaign = campaigns[i];
    let startDate = new Date(campaign.createdAt);
    if (startDate >= last7DaysStart && startDate <= today) {
      last7Days.push(campaign);
    }
  }
  return last7Days;
}

export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export function getCommercial(deliverable, record) {
  let del = deliverable || record.deliverable;
  switch (del) {
    case "YTVideo":
    case "YTShorts":
      return parseInt(record.youtube?.commercial) || 0;
    case "IGStatic":
    case "IGReel":
    case "IGVideo":
      return parseInt(record.instagram?.reelCommercial) || 0;
    case "IGStory":
      return parseInt(record.instagram?.storyCommercial) || 0;
    default:
      return 0;
  }
}

export function getROI(item, brandCommercial) {
  if (item.roi && item.roi !== "NA" && item.roi !== "NaN") {
    return parseInt(item.roi) || 0;
  }

  let calValue =
    item.views && item.comments
      ? parseInt(brandCommercial || item.brandCommercial) /
          (parseInt(item.views) + parseInt(item.comments)) || "NA"
      : "NA";

  return calValue !== "NA" ? calValue.toFixed(2) : calValue;
}

export function formatIndianCurrency(amount) {
  return (
    amount?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) || 0
  );
}
