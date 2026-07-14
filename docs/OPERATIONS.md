# Exploitation

## Développement WSL

1. Copier `.env.example` vers `.env.local` et renseigner Supabase uniquement quand le compteur mondial doit être actif.
2. Lancer `docker compose up --build`.
3. Ouvrir `http://localhost:3000`. Les modifications locales sont détectées automatiquement, y compris depuis le montage WSL.

Sans variables Supabase, l'audio, l'interface et le lien de soutien fonctionnent. Le compteur est partagé par les visiteurs du conteneur de prévisualisation, mais il repart de zéro au redémarrage. Avec Supabase, il devient persistant et mondial.

Le fichier `public/teuteuteu.mp3`, les deux états PNG du bouton et la timeline de 166 secousses proviennent directement de l'extraction du SWF original. Les secousses sont synchronisées à l'horloge audio et sont automatiquement désactivées avec `prefers-reduced-motion`.

## Supabase

Appliquer toutes les migrations de `supabase/migrations/` dans l'ordre. La dernière répartit le compteur sur 64 fragments, active RLS sans accès public et purge chaque heure, par lots bornés, les empreintes inactives depuis deux heures. Les clés de service restent uniquement dans `.env.local` ou dans les variables chiffrées de Vercel.

Le projet utilise Supabase Pro. Surveiller la latence du RPC, la taille de `click_rate_limits`, les connexions et la taille de la base. Les avis « RLS enabled with no policy » sont intentionnels : toutes les lectures publiques passent par les routes serveur utilisant `service_role`.

## Buy Me a Coffee

Créer le webhook `https://<domaine>/api/webhooks/buymeacoffee`, sélectionner au minimum `donation.created` et `donation.refunded`, puis placer son Signing Secret dans `BUY_ME_A_COFFEE_WEBHOOK_SECRET`.

Le handler vérifie le corps brut avec `x-signature-sha256`, ignore les tests dashboard et les dons anonymes, et ne conserve ni e-mail, ni montant, ni message.

## Production Vercel

La branche de production est `main`. GitHub Actions vérifie le projet et l'intégration Git Vercel crée automatiquement le déploiement de production. Vercel termine TLS, sert les assets via son CDN et fournit l'adresse visiteur normalisée, utilisée uniquement sous forme hachée pour limiter les rafales de clics.

Le workflow `Notify IndexNow` s'exécute uniquement après un déploiement Vercel marqué `Production` et réussi. Il sélectionne les URL éditoriales concernées depuis le sitemap et ne réagit jamais aux clics du compteur. La variable Vercel `INDEXNOW_KEY` et le secret GitHub Actions du même nom doivent avoir exactement la même valeur. La route `/indexnow-key` expose cette valeur à IndexNow et répond `404` lorsqu'elle n'est pas configurée.

Les balises de validation Google et Bing utilisent respectivement `GOOGLE_SITE_VERIFICATION` et `BING_SITE_VERIFICATION`. Après leur ajout dans Vercel, soumettre `https://www.teuteuteu.com/sitemap.xml` dans les deux consoles et inspecter au minimum `/en/history` et `/fr/history`.

BotID Basic protège `POST /api/click` sans CAPTCHA visible. La règle WAF IP reste fixée à 60 requêtes par minute. `/api/counter` est mis en cache deux secondes au CDN et `/api/supporters` une minute. En incident, activer `CLICK_COUNTER_ENABLED=false` si le taux de 5xx dépasse 2 % pendant cinq minutes ou si le RPC dépasse une seconde au p95.

Le build Docker de référence reste disponible avec `docker compose -f docker-compose.production.yml up --build`. En incident, définir `CLICK_COUNTER_ENABLED=false` dans Vercel permet de conserver le site en ligne sans nouvelle écriture Supabase.
