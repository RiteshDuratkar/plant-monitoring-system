// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBmD2ihuaLcZvbJbErqq7AeeLJsrYIYJg0",
  databaseURL: "https://plantmonitoringsystem-a3122-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// INIT
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


// ==========================
// 🌱 PLANT DATA
// ==========================
db.ref("plant").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const moisture = document.getElementById("moisture");
  const temp = document.getElementById("temp");
  const humidity = document.getElementById("humidity");
  const soilTemp = document.getElementById("soilTemp");

  if (moisture) moisture.innerText = data.moisture ?? "--";
  if (temp) temp.innerText = (data.temperature ?? "--") + "°C";
  if (humidity) humidity.innerText = (data.humidity ?? "--") + "%";
  if (soilTemp) soilTemp.innerText = (data.soilTemp ?? "--") + "°C";
});


// ==========================
// 🎛 CONTROL DATA
// ==========================
db.ref("control").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const mode = document.getElementById("mode");
  const pump = document.getElementById("pumpStatus");
  const light = document.getElementById("lightStatus");
  const modeSelect = document.getElementById("modeSelect");

  if (mode) mode.innerText = data.mode ?? "--";

  if (pump) {
    pump.innerText = data.pump == 1 ? "ON 🟢" : "OFF 🔴";
    pump.className = data.pump == 1 ? "badge on" : "badge off";
  }

  if (light) {
    light.innerText = data.light == 1 ? "ON 🟢" : "OFF 🔴";
    light.className = data.light == 1 ? "badge on" : "badge off";
  }

  if (modeSelect) modeSelect.value = data.mode;
});


// ==========================
// ⚡ SYSTEM STATUS (FIXED 🔥)
// ==========================
db.ref("system").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  console.log("SYSTEM:", data);

  const img = document.getElementById("systemImage");
  const msg = document.getElementById("systemMessage");
  const card = document.querySelector(".system-card");

  // 🔥 STOP if elements missing
  if (!img || !msg || !card) {
    console.error("System UI elements not found");
    return;
  }

  // ✅ UNIVERSAL LOGIC
  const isOnline = Number(data.machineOn) > 0;

  if (isOnline) {
    img.src = "assets/system-ok.png";
    msg.innerText = "System is running smoothly and all modules are active.";

    card.classList.add("system-online");
    card.classList.remove("system-offline");

  } else {
    img.src = "assets/system-error.png";
    msg.innerText = "System is currently offline. Please check device connection.";

    card.classList.add("system-offline");
    card.classList.remove("system-online");
  }
});


// ==========================
// 🎛 CONTROL FUNCTIONS
// ==========================
function togglePump() {
  const ref = db.ref("control/pump");

  ref.once("value").then((snapshot) => {
    const current = snapshot.val();
    ref.set(current == 1 ? 0 : 1);
  });
}

function toggleLight() {
  const ref = db.ref("control/light");

  ref.once("value").then((snapshot) => {
    const current = snapshot.val();
    ref.set(current == 1 ? 0 : 1);
  });
}

function changeMode() {
  const mode = document.getElementById("modeSelect")?.value;
  if (mode) db.ref("control/mode").set(mode);
}

function setMode(mode) {
  db.ref("control/mode").set(mode);
}


// ==========================
// ⏰ SCHEDULE
// ==========================
function saveSchedule() {
  const hour = document.getElementById("hour")?.value;
  const minute = document.getElementById("minute")?.value;
  const duration = document.getElementById("duration")?.value;

  if (!hour || !minute || !duration) {
    alert("Please fill all fields");
    return;
  }

  db.ref("schedule").set({
    time: `${hour}:${minute}`,
    duration: Number(duration),
    enabled: true
  });

  alert("Schedule Saved ✅");
}

// ==========================
// 📊 PREMIUM REAL-TIME CHART
// ==========================

const ctx = document.getElementById("chart");

let chart;

if (ctx) {

  // 🎨 GRADIENTS
  const gradient1 = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
  gradient1.addColorStop(0, "rgba(76,175,80,0.4)");
  gradient1.addColorStop(1, "rgba(76,175,80,0)");

  const gradient2 = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
  gradient2.addColorStop(0, "rgba(33,150,243,0.4)");
  gradient2.addColorStop(1, "rgba(33,150,243,0)");

  const gradient3 = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
  gradient3.addColorStop(0, "rgba(255,193,7,0.4)");
  gradient3.addColorStop(1, "rgba(255,193,7,0)");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Moisture",
          data: [],
          borderColor: "#4caf50",
          backgroundColor: gradient1,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: "Temperature",
          data: [],
          borderColor: "#2196f3",
          backgroundColor: gradient2,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: "Humidity",
          data: [],
          borderColor: "#ffc107",
          backgroundColor: gradient3,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: "#333",
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: "#111",
          titleColor: "#fff",
          bodyColor: "#ddd",
          padding: 10,
          borderRadius: 10
        }
      },

      scales: {
        x: {
          display: false
        },
        y: {
          grid: {
            color: "rgba(0,0,0,0.05)"
          }
        }
      }
    }
  });
}


// 🔥 LIVE UPDATE
db.ref("plant").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || !chart) return;

  const time = new Date().toLocaleTimeString();

  // LIMIT DATA
  if (chart.data.labels.length > 12) {
    chart.data.labels.shift();
    chart.data.datasets.forEach(ds => ds.data.shift());
  }

  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(data.moisture);
  chart.data.datasets[1].data.push(data.temperature);
  chart.data.datasets[2].data.push(data.humidity);

  chart.update();
});