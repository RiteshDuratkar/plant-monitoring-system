// ==========================
// ✨ TYPING EFFECT
// ==========================
const text = ["IoT Automation", "Smart Irrigation", "Real-time Monitoring"];
let i = 0, j = 0;

function typingEffect() {
  const typing = document.getElementById("typing");
  if (!typing) return;

  if (j < text[i].length) {
    typing.innerHTML += text[i].charAt(j);
    j++;
    setTimeout(typingEffect, 50);
  } else {
    setTimeout(() => {
      typing.innerHTML = "";
      j = 0;
      i = (i + 1) % text.length;
      typingEffect();
    }, 1500);
  }
}

typingEffect();


// ==========================
// 🚀 FEATURE TABS SYSTEM
// ==========================
const featureData = [
  {
    title: "Smart Automation",
    text: "Automatically control irrigation based on real-time soil moisture levels to save water and improve plant health.",
    img: "assets/feature1.png",
    link: "#features"
  },
  {
    title: "Live Monitoring",
    text: "Monitor temperature, humidity, soil moisture, and light levels in real-time from anywhere.",
    img: "assets/feature2.png",
    link: "#dashboard"
  },
  {
    title: "Smart Scheduling",
    text: "Set custom watering schedules to ensure plants receive optimal care without manual effort.",
    img: "assets/feature3.png",
    link: "#schedule"
  },
  {
    title: "Data Analytics",
    text: "Analyze plant health trends and performance insights to make better farming decisions.",
    img: "assets/feature4.png",
    link: "#dashboard"
  },
  {
    title: "Remote Access",
    text: "Control your entire system from anywhere in the world using a simple and intuitive interface.",
    img: "assets/feature5.png",
    link: "#home"
  }
];

function switchTab(index) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.classList.remove("active"));
  tabs[index].classList.add("active");

  const data = featureData[index];
  const box = document.querySelector(".feature-box");

  if (!box) return;

  // Fade animation
  box.style.opacity = 0;
  box.style.transform = "translateY(10px)";

  setTimeout(() => {
    document.getElementById("feature-heading").innerText = data.title;
    document.getElementById("feature-text").innerText = data.text;
    document.getElementById("feature-image").src = data.img;

    document.getElementById("learn-btn").onclick = () => {
      window.location.href = data.link;
    };

    box.style.opacity = 1;
    box.style.transform = "translateY(0)";
  }, 200);
}


// ==========================
// 🎛 MODE BUTTON ACTIVE UI
// ==========================
function setMode(mode) {
  if (typeof db !== "undefined") {
    db.ref("control/mode").set(mode);
  }

  document.querySelectorAll(".mode-select button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}


// ==========================
// 🎨 SMOOTH SCROLL (NAV)
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// ==========================
// ✨ SMALL UI ANIMATIONS
// ==========================

// Card hover lift effect
document.querySelectorAll(".big-card, .small-card, .top-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});


// ==========================
// 🌱 OPTIONAL: AUTO TAB SWITCH (PREMIUM TOUCH)
// ==========================
// Uncomment if you want auto feature rotation


let autoIndex = 0;
setInterval(() => {
  autoIndex = (autoIndex + 1) % featureData.length;
  switchTab(autoIndex);
}, 5000);


function saveSchedule() {
  const hour = document.getElementById("hour").value;
  const minute = document.getElementById("minute").value;
  const duration = document.getElementById("duration").value;
  const enabled = document.getElementById("scheduleToggle").checked;

  if (!hour || !minute || !duration) {
    alert("Please fill all fields");
    return;
  }

  db.ref("schedule").set({
    time: `${hour}:${minute}`,
    duration: Number(duration),
    enabled: enabled
  });

  alert("Schedule Saved ✅");
}

db.ref("schedule").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const status = document.getElementById("scheduleStatus");
  const toggle = document.getElementById("scheduleToggle");

  if (data.enabled) {
    status.innerText = "Enabled 🟢";
    status.className = "badge on";
    toggle.checked = true;
  } else {
    status.innerText = "Disabled 🔴";
    status.className = "badge off";
    toggle.checked = false;
  }
});

// ==========================
// ⚡ SYSTEM STATUS (FINAL FIX)
// ⚡ SYSTEM STATUS (FINAL CLEAN)
// ==========================
db.ref("system").on("value", (snapshot) => {
  const data = snapshot.val();

  console.log("SYSTEM:", data);

  if (!data) return;

  const img = document.getElementById("systemImage");
  const msg = document.getElementById("systemMessage");
  const card = document.querySelector(".system-card");

  // 🔥 STOP if elements not found
  if (!img || !msg || !card) {
    console.error("System elements missing in HTML");
    return;
  }

  // ✅ UNIVERSAL FIX
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