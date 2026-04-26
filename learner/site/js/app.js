const current = document.body.dataset.page;
if (current) {
  const link = document.querySelector(`[data-page-link="${current}"]`);
  if (link) link.classList.add("active");
}

const storageKey = `mjue-${current}`;

const darkToggle = document.querySelector("[data-dark-toggle]");
const isDark = localStorage.getItem("mjue-dark") === "true";
if (isDark) document.body.classList.add("dark");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("mjue-dark", document.body.classList.contains("dark"));
  });
}

const searchInput = document.querySelector("[data-search]");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll("main .card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle("hidden", query && !text.includes(query));
    });
  });
}

const progressFill = document.querySelector("[data-progress-fill]");
const checkboxes = document.querySelectorAll("[data-progress-item]");

function loadProgress() {
  const data = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
  checkboxes.forEach((box) => {
    const id = box.dataset.progressItem;
    box.checked = Boolean(data[id]);
  });
}

function updateProgress() {
  const total = checkboxes.length || 1;
  const done = Array.from(checkboxes).filter((b) => b.checked).length;
  const percent = Math.round((done / total) * 100);
  if (progressFill) progressFill.style.width = `${percent}%`;

  const data = {};
  checkboxes.forEach((box) => {
    data[box.dataset.progressItem] = box.checked;
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

if (checkboxes.length) {
  loadProgress();
  updateProgress();
  checkboxes.forEach((box) => box.addEventListener("change", updateProgress));
}

const bookmarkButtons = document.querySelectorAll("[data-bookmark]");
function loadBookmarks() {
  const saved = JSON.parse(localStorage.getItem(`${storageKey}-bookmarks`) || "[]");
  bookmarkButtons.forEach((btn) => {
    const id = btn.dataset.bookmark;
    btn.classList.toggle("active", saved.includes(id));
  });
}

function saveBookmarks() {
  const saved = Array.from(bookmarkButtons)
    .filter((btn) => btn.classList.contains("active"))
    .map((btn) => btn.dataset.bookmark);
  localStorage.setItem(`${storageKey}-bookmarks`, JSON.stringify(saved));
}

bookmarkButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    saveBookmarks();
  });
});
if (bookmarkButtons.length) loadBookmarks();

const notesBtn = document.querySelector("[data-notes-download]");
if (notesBtn) {
  notesBtn.addEventListener("click", () => {
    const title = document.querySelector("h1")?.textContent || "Notes";
    const notes = Array.from(document.querySelectorAll("main .card"))
      .map((card) => card.textContent.trim().replace(/\s+/g, " "))
      .join("\n\n");

    const blob = new Blob([`${title}\n\n${notes}`], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-notes.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
}
