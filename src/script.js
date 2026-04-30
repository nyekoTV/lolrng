const champions = Array.isArray(window.CHAMPIONS) ? window.CHAMPIONS : [];

const roles = [
  { name: 'Top', icon: '🛡️' },
  { name: 'Jungle', icon: '🌲' },
  { name: 'Mid', icon: '✨' },
  { name: 'Bot / ADC', icon: '🏹' },
  { name: 'Support', icon: '💫' }
];

const rarityRates = [
  { rarity: 'common', chance: 39 },
  { rarity: 'rare', chance: 30 },
  { rarity: 'epic', chance: 20 },
  { rarity: 'legendary', chance: 10 },
  { rarity: 'mythic', chance: 1 }
];

const rarityLabels = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
  mythic: 'Mythique'
};

const track = document.querySelector('#track');
const wrapper = document.querySelector('#rouletteWrapper');
const openBtn = document.querySelector('#openBtn');
const shufflePreviewBtn = document.querySelector('#shufflePreviewBtn');
const result = document.querySelector('#result');
const versionLabel = document.querySelector('#versionLabel');

let isSpinning = false;

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickRarity() {
  const roll = Math.random() * 100;
  let total = 0;

  for (const rate of rarityRates) {
    total += rate.chance;
    if (roll <= total) return rate.rarity;
  }

  return 'common';
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
  const card = document.createElement('article');
  card.className = `champion-card ${champion.rarity}`;

  const safeTitle = champion.title || 'Champion';

  card.innerHTML = `
    <img src="${champion.image}" alt="${champion.name}" draggable="false" />
    <div class="champion-meta">
      <h3>${champion.name}</h3>
      <p>${safeTitle}</p>
      <div class="badge"><span>${rarityLabels[champion.rarity]}</span></div>
    </div>
  `;

  return card;
}

function fillPreview(amount = 26) {
  track.innerHTML = '';

  for (let i = 0; i < amount; i++) {
    track.appendChild(createChampionCard(randomItem(champions)));
  }

  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
}

function buildSpinTrack(winner) {
  track.innerHTML = '';

  const winnerIndex = 72;
  const totalCards = 92;
  const items = [];

  for (let i = 0; i < totalCards; i++) {
    items.push(randomItem(champions));
  }

  items[winnerIndex] = winner;

  for (const champion of items) {
    track.appendChild(createChampionCard(champion));
  }

  return winnerIndex;
}

function showResult(champion, role) {
  result.innerHTML = `
    <div class="result-title">Résultat du coffre</div>
    <div class="result-main">
      <span class="text-${champion.rarity}">${champion.name}</span>
      <span class="role-pill">${role.icon} ${role.name}</span>
    </div>
    <div class="muted">Rareté : ${rarityLabels[champion.rarity]} · ${champion.title || 'Champion'}</div>
  `;
}

function spin() {
  if (isSpinning || champions.length === 0) return;

  isSpinning = true;
  openBtn.disabled = true;
  shufflePreviewBtn.disabled = true;

  result.innerHTML = '<span class="muted">Ouverture en cours...</span>';

  const winner = pickChampion();
  const role = pickRole();
  const winnerIndex = buildSpinTrack(winner);

  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const winnerCard = track.children[winnerIndex];
      const wrapperCenter = wrapper.offsetWidth / 2;
      const cardCenter = winnerCard.offsetLeft + winnerCard.offsetWidth / 2;
      const randomOffset = Math.floor(Math.random() * 34) - 17;
      const finalX = wrapperCenter - cardCenter + randomOffset;

      track.style.transition = 'transform 6.2s cubic-bezier(0.09, 0.76, 0.12, 1)';
      track.style.transform = `translateX(${finalX}px)`;

      window.setTimeout(() => {
        showResult(winner, role);
        openBtn.disabled = false;
        shufflePreviewBtn.disabled = false;
        isSpinning = false;
      }, 6400);
    });
  });
}

function boot() {
  if (champions.length === 0) {
    openBtn.disabled = true;
    shufflePreviewBtn.disabled = true;
    result.innerHTML = '<span class="muted">Erreur : aucune donnée champion générée. Lance npm run build avant de déployer.</span>';
    return;
  }

  if (window.DDRAGON_VERSION) {
    versionLabel.textContent = `Images locales · Data Dragon ${window.DDRAGON_VERSION} · ${champions.length} champions`;
  }

  fillPreview();
}

openBtn.addEventListener('click', spin);
shufflePreviewBtn.addEventListener('click', () => {
  if (!isSpinning) fillPreview();
});

boot();
