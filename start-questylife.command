#!/bin/bash
cd "/Users/adrienaprile/Documents/Codex/2026-07-06/tu-es-un-d-veloppeur-senior" || exit 1

NODE="/Users/adrienaprile/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NEXT="node_modules/next/dist/bin/next"

if [ ! -d "node_modules" ]; then
  echo "Les dependances ne sont pas installees."
  echo "Ouvre ce projet dans Codex ou installe Node.js puis lance pnpm install."
  read -r -p "Appuie sur Entree pour fermer..."
  exit 1
fi

echo "Lancement de QuestyLife..."
echo "Adresse : http://localhost:3000"
echo "Garde cette fenetre ouverte pendant que tu utilises l'application."
echo

"$NODE" "$NEXT" start -p 3000

read -r -p "Appuie sur Entree pour fermer..."
