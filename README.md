# LoL Roulette RNG — full random v6

Là on a arrêté de faire semblant que c’était équilibré.

Le mode `Troll` est remplacé par `Random`, et ce mode fait vraiment n’importe quoi :

- champion RNG
- rôle RNG
- stuff RNG depuis le pool global d’items
- summoners RNG depuis le pool global
- runes RNG depuis le pool global
- aucune cohérence volontaire entre champion, rôle, items, runes ou summoners

Donc oui, un champion AP peut finir avec des items AD.  
Oui, un ADC peut finir avec un build de tank.  
Oui, c’est débile. C’est le but.

## Modes

- `SR` : build un minimum logique.
- `ARAM` : adapté au bordel de l’ARAM.
- `Fun` : off-meta jouable.
- `Random` : full chaos, tout est aléatoire.

## Boutons

- Reroll rôle
- Reroll stuff
- Reroll runes
- Reroll summoners

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

Le build télécharge les assets depuis Riot Data Dragon et génère :

```txt
dist/
```

## Netlify

- Build command : `npm run build`
- Publish directory : `dist`

## Message important

Si tu joues ça en ranked, ce n’est plus un site web, c’est une preuve contre toi.
