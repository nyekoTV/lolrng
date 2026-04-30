const champions = window.CHAMPIONS_DATA || [];

const rarityRates = [
  { rarity: "common", chance: 39 },
  { rarity: "rare", chance: 30 },
  { rarity: "epic", chance: 20 },
  { rarity: "legendary", chance: 10 },
  { rarity: "mythic", chance: 1 }
];

const roles = ["Top", "Jungle", "Mid", "Bot / ADC", "Support"];

const track = document.querySelector("#track");
const rouletteFrame = document.querySelector("#rouletteFrame");
const openBtn = document.querySelector("#openBtn");
const resultCard = document.querySelector("#resultCard");
const resultImage = document.querySelector("#resultImage");
const resultName = document.querySelector("#resultName");
const resultTitle = document.querySelector("#resultTitle");
const resultRarity = document.querySelector("#resultRarity");
const resultRole = document.querySelector("#resultRole");
const caseAudio = document.querySelector("#caseAudio");
const soundToggle = document.querySelector("#soundToggle");
const volumeRange = document.querySelector("#volumeRange");
const testSoundBtn = document.querySelector("#testSoundBtn");

let spinning = false;

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickRarity() {
  const random = Math.random() * 100;
  let total = 0;

  for (const rate of rarityRates) {
    total += rate.chance;
    if (random <= total) {
      return rate.rarity;
    }
  }

  return "common";
}

function pickChampion() {
  const rarity = pickRarity();
  const pool = champions.filter((champion) => champion.rarity === rarity);
  return randomItem(pool.length ? pool : champions);
}

function pickRole() {
  return randomItem(roles);
}

function createChampionCard(champion) {
  const card = document.createElement("article");
  card.className = `champion-card ${champion.rarity}`;

  card.innerHTML = `
    <img src="${champion.image}" alt="${champion.name}" loading="eager">
    <div class="card-overlay">
      <strong>${champion.name}</strong>
      <small>${champion.title}</small>
      <em class="${champion.rarity}">${champion.rarityLabel}</em>
    </div>
  `;

  return card;
}

function fillIdleRoulette() {
  track.innerHTML = "";

  if (!champions.length) {
    track.innerHTML = `<p style="padding:24px;color:#f6d889;font-weight:900">Champion-data.js est absent. Lance npm run build.</p>`;
    openBtn.disabled = true;
    return;
  }

  for (let i = 0; i < 24; i++) {
    track.appendChild(createChampionCard(randomItem(champions)));
  }
}

function buildRoulette(winner) {
  track.innerHTML = "";
  const winnerIndex = 66;
  const totalCards = 90;

  for (let i = 0; i < totalCards; i++) {
    const champion = i === winnerIndex ? winner : randomItem(champions);
    track.appendChild(createChampionCard(champion));
  }

  return winnerIndex;
}

function playCaseSound() {
  if (!soundToggle.checked) return;

  caseAudio.pause();
  caseAudio.currentTime = 0;
  caseAudio.volume = Number(volumeRange.value) / 100;

  caseAudio.play().catch(() => {
    // Le navigateur peut bloquer si ce n'est pas lancé après une action utilisateur.
  });
}

function stopCaseSoundSoftly() {
  const fade = setInterval(() => {
    if (caseAudio.volume > 0.05) {
      caseAudio.volume = Math.max(0, caseAudio.volume - 0.05);
    } else {
      caseAudio.pause();
      caseAudio.currentTime = 0;
      caseAudio.volume = Number(volumeRange.value) / 100;
      clearInterval(fade);
    }
  }, 80);
}

function showResult(winner, role) {
  resultImage.src = winner.image;
  resultImage.alt = winner.name;
  resultName.textContent = winner.name;
  resultTitle.textContent = winner.title || "Champion débloqué";
  resultRarity.textContent = `Rareté : ${winner.rarityLabel}`;
  resultRarity.className = winner.rarity;
  resultRole.textContent = `Rôle RNG : ${role}`;
  resultCard.hidden = false;
}

function spin() {
  if (spinning || !champions.length) return;

  spinning = true;
  openBtn.disabled = true;
  resultCard.hidden = true;

  const winner = pickChampion();
  const role = pickRole();
  const winnerIndex = buildRoulette(winner);

  track.style.transition = "none";
  track.style.transform = "translateX(0px)";

  playCaseSound();

  requestAnimationFrame(() => {
    const winnerCard = track.children[winnerIndex];
    const frameCenter = rouletteFrame.offsetWidth / 2;
    const cardCenter = winnerCard.offsetLeft + winnerCard.offsetWidth / 2;
    const randomOffset = Math.floor(Math.random() * 36) - 18;
    const finalTranslate = frameCenter - cardCenter + randomOffset;

    track.style.transition = "transform 6s cubic-bezier(0.08, 0.78, 0.14, 1)";
    track.style.transform = `translateX(${finalTranslate}px)`;

    setTimeout(() => {
      showResult(winner, role);
      stopCaseSoundSoftly();
      openBtn.disabled = false;
      spinning = false;
    }, 6200);
  });
}

openBtn.addEventListener("click", spin);

testSoundBtn.addEventListener("click", () => {
  playCaseSound();
  setTimeout(stopCaseSoundSoftly, 1600);
});

volumeRange.addEventListener("input", () => {
  caseAudio.volume = Number(volumeRange.value) / 100;
});

soundToggle.addEventListener("change", () => {
  if (!soundToggle.checked) {
    caseAudio.pause();
    caseAudio.currentTime = 0;
  }
});

fillIdleRoulette();
