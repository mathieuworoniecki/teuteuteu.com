# Plan anti-spam et anti-DDoS

## Objectif

Le site, le bouton et le son doivent rester disponibles même si l'écriture du compteur est attaquée. Le compteur est une fonctionnalité secondaire et doit pouvoir passer temporairement en lecture seule.

## Couche 1, protection avant l'origine

1. Placer le domaine derrière le proxy Cloudflare avant l'ouverture publique.
2. Ne jamais publier directement l'adresse de l'origine SiteGround. Restreindre l'origine aux plages Cloudflare ou utiliser un tunnel si l'hébergement le permet.
3. Activer la protection DDoS HTTP gérée et conserver les fichiers statiques, le MP3 et les PNG dans le cache CDN.
4. Mettre `/api/click` sous une règle dédiée : uniquement `POST`, journalisation initiale, Managed Challenge au-delà d'une rafale humaine crédible, puis blocage temporaire en cas de récidive.
5. Commencer avec 10 requêtes sur 10 secondes et 60 requêtes sur une minute par adresse. Ajuster après observation du trafic réel.
6. Ne jamais appliquer de challenge interactif au webhook Buy Me a Coffee. Le limiter séparément et le laisser utiliser sa signature HMAC.

## Couche 2, application Next

1. Accepter uniquement `POST /api/click`, sans corps de requête.
2. Lire l'adresse normalisée par le proxy de confiance, puis la hacher avec un secret rotatif. Ne jamais stocker l'adresse brute.
3. Refuser les origines web étrangères lorsque l'en-tête `Origin` est présent.
4. Ajouter `CLICK_COUNTER_ENABLED=false` comme coupe-circuit. Dans ce mode, la page et `/api/state` restent disponibles mais les incréments renvoient le total courant sans écrire.
5. Retourner rapidement une réponse stable lorsque Supabase ralentit, sans bloquer l'audio ni l'interaction locale.

## Couche 3, Supabase

1. Garder l'incrément et la limite de débit dans une seule transaction SQL atomique.
2. Conserver la clé service uniquement côté serveur et interdire les écritures directes aux rôles publics.
3. Limiter chaque empreinte IP à 60 clics par minute. Le navigateur remplace son incrément optimiste par le total réellement accepté.
4. Supprimer quotidiennement les lignes de limitation inactives depuis plus de 48 heures avec Supabase Cron.
5. Surveiller la latence de la fonction SQL, les erreurs, le nombre de lignes de limitation et la croissance du compteur.

## Couche 4, réponse à incident

1. Alerter sur une hausse brutale des `429`, `5xx`, temps de réponse Supabase ou requêtes par seconde.
2. Activer le coupe-circuit du compteur avant que la base soit saturée.
3. Si nécessaire, activer temporairement le mode Under Attack sur `/api/click` ou sur toute la zone.
4. Garder la page et les assets en cache pendant l'incident.
5. Après l'incident, analyser les journaux Cloudflare, ajuster les seuils, nettoyer les lignes de limitation et réactiver les écritures.

## Tests avant lancement

- Une utilisation humaine rapide reste comptée.
- La 61e requête d'une même empreinte sur une minute n'incrémente pas le total.
- Un onglet limité reçoit le total serveur exact.
- Une panne Supabase n'empêche ni la page ni le son de fonctionner.
- Le coupe-circuit rend le compteur en lecture seule sans erreur visuelle.
- Un webhook signé passe, un webhook invalide ou trop volumineux est rejeté.
- L'origine ne répond pas lorsqu'elle est appelée en dehors du proxy de confiance.
