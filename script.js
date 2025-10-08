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

(function countdown() {
  const target = new Date("2025-11-07T09:00:00-05:00").getTime();
  const d = $("#d"),
    h = $("#h"),
    m = $("#m"),
    s = $("#s");
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
    s.textContent = String(ss).padStart(2, "0");
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

    modalBody.innerHTML = `
      <h3 style="margin-top:0">${name}</h3>
      <p class="muted small">${tags}</p>
      <p>${bio}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <a class="chip" href="${linkedin}" target="_blank" aria-label="LinkedIn ${name}">LinkedIn</a>
      </div>
    `;

    modal.showModal();
  });
});

modalClose?.addEventListener("click", () => modal.close());
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

const currencyButtons = document.querySelectorAll(".toggle .chip");
function updatePrices(curr) {
  document.querySelectorAll(".price").forEach((card) => {
    const pen = Number(card.dataset.pen),
      usd = Number(card.dataset.usd);
    const el = card.querySelector(".money");
    el.textContent = curr === "USD" ? `S/ ${usd}` : `S/ ${pen}`;
  });
}
currencyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currencyButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updatePrices(btn.dataset.currency);
  });
});
updatePrices("PEN");

const coupons = { EARLYPM: 0.15, PMNORTE10: 0.1 };
$("#applyCoupon")?.addEventListener("click", () => {
  const code = ($("#coupon").value || "").trim().toUpperCase();
  const msg = $("#couponMsg");
  if (!code || !coupons[code]) {
    msg.textContent = "Código no válido.";
    return;
  }
  const off = coupons[code];
  document.querySelectorAll(".price").forEach((card) => {
    const curr =
      document.querySelector(".toggle .chip.active")?.dataset.currency || "PEN";
    const base =
      curr === "USD" ? Number(card.dataset.usd) : Number(card.dataset.pen);
    const newPrice = Math.round(base * (1 - off));
    card.querySelector(".money").textContent =
      curr === "USD" ? `$ ${newPrice}` : `S/ ${newPrice}`;
  });
  msg.textContent = `Descuento aplicado: ${Math.round(off * 100)}%`;
});

(function slider() {
  const slider = $("#slider");
  if (!slider) return;
  const viewport = slider.querySelector(".slider__viewport");
  const slides = slider.querySelectorAll(".slide");
  let i = 0;
  function go(n) {
    i = (n + slides.length) % slides.length;
    viewport.scrollTo({ left: viewport.clientWidth * i, behavior: "smooth" });
  }
  slider.querySelector(".prev").addEventListener("click", () => go(i - 1));
  slider.querySelector(".next").addEventListener("click", () => go(i + 1));
  window.addEventListener("resize", () => go(i));
})();

(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const layers = [
    { el: document.querySelector(".decor--1"), depth: 0.06 },
    { el: document.querySelector(".decor--2"), depth: 0.1 },
    { el: document.querySelector(".shards"), depth: 0.14 },
  ].filter((x) => x.el);
  if (prefersReduced || !layers.length) return;
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      layers.forEach(({ el, depth }) => {
        el.style.transform = `translate3d(0, ${y * depth}px, 0)`;
      });
      ticking = false;
    });
  }
  function onMove(e) {
    const cx = window.innerWidth / 2,
      cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) / cx,
      my = (e.clientY - cy) / cy;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translate3d(${mx * 8 * depth}px, ${
        my * 10 * depth
      }px, 0)`;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousemove", onMove, { passive: true });
})();

// ===== Back to top
const back = $("#backtop");
window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;
  if (y > 400) back.classList.add("show");
  else back.classList.remove("show");
});
back.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

function openConfirm(msg) {
  const modal = $("#modal");
  const body = $("#modalBody");
  body.innerHTML = `<h3 style="margin:0">¡Listo!</h3><p>${msg}</p>`;
  modal.showModal();
}
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

// Obtener elementos del DOM
const btnBrochure = $("#btnVerBrochure");

// 1. Función para abrir el modal (similar a la que ya tienes)
function openModalWithPDF(pdfUrl, title = "Brochure Oficial") {
  // Contenido HTML del visor de PDF
  modalBody.innerHTML = `
    <div class="pdf-viewer-container">
      <h3>${title}</h3>
      <iframe 
        src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0"
        width="100%" 
        height="100%" 
        style="border: none;"
        title="${title}"
      ></iframe>
      <p class="muted center tiny mt-8">Para descargar, usa el botón de descarga del navegador.</p>
    </div>
  `;
  modal.showModal();
}

// 2. Lógica para abrir el PDF cuando se hace clic en el botón
btnBrochure?.addEventListener("click", () => {
  // Asegúrate de cambiar 'brochure.pdf' por la ruta real de tu archivo
  openModalWithPDF("brochure.pdf");
});

// 3. Lógica para cerrar el modal (si no está ya implementada globalmente para el botón)
modalClose?.addEventListener("click", () => {
  modal.close();
  modalBody.innerHTML = ""; // Limpiar el contenido al cerrar
});

// Detectar si el usuario está en un dispositivo móvil
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const pdfContainer = document.getElementById("pdfContainer");

if (isMobile && pdfContainer) {
  // Reemplazar el iframe por un botón en móviles
  pdfContainer.innerHTML = `
      <div class="mobile-pdf-fallback">
        <p class="center">
          📄 No se puede visualizar el brochure directamente en tu dispositivo.<br>
          <a href="https://drive.google.com/file/d/18nIshhnc9w8Lp74a5a07h7nwOUTtYEgo/view" 
             target="_blank" 
             class="btn btn-pill btn-lg mt-16">
            Ver Brochure en una nueva pestaña
          </a>
        </p>
      </div>
    `;
}
