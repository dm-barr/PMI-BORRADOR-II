const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const menu = $("#menu");
    const ham = $("#hamburger");
    if (menu?.classList.contains("open")) {
      menu.classList.remove("open");
      menu.style.display = "";
      ham?.setAttribute("aria-expanded", "false");
    }
  });
});

const hamburger = $("#hamburger"),
  menu = $("#menu");
hamburger?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menu.style.display = isOpen ? "block" : "";
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

const progressBar = $("#progressBar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progressBar.style.width = scrolled * 100 + "%";
});

const sections = [
  ...document.querySelectorAll("main section[id], section#inicio"),
];
const secObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`.menu a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) link.classList.add("active");
      else link.classList.remove("active");
    });
  },
  { threshold: 0.55 }
);
sections.forEach((s) => secObs.observe(s));

// FUNCIÓN PARA LANZAR CONFETI DESDE LOS LATERALES
function launchConfetti() {
  const duration = 8 * 1000; // 5 segundos de confeti
  const end = Date.now() + duration;
  const colors = ['#3FC0F0', '#FF610F', '#4F17A8'];

  (function frame() {
    // Confeti desde el lado izquierdo
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors
    });
    
    // Confeti desde el lado derecho
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// FUNCIÓN COUNTDOWN CON CONFETI
(function countdown() {
  const target = new Date("2025-11-07T16:00:00-05:00").getTime();
  const d = $("#d"),
    h = $("#h"),
    m = $("#m"),
    sec = $("#s");
  
  let confettiLaunched = false; // Bandera para ejecutar confeti solo una vez

  const tick = () => {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const dd = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= dd * 86400000;
    const hh = Math.floor(diff / (1000 * 60 * 60));
    diff -= hh * 3600000;
    const mm = Math.floor(diff / (1000 * 60));
    diff -= mm * 60000;
    const ss = Math.floor(diff / 1000);
    
    d.textContent = String(dd).padStart(2, "0");
    h.textContent = String(hh).padStart(2, "0");
    m.textContent = String(mm).padStart(2, "0");
    sec.textContent = String(ss).padStart(2, "0");

    // Lanzar confeti cuando llegue a 0
    if (dd === 0 && hh === 0 && mm === 0 && ss === 0 && !confettiLaunched) {
      confettiLaunched = true;
      launchConfetti();
    }
  };
  
  tick();
  setInterval(tick, 1000);
})();

const counters = document.querySelectorAll("[data-count]");
let counted = false;
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach((el) => {
          const end = parseInt(el.dataset.count, 10);
          const start = 0,
            dur = 1100;
          const t0 = performance.now();
          function step(t) {
            const p = Math.min((t - t0) / dur, 1);
            el.textContent = Math.floor(
              start + (end - start) * (0.5 - Math.cos(Math.PI * p) / 2)
            );
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
        countObs.disconnect();
      }
    });
  },
  { threshold: 0.4 }
);
counters.forEach((c) => countObs.observe(c));

const tabs = $$(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document
      .querySelectorAll(".tabpanes")
      .forEach((p) => p.classList.remove("active"));
    const pane = document.getElementById(tab.getAttribute("aria-controls"));
    pane?.classList.add("active");
  })
);

const agendaSearch = $("#agendaSearch");
const agendaType = $("#agendaType");
function filterAgenda() {
  const q = (agendaSearch.value || "").toLowerCase();
  const t = agendaType.value;
  ["#listDia1", "#listDia2"].forEach((sel) => {
    document.querySelectorAll(sel + " li").forEach((li) => {
      const text = li.textContent.toLowerCase();
      const type = li.dataset.type || "";
      const match = (!q || text.includes(q)) && (!t || type === t);
      li.style.display = match ? "" : "none";
    });
  });
}
agendaSearch?.addEventListener("input", filterAgenda);
agendaType?.addEventListener("change", filterAgenda);

$("#btnIcs")?.addEventListener("click", (e) => {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PM Tour Norte//ES",
    "BEGIN:VEVENT",
    "DTSTART:20251107T140000Z",
    "DTEND:20251107T230000Z",
    "SUMMARY:PM Tour Norte 2025 - Día 1",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "DTSTART:20251108T140000Z",
    "DTEND:20251108T230000Z",
    "SUMMARY:PM Tour Norte 2025 - Día 2",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([content], { type: "text/calendar" });
  e.target.href = URL.createObjectURL(blob);
});

const modal = document.getElementById("modal"),
  modalBody = document.getElementById("modalBody"),
  modalClose = document.getElementById("modalClose");

document.querySelectorAll(".speaker__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name,
      bio = btn.dataset.bio,
      tags = btn.dataset.tags,
      linkedin = btn.dataset.linkedin;
    const msg = linkedin
      ? `<a href="${linkedin}" target="_blank" rel="noopener" class="modal__linkedin">Visitar LinkedIn →</a>`
      : "";
    modalBody.innerHTML = `<h2>${name}</h2><p class="modal__tags">${tags}</p><p class="modal__bio">${bio}</p>${msg}`;
    modal.showModal();
  });
});

modalClose?.addEventListener("click", () => modal.close());
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

$("#form-news")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.website?.value) return;
  const email = form.newsEmail?.value || "";
  const msg = $("#newsMsg");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    msg.textContent = "Correo no válido";
    return;
  }
  msg.textContent = "¡Gracias! Revisa tu bandeja de entrada.";
  form.reset();
  openConfirm("Te suscribiste al boletín.");
});

const regForm = $("#form-registro"),
  regMsg = $("#form-msg");
regForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(regForm);
  if (regForm.empresa?.value) return;
  const req = ["nombre", "email", "plan", "tyc"];
  for (const r of req) {
    if (r === "tyc" && !regForm.querySelector('input[name="tyc"]').checked) {
      regMsg.textContent = "Debes aceptar los Términos y Políticas.";
      return;
    }
    if (!f.get(r)) {
      regMsg.textContent = "Por favor completa los campos obligatorios.";
      return;
    }
  }
  regMsg.textContent = "¡Registro enviado! Te contactaremos por email.";
  regMsg.style.color = "#79E0FF";
  regForm.reset();
  openConfirm("Tu registro fue enviado. Recibirás confirmación por correo.");
});

(function cookies() {
  const box = $("#cookies");
  if (!box) return;
  if (localStorage.getItem("cookies-consent")) return;
  box.style.display = "block";
  $("#cookiesAccept").addEventListener("click", () => {
    localStorage.setItem("cookies-consent", "accepted");
    box.remove();
  });
  $("#cookiesDecline").addEventListener("click", () => {
    localStorage.setItem("cookies-consent", "declined");
    box.remove();
  });
})();

lucide.createIcons();

const btnBrochure = $("#btnVerBrochure");

function openModalWithPDF(pdfUrl, title = "Brochure Oficial") {
  modalBody.innerHTML = `<h2>${title}</h2><iframe src="${pdfUrl}" style="width:100%;height:70vh;border:none;border-radius:8px;"></iframe><p style="margin-top:1rem;font-size:0.9rem;color:#aaa;">Para descargar, usa el botón de descarga del navegador.</p>`;
  modal.showModal();
}

btnBrochure?.addEventListener("click", () => {
  openModalWithPDF("brochure.pdf", "Brochure PM Tour Norte 2025");
});

function openConfirm(message) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-box";
  confirmBox.textContent = message;
  document.body.appendChild(confirmBox);
  setTimeout(() => confirmBox.classList.add("show"), 10);
  setTimeout(() => {
    confirmBox.classList.remove("show");
    setTimeout(() => confirmBox.remove(), 300);
  }, 3000);
}
