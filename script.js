async function loadVideos() {
  const res = await fetch("data.json");
  const data = await res.json();
  const search = document.getElementById("search").value.toLowerCase();
  const container = document.getElementById("videoList");
  container.innerHTML = "";

  data.filter(v => v.title.toLowerCase().includes(search)).forEach((video, index) => {
    const likes = localStorage.getItem("likes_" + index) || video.likes;
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${video.title}</h3>
      <video src="${video.url}" controls></video>
      <p>Likes: <span id="like${index}">${likes}</span>
      <button onclick="like(${index})">Like</button></p>
    `;
    container.appendChild(div);
  });
}

function like(index) {
  const span = document.getElementById("like" + index);
  const newLikes = parseInt(span.textContent) + 1;
  span.textContent = newLikes;
  localStorage.setItem("likes_" + index, newLikes);
}

document.getElementById("search").addEventListener("input", loadVideos);

// Obsługa uploadu z limitem czasu
const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadMsg = document.getElementById("uploadMessage");

const LIMIT_MS = 20 * 60 * 1000; // 20 minut

function canUpload() {
  const last = parseInt(localStorage.getItem("lastUpload")) || 0;
  return Date.now() - last > LIMIT_MS;
}

function updateUploadState() {
  if (canUpload()) {
    uploadBtn.disabled = false;
    uploadMsg.textContent = "";
  } else {
    uploadBtn.disabled = true;
    const wait = Math.ceil((LIMIT_MS - (Date.now() - parseInt(localStorage.getItem("lastUpload")))) / 60000);
    uploadMsg.textContent = `Poczekaj ${wait} min przed dodaniem kolejnego filmu.`;
  }
}

uploadBtn.addEventListener("click", () => {
  if (!uploadInput.files.length) return alert("Wybierz plik video.");

  if (!canUpload()) return;

  const file = uploadInput.files[0];
  alert(`(Symulacja) Film "${file.name}" został dodany!`);
  localStorage.setItem("lastUpload", Date.now());
  updateUploadState();
});

updateUploadState();
loadVideos();
