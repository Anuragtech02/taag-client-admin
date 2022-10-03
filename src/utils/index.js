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
    case "warning":
      message.warning(msg);
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
      return (
        parseInt(record.commercialCreatorYT || record.youtube?.commercial) || 0
      );
    case "IGStatic":
    case "IGReel":
    case "IGVideo":
      return (
        parseInt(
          record.commercialCreatoIGReel || record.instagram?.reelCommercial
        ) || 0
      );
    case "IGStory":
      return (
        parseInt(
          record.commercialCreatoIGStory || record.instagram?.storyCommercial
        ) || 0
      );
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

export function getCPVBrand(item, brandCommercial, deliverable) {
  let views = 0;

  switch (deliverable) {
    case "YTVideo":
    case "YTShorts":
      views = parseInt(item.youtube?.averageViews) || 0;
      break;
    case "IGStatic":
    case "IGReel":
    case "IGVideo":
      views = parseInt(item.instagram?.averageViews) || 0;
      break;
    case "IGStory":
      views = parseInt(item.instagram?.averageViews) || 0;
      break;
    default:
      views = 0;
  }

  let finalValue = (parseInt(brandCommercial) / parseInt(views) || 0).toFixed(
    2
  );

  // Let it be double equals (==)
  return finalValue == Infinity ? "NA" : finalValue;
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

// instagramLink: artist.instagram?.link || "NA",
// youtubeLink: artist.youtube?.link || "NA",
// ytSubscribers: artist.youtube?.subscribers || "NA",
// igFollowers: artist.instagram?.followers || "NA",
// averageViewsYT: artist.youtube?.averageViews || "NA",
// averageViewsIG: artist.instagram?.averageViews || "NA",
// commercialCreatorYT: artist.youtube?.commercial,
// commercialCreatorIGReel: artist.instagram?.reelCommercial,
// commercialCreatorIGStory: artist.instagram?.storyCommercial,

export function getDBArtistObj(modifiedArtist) {
  return {
    _id: modifiedArtist._id,
    name: modifiedArtist.name,
    categories: modifiedArtist.categories,
    languages: modifiedArtist.languages,
    type: modifiedArtist.type,
    youtube: {
      subscribers: modifiedArtist.youtube?.subscribers,
      link: modifiedArtist.youtube?.link,
      commercial: modifiedArtist.commercialCreatorYT,
      averageViews: modifiedArtist.youtube?.averageViews,
    },
    instagram: {
      followers: modifiedArtist.instagram?.followers,
      link: modifiedArtist.instagram?.link,
      reelCommercial: modifiedArtist.commercialCreatorIGReel,
      storyCommercial: modifiedArtist.commercialCreatorIGStory,
      averageViews: modifiedArtist.instagram?.averageViews,
    },
    gender: modifiedArtist.gender,
    location: modifiedArtist.location,
    agencyName: modifiedArtist.agencyName,
    manager: modifiedArtist.manager,
    contact: modifiedArtist.contact,
    email: modifiedArtist.email?.trim(),
    createdAt: modifiedArtist.createdAt,
    updatedAt: modifiedArtist.updatedAt,
    uploadedBy: modifiedArtist.uploadedBy,
  };
}

export function replaceCommaAndSpaceWithEmptyString(str) {
  return typeof str === typeof ""
    ? str.replace(/ /g, "").replace(/,/g, "")
    : str;
}

export function checkAndSplitStrToArray(dataIndex, item) {
  return Array.isArray(item[dataIndex])
    ? item[dataIndex]
    : item[dataIndex]?.split(",").map((item) => item.trim());
}
