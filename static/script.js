let duckNames = [];
let ducks = [];
let raceArea = null;
let raceIntervals = [];

function createNameInputs() {
  const count = parseInt(document.getElementById("duckCount").value);
  const container = document.getElementById("nameInputs");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Tên vịt ${i + 1}`;
    input.id = `duckName${i}`;
    container.appendChild(input);
  }
}

function setupRace() {
  const count = parseInt(document.getElementById("duckCount").value);
  duckNames = [];
  raceArea = document.getElementById("raceArea");
  raceArea.innerHTML = "";
  raceIntervals = [];

  for (let i = 0; i < count; i++) {
    const nameInput = document.getElementById(`duckName${i}`);
    const name = nameInput && nameInput.value.trim() !== "" ? nameInput.value.trim() : `Vịt ${i + 1}`;
    duckNames.push(name);

    const track = document.createElement("div");
    track.className = "track";

    const duck = document.createElement("div");
    duck.className = "duck";
    duck.id = `duck${i}`;
    duck.innerText = `🦆 ${name}`;

    track.appendChild(duck);
    raceArea.appendChild(track);
  }

  loadScores();
}

function startRace() {
  document.getElementById("winner").innerText = "";
  const tracks = document.querySelectorAll(".track");
  ducks = Array.from(tracks).map((track) => track.querySelector(".duck"));
  const trackWidth = tracks[0].clientWidth;
  let finished = false;

  ducks.forEach((duck, i) => {
    duck.style.left = "0px";
    const interval = setInterval(() => {
      let currentLeft = parseFloat(duck.style.left) || 0;
      let move = Math.random() * 10;
      duck.style.left = (currentLeft + move) + "px";

      if (Math.random() < 0.1) showCheer(duckNames[i]);

      if (!finished && currentLeft + move >= trackWidth - 100) {
        finished = true;
        stopAllDucks();

        const winnerName = duckNames[i];
        document.getElementById("winner").innerText = `🏆 Vịt thắng cuộc: ${winnerName}!`;
        saveScore(winnerName);

        Swal.fire({
          title: '🎉 Chiến thắng!',
          text: `Vịt ${winnerName} đã về đích đầu tiên!`,
          icon: 'success',
          confirmButtonText: '👏 Hay quá!',
          backdrop: `
            rgba(0,0,123,0.3)
            url("https://media.giphy.com/media/fxsqOYnIMEefC/giphy.gif")
            left top
            no-repeat
          `
        });
      }
    }, 100);
    raceIntervals.push(interval);
  });
}

function stopAllDucks() {
  raceIntervals.forEach(clearInterval);
  raceIntervals = [];
}

function saveScore(winnerName) {
  fetch("/save_score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ winner: winnerName })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) loadScores();
    });
}

function loadScores() {
  fetch("/get_scores")
    .then(res => res.json())
    .then(scores => {
      const scoreBoard = document.getElementById("scoreBoard");
      scoreBoard.innerHTML = "";
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score}`;
        scoreBoard.appendChild(li);
      });
    });
}

function showCheer(name) {
  const cheerEl = document.getElementById("cheer");
  cheerEl.innerText = `💬 Cố lên ${name}!!!`;
  cheerEl.style.display = "block";
  cheerEl.style.opacity = 1;

  setTimeout(() => {
    cheerEl.style.display = "none";
  }, 3000);
}
