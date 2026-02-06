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
