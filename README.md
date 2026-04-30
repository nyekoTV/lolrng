# LoL Roulette RNG — giga troll edition v4

Tu voulais juste savoir quoi jouer.
Maintenant le site décide aussi ton rôle, ton stuff, tes runes et tes sorts d’invocateur.
Si tu perds ta game après ça, assume un peu.

## Ce que ça fait

- Roulette façon ouverture de coffre.
- RNG champion.
- RNG rôle.
- RNG stuff avec images.
- RNG runes avec images.
- RNG sorts d’invocateur avec images.
- Son de case opening.
- Gestion du son : activer, couper, volume, test.
- Footer légalement discutable : `dev a la zeub par nyeko`.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

Le build télécharge automatiquement les assets LoL utiles via Riot Data Dragon, puis génère le dossier :

```txt
dist/
```

C’est ce dossier que Netlify doit publier.

## Déploiement Netlify

La méthode propre, celle qui t’évite de faire n’importe quoi :

1. Mets le projet sur GitHub.
2. Importe le repo dans Netlify.
3. Vérifie :

```txt
Build command: npm run build
Publish directory: dist
```

## Dev local

```bash
npm run dev
```

## Remarque essentielle

Oui, les builds sont RNG.
Non, ce n’est pas une excuse valable pour first-timer un pick troll en ranked.
