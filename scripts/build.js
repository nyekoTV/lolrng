import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const championsDir = path.join(distDir, "assets", "champions");
const championLoadingDir = path.join(distDir, "assets", "champion-loading");
const itemsDir = path.join(distDir, "assets", "items");
const summonersDir = path.join(distDir, "assets", "summoners");
const runesDir = path.join(distDir, "assets", "runes");
const runeStylesDir = path.join(distDir, "assets", "runes", "styles");
const rolesDir = path.join(distDir, "assets", "roles");

const MODE_ORDER = ["SR", "ARAM", "Fun", "Troll"];
const RARITY_ORDER = ["common", "rare", "epic", "legendary", "mythic"];
const RARITY_LABELS = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique"
};

const mode = (itemPresets, summonerCombos, runePages) => ({ itemPresets, summonerCombos, runePages });
const modes = (SR, ARAM, Fun, Troll) => ({ SR, ARAM, Fun, Troll });

const ROLE_CONFIGS = {
  "Top": {
    subtitle: "Solo lane, ego et TP douteux.",
    iconLabel: "TOP",
    modes: modes(
      mode(
        [["3078", "3047", "3053", "3071", "6333", "3748"], ["3068", "3111", "3075", "3065", "3143", "4401"], ["6631", "3047", "3053", "3071", "3074", "6333"]],
        [["SummonerFlash", "SummonerTeleport"], ["SummonerFlash", "SummonerDot"]],
        [{ label: "Bruiser — Conquérant", primaryStyle: "8000", secondaryStyle: "8400", primary: ["8010", "9111", "9104", "8299"], secondary: ["8444", "8451"] }, { label: "Tank — Poigne", primaryStyle: "8400", secondaryStyle: "8000", primary: ["8437", "8446", "8444", "8451"], secondary: ["9111", "8299"] }]
      ),
      mode(
        [["3068", "3111", "3075", "3065", "4401", "3083"], ["6653", "3111", "3157", "3089", "3135", "4629"], ["3078", "3047", "3053", "3071", "3748", "6333"]],
        [["SummonerFlash", "SummonerSnowball"], ["SummonerSnowball", "SummonerDot"], ["SummonerFlash", "SummonerBarrier"]],
        [{ label: "ARAM bruiser — Conquérant", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8010", "9111", "9104", "8017"], secondary: ["8304", "8347"] }, { label: "ARAM tank — Resolve", primaryStyle: "8400", secondaryStyle: "8300", primary: ["8437", "8446", "8473", "8451"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3047", "3111", "3006", "3158", "3053", "3071"], ["6655", "3020", "4645", "3157", "3089", "3135"], ["6672", "3006", "3031", "3046", "3036", "3072"]],
        [["SummonerFlash", "SummonerHaste"], ["SummonerFlash", "SummonerDot"], ["SummonerFlash", "SummonerBoost"]],
        [{ label: "Fun — Phase Rush", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8230", "8234", "8233", "8236"], secondary: ["8304", "8347"] }, { label: "Fun — Fleet", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8021", "9111", "9103", "8014"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3006", "3046", "3085", "3031", "3036", "3094"], ["3020", "6655", "3089", "3157", "3135", "4629"], ["3158", "2065", "6617", "3504", "6616", "3107"]],
        [["SummonerMana", "SummonerTeleport"], ["SummonerBarrier", "SummonerHeal"], ["SummonerHaste", "SummonerBoost"]],
        [{ label: "Troll — Spellbook", primaryStyle: "8300", secondaryStyle: "8100", primary: ["8351", "8306", "8321", "8347"], secondary: ["8143", "8105"] }, { label: "Troll — Predator", primaryStyle: "8100", secondaryStyle: "8300", primary: ["8124", "8143", "8138", "8105"], secondary: ["8304", "8347"] }]
      )
    )
  },
  "Jungle": {
    subtitle: "Tu gank ou tu farm ? Personne ne sait.",
    iconLabel: "JGL",
    modes: modes(
      mode(
        [["3078", "3153", "3047", "6333", "3053", "3071"], ["6653", "3111", "3157", "3135", "3089", "4629"], ["3068", "3047", "3075", "3065", "3110", "4401"]],
        [["SummonerFlash", "SummonerSmite"], ["SummonerHaste", "SummonerSmite"]],
        [{ label: "Fighter Jungle — Conquérant", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8010", "9111", "9104", "8017"], secondary: ["8304", "8347"] }, { label: "Assassin Jungle — Électrocution", primaryStyle: "8100", secondaryStyle: "8000", primary: ["8112", "8143", "8138", "8135"], secondary: ["9111", "8017"] }]
      ),
      mode(
        [["3068", "3111", "3075", "3065", "3083", "4401"], ["6653", "3111", "3157", "3089", "3135", "4629"], ["6672", "3006", "3031", "3036", "3046", "3094"]],
        [["SummonerFlash", "SummonerSnowball"], ["SummonerSnowball", "SummonerBarrier"], ["SummonerFlash", "SummonerHeal"]],
        [{ label: "ARAM damage — Dark Harvest", primaryStyle: "8100", secondaryStyle: "8300", primary: ["8128", "8139", "8138", "8106"], secondary: ["8304", "8347"] }, { label: "ARAM teamfight — Aery", primaryStyle: "8200", secondaryStyle: "8400", primary: ["8214", "8226", "8210", "8236"], secondary: ["8473", "8451"] }]
      ),
      mode(
        [["3158", "2065", "3504", "6616", "3107", "3222"], ["3006", "6672", "3031", "3036", "3094", "3072"], ["3020", "6655", "3157", "3089", "3135", "4645"]],
        [["SummonerSmite", "SummonerMana"], ["SummonerSmite", "SummonerBoost"], ["SummonerSmite", "SummonerDot"]],
        [{ label: "Fun — Glacial", primaryStyle: "8300", secondaryStyle: "8400", primary: ["8351", "8306", "8345", "8347"], secondary: ["8473", "8453"] }, { label: "Fun — First Strike", primaryStyle: "8300", secondaryStyle: "8200", primary: ["8369", "8304", "8345", "8347"], secondary: ["8210", "8236"] }]
      ),
      mode(
        [["3020", "6655", "3089", "3135", "3157", "4629"], ["3158", "6617", "3504", "6616", "3107", "3222"], ["3006", "3031", "3046", "3085", "3036", "3072"]],
        [["SummonerBarrier", "SummonerMana"], ["SummonerHeal", "SummonerBoost"], ["SummonerHaste", "SummonerSmite"]],
        [{ label: "Troll — Spellbook", primaryStyle: "8300", secondaryStyle: "8200", primary: ["8351", "8306", "8345", "8347"], secondary: ["8210", "8236"] }, { label: "Troll — Hail of Blades", primaryStyle: "8100", secondaryStyle: "8300", primary: ["9923", "8143", "8138", "8105"], secondary: ["8304", "8347"] }]
      )
    )
  },
  "Mid": {
    subtitle: "Le syndrome main character en plein milieu.",
    iconLabel: "MID",
    modes: modes(
      mode(
        [["6655", "3020", "4645", "3157", "3089", "3135"], ["6653", "3020", "4629", "3157", "3089", "3165"], ["4646", "3020", "3100", "3157", "3089", "3135"]],
        [["SummonerFlash", "SummonerDot"], ["SummonerFlash", "SummonerTeleport"], ["SummonerFlash", "SummonerBarrier"]],
        [{ label: "Mage Mid — Comète", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8229", "8226", "8210", "8237"], secondary: ["8345", "8347"] }, { label: "Assassin Mid — Électrocution", primaryStyle: "8100", secondaryStyle: "8200", primary: ["8112", "8143", "8138", "8106"], secondary: ["8210", "8237"] }]
      ),
      mode(
        [["6655", "3020", "4645", "3157", "3089", "3135"], ["6672", "3006", "3031", "3046", "3036", "3072"], ["2065", "3158", "6617", "3504", "6616", "3222"]],
        [["SummonerFlash", "SummonerSnowball"], ["SummonerFlash", "SummonerBarrier"], ["SummonerSnowball", "SummonerDot"]],
        [{ label: "ARAM burst — First Strike", primaryStyle: "8300", secondaryStyle: "8200", primary: ["8369", "8304", "8345", "8347"], secondary: ["8210", "8237"] }, { label: "ARAM poke — Comète", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8229", "8226", "8210", "8237"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3006", "6672", "3031", "3046", "3036", "3094"], ["3158", "2065", "3504", "6616", "3107", "3222"], ["3047", "3068", "3075", "3065", "3083", "4401"]],
        [["SummonerFlash", "SummonerBoost"], ["SummonerFlash", "SummonerHeal"], ["SummonerHaste", "SummonerDot"]],
        [{ label: "Fun — Fleet", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8021", "9111", "9103", "8014"], secondary: ["8304", "8347"] }, { label: "Fun — Phase Rush", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8230", "8234", "8233", "8236"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3047", "3068", "3075", "3065", "3083", "4401"], ["3158", "6617", "3504", "6616", "3107", "3222"], ["3006", "3031", "3046", "3085", "3036", "3072"]],
        [["SummonerTeleport", "SummonerMana"], ["SummonerBarrier", "SummonerHeal"], ["SummonerHaste", "SummonerBoost"]],
        [{ label: "Troll — Glacial", primaryStyle: "8300", secondaryStyle: "8400", primary: ["8351", "8306", "8345", "8347"], secondary: ["8473", "8453"] }, { label: "Troll — Dark Harvest", primaryStyle: "8100", secondaryStyle: "8300", primary: ["8128", "8139", "8138", "8106"], secondary: ["8304", "8347"] }]
      )
    )
  },
  "Bot / ADC": {
    subtitle: "Tu critiques ou tu te fais one-shot.",
    iconLabel: "BOT",
    modes: modes(
      mode(
        [["6672", "3006", "3031", "3046", "3036", "3072"], ["3124", "3006", "3153", "3085", "3036", "6672"], ["6672", "3006", "3094", "3031", "3036", "3072"]],
        [["SummonerFlash", "SummonerHeal"], ["SummonerFlash", "SummonerBoost"], ["SummonerFlash", "SummonerHaste"]],
        [{ label: "ADC — PTA", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8005", "9111", "9104", "8017"], secondary: ["8304", "8347"] }, { label: "ADC — Fleet", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8021", "9111", "9103", "8014"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["6672", "3006", "3031", "3046", "3036", "3072"], ["6653", "3020", "3157", "3089", "3135", "4629"], ["2065", "3158", "6617", "3504", "6616", "3222"]],
        [["SummonerFlash", "SummonerSnowball"], ["SummonerSnowball", "SummonerBarrier"], ["SummonerFlash", "SummonerHeal"]],
        [{ label: "ARAM carry — LT", primaryStyle: "8000", secondaryStyle: "8300", primary: ["8008", "9111", "9104", "8017"], secondary: ["8304", "8347"] }, { label: "ARAM poke — Comète", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8229", "8226", "8210", "8237"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3020", "6655", "3157", "3089", "3135", "4629"], ["3047", "3068", "3075", "3065", "3083", "4401"], ["3158", "2065", "3504", "6616", "3107", "3222"]],
        [["SummonerFlash", "SummonerDot"], ["SummonerFlash", "SummonerBarrier"], ["SummonerHaste", "SummonerBoost"]],
        [{ label: "Fun — First Strike", primaryStyle: "8300", secondaryStyle: "8200", primary: ["8369", "8304", "8345", "8347"], secondary: ["8210", "8236"] }, { label: "Fun — Aery", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8214", "8226", "8210", "8236"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3068", "3111", "3075", "3065", "3083", "4401"], ["3158", "6617", "3504", "6616", "3107", "3222"], ["3020", "6655", "3157", "3089", "3135", "4629"]],
        [["SummonerMana", "SummonerHeal"], ["SummonerBarrier", "SummonerBoost"], ["SummonerHaste", "SummonerTeleport"]],
        [{ label: "Troll — Spellbook", primaryStyle: "8300", secondaryStyle: "8400", primary: ["8351", "8306", "8345", "8347"], secondary: ["8473", "8453"] }, { label: "Troll — Predator", primaryStyle: "8100", secondaryStyle: "8300", primary: ["8124", "8143", "8138", "8105"], secondary: ["8304", "8347"] }]
      )
    )
  },
  "Support": {
    subtitle: "Le héros que personne ne remercie.",
    iconLabel: "SUP",
    modes: modes(
      mode(
        [["6617", "3158", "3504", "6616", "3107", "3222"], ["3190", "3009", "3109", "3050", "3075", "4401"], ["2065", "3158", "3504", "3190", "3107", "6616"]],
        [["SummonerFlash", "SummonerExhaust"], ["SummonerFlash", "SummonerDot"], ["SummonerFlash", "SummonerHeal"]],
        [{ label: "Enchanter — Aery", primaryStyle: "8200", secondaryStyle: "8400", primary: ["8214", "8226", "8210", "8236"], secondary: ["8473", "8453"] }, { label: "Engage — Aftershock", primaryStyle: "8400", secondaryStyle: "8300", primary: ["8439", "8463", "8473", "8451"], secondary: ["8306", "8347"] }]
      ),
      mode(
        [["2065", "3158", "3504", "6616", "3107", "3222"], ["3190", "3111", "3109", "3050", "3075", "4401"], ["6653", "3020", "3157", "3089", "3135", "4629"]],
        [["SummonerFlash", "SummonerSnowball"], ["SummonerFlash", "SummonerExhaust"], ["SummonerSnowball", "SummonerHeal"]],
        [{ label: "ARAM support — Aery", primaryStyle: "8200", secondaryStyle: "8400", primary: ["8214", "8226", "8210", "8236"], secondary: ["8473", "8453"] }, { label: "ARAM engage — Guardian", primaryStyle: "8400", secondaryStyle: "8300", primary: ["8465", "8446", "8473", "8451"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["6672", "3006", "3031", "3046", "3036", "3072"], ["3020", "6655", "3157", "3089", "3135", "4629"], ["3047", "3068", "3075", "3065", "3083", "4401"]],
        [["SummonerFlash", "SummonerDot"], ["SummonerHaste", "SummonerHeal"], ["SummonerFlash", "SummonerBoost"]],
        [{ label: "Fun — Dark Harvest", primaryStyle: "8100", secondaryStyle: "8300", primary: ["8128", "8139", "8138", "8106"], secondary: ["8304", "8347"] }, { label: "Fun — Comète", primaryStyle: "8200", secondaryStyle: "8300", primary: ["8229", "8226", "8210", "8237"], secondary: ["8304", "8347"] }]
      ),
      mode(
        [["3020", "6655", "3157", "3089", "3135", "4629"], ["3006", "3031", "3046", "3085", "3036", "3072"], ["3068", "3111", "3075", "3065", "3083", "4401"]],
        [["SummonerMana", "SummonerBarrier"], ["SummonerHeal", "SummonerBoost"], ["SummonerTeleport", "SummonerHaste"]],
        [{ label: "Troll — Glacial", primaryStyle: "8300", secondaryStyle: "8200", primary: ["8351", "8306", "8345", "8347"], secondary: ["8210", "8236"] }, { label: "Troll — Hail of Blades", primaryStyle: "8100", secondaryStyle: "8300", primary: ["9923", "8143", "8138", "8105"], secondary: ["8304", "8347"] }]
      )
    )
  }
};

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
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
    if (entry.isDirectory()) await copyDir(source, target);
    else await fs.copyFile(source, target);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur HTTP ${response.status} sur ${url}`);
  return response.json();
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur téléchargement ${response.status} sur ${url}`);
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
  return [...new Set(array.filter(Boolean))];
}

function buildRuneMaps(runeTrees) {
  const runeMap = {};
  const styleMap = {};
  for (const style of runeTrees) {
    styleMap[String(style.id)] = { id: String(style.id), name: style.name, subtitle: style.name, iconSource: style.icon };
    for (const slot of style.slots || []) {
      for (const rune of slot.runes || []) {
        runeMap[String(rune.id)] = { id: String(rune.id), name: rune.name, subtitle: style.name, iconSource: rune.icon };
      }
    }
  }
  return { runeMap, styleMap };
}

function sanitizeItemPreset(presetIds, availableIds, fallbackIds) {
  const kept = unique((presetIds || []).map(String).filter((id) => availableIds.has(id)));
  for (const fallbackId of fallbackIds) {
    if (kept.length >= 6) break;
    if (!kept.includes(fallbackId) && availableIds.has(fallbackId)) kept.push(fallbackId);
  }
  return kept.slice(0, 6);
}

function sanitizeSpellCombo(comboIds, availableIds, fallbackSpells) {
  const kept = unique((comboIds || []).map(String).filter((id) => availableIds.has(id)));
  for (const spell of fallbackSpells) {
    if (kept.length >= 2) break;
    if (!kept.includes(spell) && availableIds.has(spell)) kept.push(spell);
  }
  return kept.slice(0, 2);
}

function sanitizeRunePage(page, runeMap, styleMap) {
  const primaryStyle = String(page.primaryStyle);
  const secondaryStyle = String(page.secondaryStyle);
  if (!styleMap[primaryStyle] || !styleMap[secondaryStyle]) return null;
  const primary = (page.primary || []).map(String).filter((id) => runeMap[id]);
  const secondary = (page.secondary || []).map(String).filter((id) => runeMap[id]);
  if (primary.length < 4 || secondary.length < 2) return null;
  return { label: page.label, primaryStyle, secondaryStyle, primary: primary.slice(0, 4), secondary: secondary.slice(0, 2) };
}

async function build() {
  console.log("🧹 Nettoyage du dossier dist...");
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  console.log("📦 Copie des fichiers statiques...");
  await copyDir(srcDir, distDir);

  for (const dir of [championsDir, championLoadingDir, itemsDir, summonersDir, runesDir, runeStylesDir, rolesDir]) {
    await fs.mkdir(dir, { recursive: true });
  }

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
        image: `assets/champions/${champion.id}.png`,
        splash: `assets/champion-loading/${champion.id}_0.jpg`
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  console.log(`🖼️ Téléchargement de ${champions.length} images champions...`);
  for (const champion of champions) {
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.id}.png`, path.join(championsDir, `${champion.id}.png`));
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`, path.join(championLoadingDir, `${champion.id}_0.jpg`));
  }

  const allRequestedItemIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => MODE_ORDER.flatMap((m) => role.modes[m].itemPresets.flat()))).map(String);
  const availableItemIds = new Set(Object.keys(itemPayload.data || {}).map(String));
  const fallbackItemIds = unique(["3047", "3111", "3158", "3006", "3078", "3071", "3053", "3068", "3065", "3075", "6655", "6653", "3157", "3089", "3135", "6672", "3031", "3046", "3036", "3072", "3190", "3504", "6617", "3107", "2065", "3222", "4629", "3094", "3124", "3153", "4401", "3009"]).filter((id) => availableItemIds.has(id));
  const finalItemIds = unique([...allRequestedItemIds.filter((id) => availableItemIds.has(id)), ...fallbackItemIds]);

  console.log(`🛒 Téléchargement de ${finalItemIds.length} images d'items...`);
  const items = {};
  for (const itemId of finalItemIds) {
    const item = itemPayload.data[itemId];
    if (!item?.image?.full) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}`, path.join(itemsDir, `${itemId}.png`));
    items[itemId] = { id: itemId, name: item.name, subtitle: item.plaintext || "Item RNG", image: `assets/items/${itemId}.png` };
  }

  const allRequestedSummonerIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => MODE_ORDER.flatMap((m) => role.modes[m].summonerCombos.flat()))).map(String);
  const summonerEntries = Object.values(summonerPayload.data || {});
  const availableSummonerIds = new Set(summonerEntries.map((spell) => String(spell.id)));
  const summoners = {};

  console.log("✨ Téléchargement des sorts d'invocateur...");
  for (const spell of summonerEntries) {
    const spellId = String(spell.id);
    if (!allRequestedSummonerIds.includes(spellId)) continue;
    if (!spell?.image?.full) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}`, path.join(summonersDir, `${spellId}.png`));
    summoners[spellId] = { id: spellId, name: spell.name, subtitle: "Sort d'invocateur", image: `assets/summoners/${spellId}.png` };
  }

  const { runeMap, styleMap } = buildRuneMaps(runePayload);
  const requestedStyleIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => MODE_ORDER.flatMap((m) => role.modes[m].runePages.flatMap((page) => [page.primaryStyle, page.secondaryStyle])))).map(String);
  const requestedRuneIds = unique(Object.values(ROLE_CONFIGS).flatMap((role) => MODE_ORDER.flatMap((m) => role.modes[m].runePages.flatMap((page) => [...page.primary, ...page.secondary])))).map(String);

  console.log("🔮 Téléchargement des styles de runes...");
  const runeStyles = {};
  for (const styleId of requestedStyleIds) {
    const style = styleMap[styleId];
    if (!style) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/img/${style.iconSource}`, path.join(runeStylesDir, `${styleId}.png`));
    runeStyles[styleId] = { id: styleId, name: style.name, subtitle: "Style de rune", image: `assets/runes/styles/${styleId}.png` };
  }

  console.log("🔯 Téléchargement des runes...");
  const runes = {};
  for (const runeId of requestedRuneIds) {
    const rune = runeMap[runeId];
    if (!rune) continue;
    await downloadFile(`https://ddragon.leagueoflegends.com/cdn/img/${rune.iconSource}`, path.join(runesDir, `${runeId}.png`));
    runes[runeId] = { id: runeId, name: rune.name, subtitle: rune.subtitle, image: `assets/runes/${runeId}.png` };
  }

  const roleConfigs = {};
  const roleOrder = Object.keys(ROLE_CONFIGS);
  const fallbackSpells = ["SummonerFlash", "SummonerDot", "SummonerBarrier", "SummonerHeal", "SummonerSmite", "SummonerSnowball", "SummonerHaste"].filter((id) => availableSummonerIds.has(id));

  for (const [roleName, role] of Object.entries(ROLE_CONFIGS)) {
    const roleIcon = await writeRoleIcon(roleName, role.iconLabel || roleName);
    const builtModes = {};

    for (const modeName of MODE_ORDER) {
      const source = role.modes[modeName] || role.modes.SR;
      builtModes[modeName] = {
        itemPresets: source.itemPresets.map((preset) => sanitizeItemPreset(preset, availableItemIds, fallbackItemIds)).filter((preset) => preset.length >= 4),
        summonerCombos: source.summonerCombos.map((combo) => sanitizeSpellCombo(combo, availableSummonerIds, fallbackSpells)).filter((combo) => combo.length >= 2),
        runePages: source.runePages.map((page) => sanitizeRunePage(page, runeMap, styleMap)).filter(Boolean)
      };
    }

    roleConfigs[roleName] = { name: roleName, subtitle: role.subtitle, icon: roleIcon, modes: builtModes };
  }

  const championDataJs = `window.CHAMPIONS_DATA = ${JSON.stringify(champions, null, 2)};\nwindow.CHAMPIONS_META = ${JSON.stringify({ version: latestVersion, rarityOrder: RARITY_ORDER }, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, "champion-data.js"), championDataJs, "utf8");

  const gameDataJs = `window.GAME_DATA = ${JSON.stringify({ version: latestVersion, modeOrder: MODE_ORDER, roleOrder, roleConfigs, items, summoners, runes, runeStyles }, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, "game-data.js"), gameDataJs, "utf8");

  console.log("✅ Build terminé. Dossier à publier : dist/");
}

build().catch((error) => {
  console.error("❌ Build échoué :", error);
  process.exit(1);
});
