const config = window.PRAY_CONFIG;

const praytime = new PrayTime(config.method);

praytime
  .location([config.latitude, config.longitude])
  .format(config.format);

const times = praytime.times(new Date());

// Meta info
document.getElementById("meta").textContent =
  `Method: ${config.method} | Location: ${config.latitude}, ${config.longitude}`;

// Render table
const table = document.getElementById("times");

for (const [name, time] of Object.entries(times)) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = name;

  const timeCell = document.createElement("td");
  timeCell.textContent = time;

  row.appendChild(nameCell);
  row.appendChild(timeCell);
  table.appendChild(row);
}

function getPrayerTimestamps(times) {
  const result = [];
  const now = Date.now();

  for (const [name, timeStr] of Object.entries(times)) {
    if (timeStr === "-----") continue;

    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    let ts = date.getTime();

    // if time already passed today, assume tomorrow
    if (ts <= now) {
      ts += 24 * 60 * 60 * 1000;
    }

    result.push({ name, ts });
  }

  return result.sort((a, b) => a.ts - b.ts);
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const countdownEl = document.getElementById("countdown");
const prayerSchedule = getPrayerTimestamps(times);

function updateCountdown() {
  const now = Date.now();
  const next = prayerSchedule.find(p => p.ts > now);

  if (!next) return;

  const diff = next.ts - now;
  countdownEl.textContent =
    `Next prayer: ${next.name} in ${formatDuration(diff)}`;
}

updateCountdown();
setInterval(updateCountdown, 1000);
