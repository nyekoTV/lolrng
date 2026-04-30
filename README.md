# LoL Roulette RNG — troll edition v5

Tu voulais une roulette.
Maintenant t’as un mini casino qui te choisit ton champion, ton rôle, ton stuff, tes runes et tes sorts d’invocateur.
Si tu lances une ranked avec le filtre troll, faut pas venir pleurer.

## Ce qu’il y a dedans

- roulette façon ouverture de coffre
- RNG champion
- RNG rôle
- RNG stuff
- RNG runes
- RNG summoners
- filtres `SR / ARAM / Fun / Troll`
- boutons :
  - reroll rôle
  - reroll stuff
  - reroll runes
  - reroll summoners
- son de case opening + panneau de gestion du son
- images champions, items, runes et summoners
- champion result avec une image plus propre
- footer très sérieux : `dev a la zeub par nyeko`

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

Le build télécharge automatiquement les assets utiles depuis Riot Data Dragon puis génère :

```txt
dist/
```

C’est ce dossier que Netlify doit publier.

## Déploiement Netlify

- Build command : `npm run build`
- Publish directory : `dist`

## Rappel de survie

- `SR` : tentative de build cohérente.
- `ARAM` : builds et summoners orientés ARAM.
- `Fun` : off-meta mais encore jouable.
- `Troll` : tu cherches la bagarre avec ton équipe.
