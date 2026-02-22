let controller;

export async function fetchWeather(city) {
  const cacheKey = "weather_" + city;
  const cached = localStorage.getItem(cacheKey);

  // ✅ Gunakan cache jika belum 15 menit
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.time < 900000) {
      return parsed.data;
    }
  }

  // ✅ Batalkan request sebelumnya jika ada
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const res = await fetch(`https://wttr.in/${city}?format=j1`, {
      signal: controller.signal
    });

    if (!res.ok) throw new Error("Network error");

    const data = await res.json();

    // ✅ Simpan ke cache
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        time: Date.now(),
        data
      })
    );

    return data;

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request dibatalkan");
      return;
    }
    throw err;
  }
}