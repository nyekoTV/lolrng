const champions = window.CHAMPIONS_DATA || [];
const buildData = window.GAME_DATA || { roleConfigs: {}, items: {}, summoners: {}, runes: {}, roleOrder: [] };

const rarityRates = [
  { rarity: "common", chance: 39 },
  { rarity: "rare", chance: 30 },
  { rarity: "epic", chance: 20 },
  { rarity: "legendary", chance: 10 },
  { rarity: "mythic", chance: 1 }
];

const track = document.querySelector("#track");
const rouletteFrame = document.querySelector("#rouletteFrame");
const openBtn = document.querySelector("#openBtn");
const resultCard = document.querySelector("#resultCard");
const resultImage = document.querySelector("#resultImage");
const resultName = document.querySelector("#resultName");
const resultTitle = document.querySelector("#resultTitle");
const resultRarity = document.querySelector("#resultRarity");
const resultRole = document.querySelector("#resultRole");
const roleDisplay = document.querySelector("#roleDisplay");
const itemsGrid = document.querySelector("#itemsGrid");
const summonerGrid = document.querySelector("#summonerGrid");
const runesGrid = document.querySelector("#runesGrid");
const runePageMeta = document.querySelector("#runePageMeta");
const runePrimaryStyle = document.querySelector("#runePrimaryStyle");
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

function pickRoleConfig() {
  const roleNames = buildData.roleOrder || Object.keys(buildData.roleConfigs || {});
  const roleName = randomItem(roleNames);
  return buildData.roleConfigs[roleName];
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

function createAssetTile(asset, extraClass = "") {
  const tile = document.createElement("article");
  tile.className = `asset-tile ${extraClass}`.trim();

  tile.innerHTML = `
    <img src="${asset.image}" alt="${asset.name}">
    <div class="asset-meta">
      <strong>${asset.name}</strong>
      ${asset.subtitle ? `<small>${asset.subtitle}</small>` : ""}
    </div>
  `;

  return tile;
}

function createStyleBadge(style) {
  const badge = document.createElement("div");
  badge.className = "style-badge";
  badge.innerHTML = `
    <img src="${style.image}" alt="${style.name}">
    <div>
      <strong>${style.name}</strong>
      ${style.subtitle ? `<small>${style.subtitle}</small>` : ""}
    </div>
  `;
  return badge;
}

function fillIdleRoulette() {
  track.innerHTML = "";

  if (!champions.length || !buildData.roleConfigs || !Object.keys(buildData.roleConfigs).length) {
    track.innerHTML = `<p style="padding:24px;color:#f6d889;font-weight:900">Les fichiers de build sont absents. Lance npm run build.</p>`;
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
    // Bloqué navigateur si aucun clic utilisateur.
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

function clearNode(node) {
  node.innerHTML = "";
}

function pickLoadout(roleConfig) {
  const itemPresetIds = randomItem(roleConfig.itemPresets || []);
  const summonerIds = randomItem(roleConfig.summonerCombos || []);
  const runePage = randomItem(roleConfig.runePages || []);

  return {
    role: roleConfig,
    items: (itemPresetIds || []).map((id) => buildData.items[id]).filter(Boolean),
    summoners: (summonerIds || []).map((id) => buildData.summoners[id]).filter(Boolean),
    runePage: {
      ...runePage,
      primaryStyle: buildData.runeStyles[runePage.primaryStyle],
      secondaryStyle: buildData.runeStyles[runePage.secondaryStyle],
      primaryRunes: (runePage.primary || []).map((id) => buildData.runes[id]).filter(Boolean),
      secondaryRunes: (runePage.secondary || []).map((id) => buildData.runes[id]).filter(Boolean)
    }
  };
}

function showRole(roleConfig) {
  roleDisplay.innerHTML = `
    <div class="role-card">
      <img src="${roleConfig.icon}" alt="${roleConfig.name}">
      <div>
        <strong>${roleConfig.name}</strong>
        <small>${roleConfig.subtitle || "Rôle RNG sélectionné"}</small>
      </div>
    </div>
  `;
}

function showItems(items) {
  clearNode(itemsGrid);
  items.forEach((item) => itemsGrid.appendChild(createAssetTile(item, "item-tile")));
}

function showSummoners(summoners) {
  clearNode(summonerGrid);
  summoners.forEach((summoner) => summonerGrid.appendChild(createAssetTile(summoner, "spell-tile")));
}

function showRunes(runePage) {
  clearNode(runesGrid);
  clearNode(runePrimaryStyle);

  runePageMeta.innerHTML = `
    <span>${runePage.label || "Page RNG"}</span>
  `;

  if (runePage.primaryStyle) runePrimaryStyle.appendChild(createStyleBadge(runePage.primaryStyle));
  if (runePage.secondaryStyle) runePrimaryStyle.appendChild(createStyleBadge(runePage.secondaryStyle));

  runePage.primaryRunes.forEach((rune) => runesGrid.appendChild(createAssetTile(rune, "rune-tile")));
  runePage.secondaryRunes.forEach((rune) => runesGrid.appendChild(createAssetTile(rune, "rune-tile secondary-rune")));
}

function showResult(winner, roleConfig, loadout) {
  resultImage.src = winner.image;
  resultImage.alt = winner.name;
  resultName.textContent = winner.name;
  resultTitle.textContent = winner.title || "Champion débloqué";
  resultRarity.textContent = `Rareté : ${winner.rarityLabel}`;
  resultRarity.className = winner.rarity;
  resultRole.textContent = `Rôle RNG : ${roleConfig.name}`;

  showRole(roleConfig);
  showItems(loadout.items);
  showSummoners(loadout.summoners);
  showRunes(loadout.runePage);

  resultCard.hidden = false;
}

function spin() {
  if (spinning || !champions.length) return;

  spinning = true;
  openBtn.disabled = true;
  resultCard.hidden = true;

  const winner = pickChampion();
  const roleConfig = pickRoleConfig();
  const loadout = pickLoadout(roleConfig);
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
      showResult(winner, roleConfig, loadout);
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
