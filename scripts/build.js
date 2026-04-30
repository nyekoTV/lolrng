const fs = require('fs');
const path = require('path');
const https = require('https');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const championsDir = path.join(distDir, 'assets', 'champions');

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';

const rarityPools = {
  mythic: new Set(['AurelionSol', 'Azir', 'Bard', 'Kindred', 'Ryze']),
  legendary: new Set(['Aatrox', 'Ahri', 'Akali', 'Aphelios', 'Jhin', 'Kayle', 'Morgana', 'Senna', 'Sylas', 'Thresh', 'Viego', 'Yasuo', 'Yone', 'Zed']),
  epic: new Set(['Darius', 'Diana', 'Ekko', 'Evelynn', 'Irelia', 'Jinx', 'Kaisa', 'Katarina', 'Lux', 'Pyke', 'Qiyana', 'Riven', 'Samira', 'Sett', 'Vayne', 'Xayah']),
  rare: new Set(['Ashe', 'Caitlyn', 'Ezreal', 'Garen', 'Graves', 'Hecarim', 'LeeSin', 'Leona', 'Lucian', 'Malphite', 'MasterYi', 'MissFortune', 'Mordekaiser', 'Nasus', 'Nautilus', 'Nidalee', 'Orianna', 'Pantheon', 'Sona', 'Soraka', 'Teemo', 'Tristana', 'Vi', 'Warwick', 'XinZhao'])
};

function requestBuffer(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirectCount < 5) {
        res.resume();
        const nextUrl = new URL(res.headers.location, url).toString();
        requestBuffer(nextUrl, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function requestJson(url) {
  const buffer = await requestBuffer(url);
  return JSON.parse(buffer.toString('utf8'));
}

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });

  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, item.name);
    const destPath = path.join(to, item.name);

    if (item.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getRarity(championId) {
  if (rarityPools.mythic.has(championId)) return 'mythic';
  if (rarityPools.legendary.has(championId)) return 'legendary';
  if (rarityPools.epic.has(championId)) return 'epic';
  if (rarityPools.rare.has(championId)) return 'rare';
  return 'common';
}

function cleanTitle(title) {
  if (!title) return '';
  return title.charAt(0).toUpperCase() + title.slice(1);
}

async function main() {
  console.log('Nettoyage du dossier dist...');
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(championsDir, { recursive: true });

  console.log('Copie des fichiers statiques...');
  copyDirectory(srcDir, distDir);

  console.log('Récupération de la dernière version Data Dragon...');
  const versions = await requestJson(`${DDRAGON_BASE}/api/versions.json`);
  const version = versions[0];

  console.log(`Version Data Dragon utilisée : ${version}`);
  console.log('Récupération de la liste des champions...');

  let championData;
  try {
    championData = await requestJson(`${DDRAGON_BASE}/cdn/${version}/data/fr_FR/champion.json`);
  } catch (error) {
    console.warn('Impossible de charger fr_FR, fallback en_US...');
    championData = await requestJson(`${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`);
  }

  const champions = Object.values(championData.data)
    .map((champion) => ({
      id: champion.id,
      key: champion.key,
      name: champion.name,
      title: cleanTitle(champion.title),
      image: `assets/champions/${champion.image.full}`,
      rarity: getRarity(champion.id),
      tags: champion.tags || []
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  console.log(`Téléchargement des icônes : ${champions.length} champions...`);

  for (const champion of champions) {
    const filename = path.basename(champion.image);
    const imageUrl = `${DDRAGON_BASE}/cdn/${version}/img/champion/${filename}`;
    const outputPath = path.join(championsDir, filename);
    const imageBuffer = await requestBuffer(imageUrl);
    fs.writeFileSync(outputPath, imageBuffer);
    process.stdout.write('.');
  }

  process.stdout.write('\n');

  const generatedContent = `window.CHAMPIONS = ${JSON.stringify(champions, null, 2)};\nwindow.DDRAGON_VERSION = ${JSON.stringify(version)};\n`;
  fs.writeFileSync(path.join(distDir, 'champions.generated.js'), generatedContent, 'utf8');

  console.log('Build terminé. Dossier à publier : dist');
}

main().catch((error) => {
  console.error('Erreur pendant le build :');
  console.error(error);
  process.exit(1);
});
