# LoL Roulette RNG — dev a la zeub edition

Bienvenue dans le projet le plus sérieux du monde : une roulette RNG pour tirer un champion LoL et un rôle.

Est-ce utile ? Pas vraiment.  
Est-ce stylé ? Un peu.  
Est-ce que ça peut ruiner une draft entre potes ? Absolument.

## Ce que ça fait

- Roulette façon ouverture de coffre.
- Images des champions téléchargées automatiquement pendant le build.
- RNG du champion.
- RNG du rôle : Top, Jungle, Mid, Bot / ADC, Support.
- Son de case opening.
- Contrôle du son : activer, couper, volume, test.
- Footer obligatoire : `dev a la zeub par nyeko`.

## Installation

```bash
npm install
```

## Lancer le build

```bash
npm run build
```

Le dossier généré sera :

```txt
dist/
```

C'est ce dossier que Netlify doit publier.

## Déploiement Netlify

La méthode propre :

1. Mets le projet sur GitHub.
2. Va sur Netlify.
3. Import ton repo.
4. Netlify lit normalement `netlify.toml` tout seul.
5. Vérifie quand même :

```txt
Build command: npm run build
Publish directory: dist
```

## Tester en local

```bash
npm run dev
```

Si ça marche pas, c'est probablement pas la faute de Teemo, mais on va dire que si.

## Notes importantes

Le tirage est fait côté navigateur. Pour un vrai système de loot sérieux, il faudrait faire le RNG côté serveur.

Mais ici, c'est pour le fun. Donc ça passe.

## Crédits

Développé avec beaucoup trop de confiance et pas assez de sommeil.

**dev a la zeub par nyeko**
