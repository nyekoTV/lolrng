# LoL Roulette RNG — Netlify ready

Mini-site statique : roulette RNG façon ouverture de coffre CS, avec images des champions League of Legends et tirage aléatoire du rôle.

## Déploiement Netlify via GitHub

1. Mets ce dossier dans un repo GitHub.
2. Sur Netlify : Add new site > Import an existing project.
3. Sélectionne ton repo.
4. Netlify lit automatiquement `netlify.toml` :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. Déploie.

Le build télécharge automatiquement les images des champions depuis Riot Data Dragon et les place dans `dist/assets/champions/`.

## Test en local

```bash
npm run build
```

Puis ouvre :

```text
dist/index.html
```

## Déploiement manuel Netlify

Si tu veux faire un drag-and-drop manuel sur Netlify :

1. Lance `npm run build` en local.
2. Glisse uniquement le dossier `dist` dans Netlify.

Attention : si tu glisses le dossier source complet, Netlify ne lance pas le build en déploiement manuel.
