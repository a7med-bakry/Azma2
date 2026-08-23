const KEY = "azama_v1_data";

/* =========================
   DATA
========================= */

let data;

try {
  data = JSON.parse(localStorage.getItem(KEY) || "null");
} catch (error) {
  data = null;
}

if (!data || typeof data !== "object") {
  data = {
    accounts: [],
    channels: [],
    videos: []
  };
}

data.accounts = Array.isArray(data.accounts) ? data.accounts : [];
data.channels = Array.isArray(data.channels) ? data.channels : [];
data.videos = Array.isArray(data.videos) ? data.videos : [];

let state = {
  view: "dashboard",
  accountId: null,
  channelId: null
};

/* =========================
   HELPERS
========================= */

function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function id() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

function currentMonth() {
  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
}

function money(value) {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value) || 0) + " $"
  );
}

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
  );
}

function toast(message) {
  const element = document.getElementById("toast");

  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 1800);
}

function accountBy(accountId) {
  return data.accounts.find(
    account => account.id === accountId
  );
}

function channelBy(channelId) {
  return data.channels.find(
    channel => channel.id === channelId
  );
}

function videoBy(videoId) {
  return data.videos.find(
    video => video.id === videoId
  );
}

function accountChannels(accountId) {
  return data.channels.filter(
    channel => channel.accountId === accountId
  );
}

function channelVideos(channelId) {
  return data.videos.filter(
    video => video.channelId === channelId
  );
}

/* =========================
   PROFIT SYSTEM
   ACCEPTED ONLY
========================= */

function videoCountsForProfit(video) {
  return video.status === "accepted";
}

function videoProfit(video) {
  if (!videoCountsForProfit(video)) {
    return 0;
  }

  return Number(video.profit) || 0;
}

function channelProfit(channelId) {
  return channelVideos(channelId).reduce(
    (total, video) => total + videoProfit(video),
    0
  );
}

function
