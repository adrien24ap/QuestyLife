# QuestyLife

QuestyLife est une V1 de web-app personnelle pour suivre les missions quotidiennes, l'eau, le poids, les séances de sport, les récaps de journée et un historique simple.

## Stack

- Next.js 14
- React 18
- TypeScript
- CSS global simple
- localStorage pour la sauvegarde locale

## Lancer le projet

Installe les dépendances :

```bash
pnpm install
```

Lance l'application en développement :

```bash
pnpm dev
```

Ouvre ensuite :

```txt
http://localhost:3000
```

## Pages

- `/` : tableau de bord, missions et eau
- `/poids` : suivi du poids
- `/sport` : création et historique des séances
- `/recap` : récap de journée
- `/historique` : vue filtrable des anciennes données

## Structure

- `app/` : pages Next.js
- `components/` : blocs réutilisables de l'interface
- `lib/` : dates, calculs et sauvegarde locale
- `types/` : modèles de données TypeScript

## Données locales

Les données sont stockées dans le navigateur avec des clés `questylife.*`.

Cette structure est volontairement centralisée dans `lib/storage.ts` pour pouvoir remplacer plus tard `localStorage` par une vraie base de données.

## V1 incluse

- accueil responsive
- missions quotidiennes
- tracker d'eau
- suivi du poids
- récap de journée
- ajout de séance de sport avec exercices et séries
- historique filtrable
- sauvegarde locale
