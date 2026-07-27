/* ═══════════════════════════════════════════════════
   CGST — Data
   👉 C'EST ICI QUE TU AJOUTES TES SUJETS
   Chaque sujet est un objet avec :
     - subject : "mathematiques" | "physique" | "svt" | "si"
     - year    : ex. "2025"
     - title   : le titre affiché sur la carte
     - type    : "sujet" | "corrige"
     - file    : le chemin vers le PDF (mets tes PDFs dans le dossier /pdfs)
═══════════════════════════════════════════════════ */

const exams = [
  {
    subject: "mathematiques",
    year: "2025",
    title: "Sujet de Mathématiques — Session 2025",
    type: "sujet",
    file: "pdfs/maths-2025-sujet.pdf"
  },
  {
    subject: "mathematiques",
    year: "2025",
    title: "Corrigé de Mathématiques — Session 2025",
    type: "corrige",
    file: "pdfs/maths-2025-corrige.pdf"
  },
  {
    subject: "physique",
    year: "2024",
    title: "Sujet de Physique-Chimie — Session 2024",
    type: "sujet",
    file: "pdfs/physique-2024-sujet.pdf"
  },
  {
    subject: "svt",
    year: "2024",
    title: "Sujet de S.V.T — Session 2024",
    type: "sujet",
    file: "pdfs/svt-2024-sujet.pdf"
  },
  {
    subject: "si",
    year: "2023",
    title: "Sujet de Sciences de l'Ingénieur — Session 2023",
    type: "sujet",
    file: "pdfs/si-2023-sujet.pdf"
  }
];

/* ═══════════════════════════════════════════════════
   State
═══════════════════════════════════════════════════ */
let currentSubject = "mathematiques";
let currentYear = "all";
let currentSearch = "";

/* ═══════════════════════════════════════════════════
   DOM refs
═══════════════════════════════════════════════════ */
const examsGrid   = document.getElementById("examsGrid");
const emptyState  = document.getElementById("emptyState");
const yearPills   = document.getElementById("yearPills");
const searchInput = document.getElementById("searchInput");
const tabs        = document.querySelectorAll(".tab");

/* ═══════════════════════════════════════════════════
   Build year pills dynamically from data
═══════════════════════════════════════════════════ */
function buildYearPills() {
  const years = [...new Set(exams.map(e => e.year))].sort().reverse();
  years.forEach(year => {
    const pill = document.createElement("button");
    pill.className = "pill";
    pill.dataset.year = year;
    pill.textContent = year;
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentYear = year;
      renderExams();
    });
    yearPills.appendChild(pill);
  });

  // "Toutes" pill (already in HTML)
  document.querySelector('.pill[data-year="all"]').addEventListener("click", (e) => {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    e.target.classList.add("active");
    currentYear = "all";
    renderExams();
  });
}

/* ═══════════════════════════════════════════════════
   Subject tabs
═══════════════════════════════════════════════════ */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentSubject = tab.dataset.subject;
    renderExams();
  });
});

/* ═══════════════════════════════════════════════════
   Search
═══════════════════════════════════════════════════ */
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.trim().toLowerCase();
  renderExams();
});

/* ═══════════════════════════════════════════════════
   Render exam cards
═══════════════════════════════════════════════════ */
function renderExams() {
  const filtered = exams.filter(e => {
    const matchSubject = e.subject === currentSubject;
    const matchYear = currentYear === "all" || e.year === currentYear;
    const matchSearch = !currentSearch || e.title.toLowerCase().includes(currentSearch);
    return matchSubject && matchYear && matchSearch;
  });

  examsGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  filtered.forEach(exam => {
    const card = document.createElement("div");
    card.className = "exam-card";
    card.dataset.subject = exam.subject;

    card.innerHTML = `
      <div class="card-header">
        <span class="card-subject-badge">${subjectLabel(exam.subject)}</span>
        <span class="card-type-badge ${exam.type}">${exam.type === "sujet" ? "Sujet" : "Corrigé"}</span>
      </div>
      <h3 class="card-title">${exam.title}</h3>
      <div class="card-meta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        Session ${exam.year}
      </div>
      <div class="card-actions">
        <button class="btn-download btn-view" data-file="${exam.file}" data-title="${exam.title}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          Voir
        </button>
        <a class="btn-download secondary" href="${exam.file}" download>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>
          </svg>
          Télécharger
        </a>
      </div>
    `;
    examsGrid.appendChild(card);
  });

  // Attach viewer click events
  document.querySelectorAll(".btn-view").forEach(btn => {
    btn.addEventListener("click", () => openPdfViewer(btn.dataset.file, btn.dataset.title));
  });
}

function subjectLabel(subject) {
  const map = {
    mathematiques: "Mathématiques",
    physique: "Physique-Chimie",
    svt: "S.V.T",
    si: "Sciences de l'Ingénieur"
  };
  return map[subject] || subject;
}

/* ═══════════════════════════════════════════════════
   PDF Viewer Modal
═══════════════════════════════════════════════════ */
const pdfOverlay   = document.getElementById("pdfOverlay");
const pdfFrame     = document.getElementById("pdfFrame");
const pdfTitle     = document.getElementById("pdfTitle");
const pdfDownload  = document.getElementById("pdfDownload");
const pdfClose     = document.getElementById("pdfClose");

function openPdfViewer(file, title) {
  pdfFrame.src = file;
  pdfTitle.textContent = title;
  pdfDownload.href = file;
  pdfOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePdfViewer() {
  pdfOverlay.hidden = true;
  pdfFrame.src = "";
  document.body.style.overflow = "";
}

pdfClose.addEventListener("click", closePdfViewer);
pdfOverlay.addEventListener("click", (e) => {
  if (e.target === pdfOverlay) closePdfViewer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !pdfOverlay.hidden) closePdfViewer();
});

/* ═══════════════════════════════════════════════════
   Footer year
═══════════════════════════════════════════════════ */
document.getElementById("footerYear").textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════
   Init
═══════════════════════════════════════════════════ */
buildYearPills();
renderExams();