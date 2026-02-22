import { state } from "./state.js";
import { fetchWeather } from "./engine.js";
import { render } from "./ui.js";

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const toggleBtn = document.getElementById("toggleUnit");

function parseLocation() {
  const params = new URLSearchParams(window.location.search);
  const pathCity = window.location.pathname.split("/").pop();
  return params.get("city") || (pathCity !== "Weather" ? pathCity : null) || "Tokyo";
}

async function load(city) {
  try {
    state.city = city;
    state.data = await fetchWeather(city);
    render(state);
    history.replaceState(null, "", `?city=${city}`);
  } catch (err) {
    console.error("Failed to load weather:", err);
  }
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim()) {
    load(cityInput.value.trim());
  }
});

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && cityInput.value.trim()) {
    load(cityInput.value.trim());
  }
});

toggleBtn.addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  render(state);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

load(parseLocation());