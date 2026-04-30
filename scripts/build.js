import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const championsDir = path.join(distDir, "assets", "champions");
const itemsDir = path.join(distDir, "assets", "items");
const summonersDir = path.join(distDir, "assets", "summoners");
const runesDir = path.join(distDir, "assets", "runes");
const runeStylesDir = path.join(distDir, "assets", "runes", "styles");
const rolesDir = path.join(distDir, "assets", "roles");

const RARITY_ORDER = ["common", "rare", "epic", "legendary", "mythic"];
const RARITY_LABELS = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique"
};

const ROLE_CONFIGS = {
  "Top": {
    subtitle: "Solo lane, ego et TP douteux.",
    iconLabel: "TOP",
    itemPresets: [
      ["6631", "3078", "3047", "3071", "3053", "6333"],
      ["3068", "3111", "3075", "3065", "3143", "4401"],
      ["3078", "3047", "3748", "3053", "3071", "3065"]
    ],
    summonerCombos: [
      ["SummonerFlash", "SummonerTeleport"],
      ["SummonerFlash", "SummonerDot"]
    ],
    runePages: [
      { label: "Bruiser — Conquérant / Resolve", primaryStyle: "8000", secondaryStyle: "8400", primary: ["8010", "9111", "9104", "8299"], secondary: ["8444", "8451"] },
      { label: "Tank — Poigne / Precision", primaryStyle: "8400", secondaryStyle: "8000", primary: ["8437", "8446", "8444", "8451"], secondary: ["9111", "8299"] }
    ]
  },
  "Jungle": {
    subtitle: "Tu gank ou tu farm ? Personne ne sait.",
    iconLabel: "JGL",
    itemPresets: [
      ["3078", "3153", "3047", "6333", "3053", "3071"],
      ["6653", "3111", "3157", "3135", "3089", "4629"],
      ["3068", "3047", "3075", "3065", "3110", "4401"]
    ],
    summonerCombos: [
      ["SummonerFlash", "SummonerSmite"],
      ["SummonerHaste", "SummonerSmite"]
    ],
    runePages: [
      { label: "Fighter Jungle — Conquérant / Inspiration", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8010", "9111", "9104", "8017"], secondary: ["8304", "8347"] },
      { label: "Assassin Jungle — Électrocution / Precision", primaryStyle: "8100", secondaryStyle: "8000", primary: ["8112", "8143", "8138", "8135"], secondary: ["9111", "8017"] }
    ]
  },
  "Mid": {
    subtitle: "Le syndrome main character en plein milieu.",
    iconLabel: "MID",
    itemPresets: [
      ["6655", "3020", "4645", "3157", "3089", "3135"],
      ["6653", "3020", "4629", "3157", "3089", "3165"],
      ["4646", "3020", "3100", "3157", "3089", "3135"]
    ],
    summonerCombos: [
      ["SummonerFlash", "SummonerDot"],
      ["SummonerFlash", "SummonerTeleport"],
      ["SummonerFlash", "SummonerBarrier"]
    ],
    runePages: [
      { label: "Mage Mid — Comète / Inspiration", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8229", "8226", "8210", "8237"], secondary: ["8345", "8347"] },
      { label: "Assassin Mid — Électrocution / Sorcellerie", primaryStyle: "8100", secondaryStyle: "8200", primary: ["8112", "8143", "8138", "8106"], secondary: ["8210", "8237"] }
    ]
  },
  "Bot / ADC": {
    subtitle: "Tu critiques ou tu te fais one-shot.",
    iconLabel: "BOT",
    itemPresets: [
      ["6672", "3006", "3031", "3046", "3036", "3072"],
      ["3124", "3006", "3153", "3085", "3036", "6672"],
      ["6672", "3006", "3094", "3031", "3036", "3072"]
    ],
    summonerCombos: [
      ["SummonerFlash", "SummonerHeal"],
      ["SummonerFlash", "SummonerBoost"],
      ["SummonerFlash", "SummonerHaste"]
    ],
    runePages: [
      { label: "ADC — Attaque soutenue / Inspiration", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8005", "9111", "9104", "8017"], secondary: ["8304", "8347"] },
      { label: "ADC mobile — Jeu de jambes / Inspiration", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8021", "9111", "9103", "8014"], secondary: ["8304", "8347"] }
    ]
  },
  "Support": {
    subtitle: "Le héros que personne ne remercie.",
    iconLabel: "SUP",
    itemPresets: [
      ["6617", "3158", "3504", "6616", "3107", "3222"],
      ["3190", "3009", "3109", "3050", "3075", "4401"],
      ["2065", "3158", "3504", "3190", "3107", "6616"]
    ],
    summonerCombos: [
      ["SummonerFlash", "SummonerExhaust"],
      ["SummonerFlash", "SummonerDot"],
      ["SummonerFlash", "SummonerHeal"]
    ],
    runePages: [
      { label: "Enchanter — Aery / Resolve", primaryStyle: "8200", secondaryStyle: "8400", primary: ["8214", "8226", "8210", "8236"], secondary: ["8473", "8453"] },
      { label: "Engage — Aftershock / Inspiration", primaryStyle: "8400", secondaryStyle: "8300", primary: ["8439", "8463", "8473", "8451"], secondary: ["8306", "8347"] }
    ]
  }
};

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function rarityFromChampionId(id) {
  const value = hashText(id) % 100;

  if (value < 39) return "common";
  if (value < 69) return "rare";
  if (value < 89) return "epic";
  if (value < 99) return "legendary";
  return "mythic";
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else {
      await fs.copyFile(source, target);
    }
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} sur ${url}`);
  }
  return response.json();
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur téléchargement ${response.status} sur ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);
}

async function writeRoleIcon(roleName, label) {
  const safe = roleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fileName = `${safe}.svg`;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#091325"/>
  <rect x="6" y="6" width="116" height="116" rx="22" stroke="#D7AF63" stroke-width="4"/>
  <circle cx="64" cy="40" r="18" fill="#1A3564" stroke="#F6D889" stroke-width="3"/>
  <path d="M34 92C40 72 54 62 64 62C74 62 88 72 94 92" stroke="#3FA7FF" stroke-width="7" stroke-linecap="round"/>
  <text x="64" y="111" text-anchor="middle" fill="#F4F0E6" font-family="Arial, sans-serif" font-size="18" font-weight="700">${label}</text>
</svg>`.trim();
  await fs.writeFile(path.join(rolesDir, fileName), svg, "utf8");
  return `assets/roles/${fileName}`;
}

function unique(array) {
  return [...new Set(array)];
}

function buildRuneMaps(runeTrees) {
  const runeMap = {};
  const styleMap = {};

  for (const style of runeTrees) {
    styleMap[String(style.id)] = {
      id: String(style.id),
      name: style.name,
      subtitle: style.name,
      iconSource: style.icon
    };

    for (const slot of style.slots || []) {
      for (const rune of slot.runes || []) {
        runeMap[String(rune.id)] = {
          id: String(rune.id),
          name: rune.name,
          subtitle: style.name,
          iconSource: rune.icon
        };
      }
    }
  }

  return { runeMap, styleMap };
}

function sanitizeItemPreset(presetIds, availableIds, fallbackIds) {
  const kept = unique((presetIds || []).filter((id) => availableIds.has(String(id))).map(String));
  for (const fallbackId of fallbackIds) {
    if (kept.length >= 6) break;
    if (!kept.includes(fallbackId) && availableIds.has(fallbackId)) kept.push(fallbackId);
  }
  return kept.slice(0, 6);
}

function sanitizeSpellCombo(comboIds, availableIds) {
  return unique((comboIds || []).filter((id) => availableIds.has(String(id))).map(String)).slice(0, 2);
}

function sanitizeRunePage(page, runeMap, styleMap) {
  const primary = (page.primary || []).map(String).filter((id) => runeMap[id]);
  const secondary = (page.secondary || []).map(String).filter((id) => runeMap[id]);
  const primaryStyle = String(page.primaryStyle);
  const secondaryStyle = String(page.secondaryStyle);

  if (!styleMap[primaryStyle] || !styleMap[secondaryStyle]) return null;
  if (primary.length < 4 || secondary.length < 2) return null;

  return {
    label: page.label,
    primaryStyle,
    secondaryStyle,
    primary: primary.slice(0, 4),
    secondary: secondary.slice(0, 2)
  };
}

async function build() {
  console.log("🧹 Nettoyage du dossier dist...");
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  console.log("📦 Copie des fichiers statiques...");
  await copyDir(srcDir, distDir);

  await fs.mkdir(championsDir, { recursive: true });
  await fs.mkdir(itemsDir, { recursive: true });
  await fs.mkdir(summonersDir, { recursive: true });
  await fs.mkdir(runesDir, { recursive: true });
  await fs.mkdir(runeStylesDir, { recursive: true });
  await fs.mkdir(rolesDir, { recursive: true });

  console.log("🌐 Récupération de la dernière version Data Dragon...");
  const versions = await fetchJson("https://ddragon.leagueoflegends.com/api/versions.json");
  const latestVersion = versions[0];
  console.log(`🎮 Version LoL détectée : ${latestVersion}`);

  const [championPayload, itemPayload, summonerPayload, runePayload] = await Promise.all([
    fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/champion.json`),
    fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/item.json`),
    fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/summoner.json`),
    fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/runesReforged.json`)
  ]);

  const champions = Object.values(championPayload.data)
    .map((champion) => {
      const rarity = rarityFromChampionId(champion.id);
      return {
        id: champion.id,
        name: champion.name,
        title: champion.title,
        tags: champion.tags || [],
        rarity,
        rarityLabel: RARITY_LABELS[rarity],
        image: `assets/champions/${champion.id}.png`
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  console.log(`🖼️ Téléchargement de ${champions.length} images champions...`);
  for (const champion of champions) {
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.id}.png`;
    const imagePath = path.join(championsDir, `${champion.id}.png`);
    await downloadFile(imageUrl, imagePath);
  }

  const allRequestedItemIds = unique(
    Object.values(ROLE_CONFIGS).flatMap((role) => role.itemPresets.flat())
  ).map(String);
  const availableItemIds = new Set(Object.keys(itemPayload.data || {}).map(String));
  const fallbackItemIds = unique([
    "3047", "3111", "3158", "3006", "3078", "3071", "3053", "3068", "3065", "3075", "6655", "6653", "3157", "3089", "3135", "6672", "3031", "3046", "3036", "3072", "3190", "3504", "6617", "3107"
  ]).filter((id) => availableItemIds.has(id));
  const finalItemIds = unique([...allRequestedItemIds.filter((id) => availableItemIds.has(id)), ...fallbackItemIds]);

  console.log(`🛒 Téléchargement de ${finalItemIds.length} images d'items...`);
  const items = {};
  for (const itemId of finalItemIds) {
    const item = itemPayload.data[itemId];
    if (!item?.image?.full) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}`, path.join(itemsDir, `${itemId}.png`));
    items[itemId] = {
      id: itemId,
      name: item.name,
      subtitle: item.plaintext || "Item RNG",
      image: `assets/items/${itemId}.png`
    };
  }

  const summonerEntries = Object.values(summonerPayload.data || {});
  const requestedSummonerIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => role.summonerCombos.flat())).map(String);
  const availableSummonerIds = new Set(summonerEntries.map((spell) => String(spell.id)));
  const summoners = {};

  console.log("✨ Téléchargement des sorts d'invocateur...");
  for (const spell of summonerEntries) {
    if (!requestedSummonerIds.includes(String(spell.id))) continue;
    if (!spell?.image?.full) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}`, path.join(summonersDir, `${spell.id}.png`));
    summoners[String(spell.id)] = {
      id: String(spell.id),
      name: spell.name,
      subtitle: "Sort d'invocateur",
      image: `assets/summoners/${spell.id}.png`
    };
  }

  const { runeMap, styleMap } = buildRuneMaps(runePayload);
  const requestedStyleIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => role.runePages.flatMap((page) => [page.primaryStyle, page.secondaryStyle]))).map(String);
  const requestedRuneIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => role.runePages.flatMap((page) => [...page.primary, ...page.secondary]))).map(String);

  const runeStyles = {};
  console.log("🔮 Téléchargement des styles de runes...");
  for (const styleId of requestedStyleIds) {
    const style = styleMap[styleId];
    if (!style) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/img/${style.iconSource}`, path.join(runeStylesDir, `${styleId}.png`));
    runeStyles[styleId] = {
      id: styleId,
      name: style.name,
      subtitle: "Style de rune",
      image: `assets/runes/styles/${styleId}.png`
    };
  }

  const runes = {};
  console.log("🔯 Téléchargement des runes...");
  for (const runeId of requestedRuneIds) {
    const rune = runeMap[runeId];
    if (!rune) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/img/${rune.iconSource}`, path.join(runesDir, `${runeId}.png`));
    runes[runeId] = {
      id: runeId,
      name: rune.name,
      subtitle: rune.subtitle,
      image: `assets/runes/${runeId}.png`
    };
  }

  const roleConfigs = {};
  const roleOrder = Object.keys(ROLE_CONFIGS);
  for (const [roleName, config] of Object.entries(ROLE_CONFIGS)) {
    const icon = await writeRoleIcon(roleName, config.iconLabel || roleName);
    const itemPresets = config.itemPresets
      .map((preset) => sanitizeItemPreset(preset, availableItemIds, fallbackItemIds))
      .filter((preset) => preset.length >= 4);

    const summonerCombos = config.summonerCombos
      .map((combo) => sanitizeSpellCombo(combo, availableSummonerIds))
      .filter((combo) => combo.length >= 2);

    const runePages = config.runePages
      .map((page) => sanitizeRunePage(page, runeMap, styleMap))
      .filter(Boolean);

    roleConfigs[roleName] = {
      name: roleName,
      subtitle: config.subtitle,
      icon,
      itemPresets,
      summonerCombos,
      runePages
    };
  }

  const championDataJs = `window.CHAMPIONS_DATA = ${JSON.stringify(champions, null, 2)};\nwindow.CHAMPIONS_META = ${JSON.stringify({ version: latestVersion, rarityOrder: RARITY_ORDER }, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, "champion-data.js"), championDataJs, "utf8");

  const gameDataJs = `window.GAME_DATA = ${JSON.stringify({ version: latestVersion, roleOrder, roleConfigs, items, summoners, runes, runeStyles }, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, "game-data.js"), gameDataJs, "utf8");

  console.log("✅ Build terminé. Dossier à publier : dist/");
}

build().catch((error) => {
  console.error("❌ Build échoué :", error);
  process.exit(1);
});
