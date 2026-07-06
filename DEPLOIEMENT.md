# Mettre QuestyLife en ligne

Objectif : pouvoir ouvrir QuestyLife depuis ton téléphone, par exemple à la salle.

## Important avant de commencer

La V1 sauvegarde les données avec `localStorage`.

Cela veut dire :

- si tu utilises QuestyLife sur ton Mac, les données restent dans le navigateur de ton Mac ;
- si tu l'ouvres sur ton téléphone, les données du téléphone seront séparées ;
- pour avoir les mêmes données partout, il faudra ajouter plus tard une vraie base de données avec un compte utilisateur.

La mise en ligne donne donc une adresse accessible partout, mais la synchronisation entre appareils viendra dans une V2.

## Option recommandée pour débuter : Vercel

Vercel est très adapté pour une application Next.js.

### Étape 1 - Créer un compte GitHub

Va sur :

```txt
https://github.com
```

Crée un compte si tu n'en as pas.

### Étape 2 - Mettre le projet sur GitHub

Depuis le dossier du projet, il faudra créer un dépôt Git puis l'envoyer sur GitHub.

Commandes typiques :

```bash
git init
git add .
git commit -m "Premiere version de QuestyLife"
git branch -M main
git remote add origin https://github.com/TON-NOM/questylife.git
git push -u origin main
```

Remplace `TON-NOM` par ton nom d'utilisateur GitHub.

### Étape 3 - Créer un compte Vercel

Va sur :

```txt
https://vercel.com
```

Connecte-toi avec GitHub.

### Étape 4 - Importer le projet

Dans Vercel :

1. clique sur `Add New Project` ;
2. choisis le dépôt `questylife` ;
3. laisse les réglages par défaut ;
4. clique sur `Deploy`.

Vercel détecte automatiquement Next.js.

### Étape 5 - Ouvrir l'application sur téléphone

Après le déploiement, Vercel donne une adresse du style :

```txt
https://questylife.vercel.app
```

Ouvre cette adresse sur ton téléphone.

Tu peux ensuite l'ajouter à l'écran d'accueil :

- sur iPhone : bouton partager, puis `Sur l'écran d'accueil` ;
- sur Android : menu du navigateur, puis `Ajouter à l'écran d'accueil`.

## V2 utile : synchroniser les données

Pour retrouver les mêmes données sur Mac et téléphone, il faudra ajouter :

- une base de données ;
- un compte utilisateur ;
- une connexion sécurisée.

Stack simple recommandée :

- Supabase pour la base de données ;
- Supabase Auth pour la connexion ;
- Next.js pour garder l'application actuelle.

## Résumé

Pour un accès depuis la salle :

1. mettre QuestyLife sur GitHub ;
2. connecter GitHub à Vercel ;
3. déployer ;
4. ouvrir l'URL Vercel sur ton téléphone ;
5. ajouter le site à l'écran d'accueil.

Pour les données synchronisées partout :

1. ajouter Supabase ;
2. remplacer progressivement `localStorage` par des appels à la base de données.
