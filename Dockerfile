# Étape 1 : Build Angular
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./

# Étape CRITIQUE : Installation des dépendances DANS le conteneur Linux
# Nous utilisons 'npm ci' pour garantir une installation propre et complète
RUN npm ci

COPY . .

# Compilation Angular
RUN npm run build -- --configuration production

# Étape 2 : Serveur Nginx
FROM nginx:alpine

# AJOUT CRITIQUE : Copier le fichier de configuration Nginx personnalisé.
# Ceci permet de gérer le routage des applications Angular (SPA).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CORRECTION FINALE : On cible le sous-dossier 'browser'
COPY --from=build /app/dist/gestionaire-projets/browser/. /usr/share/nginx/html

EXPOSE 80
