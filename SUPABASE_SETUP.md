# Synchroniser QuestyLife entre ordinateur et téléphone

Objectif : avoir les mêmes données sur ordinateur et téléphone.

Pour cela, QuestyLife utilise Supabase :

- connexion par email ;
- une table cloud sécurisée ;
- sauvegarde des données QuestyLife dans une colonne JSON ;
- récupération des données sur chaque appareil connecté.

## 1. Créer le projet Supabase

Va sur :

```txt
https://supabase.com
```

Crée un compte, puis crée un nouveau projet.

Garde le mot de passe de base de données dans un endroit sûr, mais ne le colle jamais dans QuestyLife.

## 2. Créer la table

Dans Supabase :

1. ouvre ton projet ;
2. va dans `SQL Editor` ;
3. crée une nouvelle requête ;
4. colle le contenu du fichier `supabase/schema.sql` ;
5. clique sur `Run`.

Cette table permet à chaque utilisateur connecté de lire et modifier uniquement ses propres données.

## 3. Récupérer les clés publiques

Dans Supabase :

1. va dans `Project Settings` ;
2. va dans `API` ;
3. copie `Project URL` ;
4. copie `anon public key`.

Ces deux valeurs sont publiques côté application.

## 4. Ajouter les variables dans Vercel

Dans Vercel :

1. ouvre le projet `QuestyLife` ;
2. va dans `Settings` ;
3. va dans `Environment Variables` ;
4. ajoute :

```txt
NEXT_PUBLIC_SUPABASE_URL
```

avec la valeur `Project URL`.

Puis ajoute :

```txt
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

avec la valeur `anon public key`.

Ajoute aussi :

```txt
NEXT_PUBLIC_SITE_URL
```

avec ton adresse Vercel :

```txt
https://questy-life.vercel.app
```

Ensuite redéploie le projet.

## 5. Autoriser l'adresse Vercel dans Supabase

Dans Supabase :

1. va dans `Authentication` ;
2. va dans `URL Configuration` ;
3. mets `Site URL` sur ton adresse Vercel :

```txt
https://questy-life.vercel.app
```

4. dans `Redirect URLs`, ajoute :

```txt
https://questy-life.vercel.app/**
```

Pour tester en local, tu peux aussi ajouter :

```txt
http://localhost:3000/**
```

## 6. Utiliser la synchronisation

Dans QuestyLife :

1. ouvre la page `Sync` ;
2. entre ton email ;
3. clique sur `Recevoir le lien de connexion` ;
4. ouvre l'email reçu sur le même appareil ;
5. QuestyLife se reconnecte ;
6. clique sur `Envoyer mes données` depuis l'appareil qui contient déjà tes données.

Sur l'autre appareil :

1. ouvre QuestyLife ;
2. va dans `Sync` ;
3. connecte-toi avec le même email ;
4. clique sur `Récupérer le cloud`.

Après connexion, QuestyLife sauvegarde automatiquement les changements importants.
