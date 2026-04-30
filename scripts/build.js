import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const championsDir = path.join(distDir, "assets", "champions");

const ROLES = ["Top", "Jungle", "Mid", "Bot / ADC", "Support"];
const RARITY_ORDER = ["common", "rare", "epic", "legendary", "mythic"];
const RARITY_LABELS = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique"
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

async function build() {
  console.log("🧹 Nettoyage du dossier dist...");
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  console.log("📦 Copie des fichiers statiques...");
  await copyDir(srcDir, distDir);

  console.log("🌐 Récupération de la dernière version Data Dragon...");
  const versions = await fetchJson("https://ddragon.leagueoflegends.com/api/versions.json");
  const latestVersion = versions[0];

  console.log(`🎮 Version LoL détectée : ${latestVersion}`);
  const championPayload = await fetchJson(
    `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/champion.json`
  );

  await fs.mkdir(championsDir, { recursive: true });

  const champions = Object.values(championPayload.data)
    .map((champion) => {
      const rarity = rarityFromChampionId(champion.id);

      return {
        id: champion.id,
        name: champion.name,
        title: champion.title,
        rarity,
        rarityLabel: RARITY_LABELS[rarity],
        image: `assets/champions/${champion.id}.png`,
        roles: ROLES
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  console.log(`🖼️ Téléchargement de ${champions.length} images champions...`);

  for (const champion of champions) {
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.id}.png`;
    const imagePath = path.join(championsDir, `${champion.id}.png`);
    await downloadFile(imageUrl, imagePath);
  }

  const dataJs = `window.CHAMPIONS_DATA = ${JSON.stringify(champions, null, 2)};\nwindow.CHAMPIONS_META = ${JSON.stringify({ version: latestVersion, rarityOrder: RARITY_ORDER }, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, "champion-data.js"), dataJs, "utf8");

  console.log("✅ Build terminé. Dossier à publier : dist/");
}

build().catch((error) => {
  console.error("❌ Build échoué :", error);
  process.exit(1);
});
