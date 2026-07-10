# Exploitation

## Développement WSL

1. Copier `.env.example` vers `.env.local` et renseigner Supabase uniquement quand le compteur mondial doit être actif.
2. Lancer `docker compose up --build`.
3. Ouvrir `http://localhost:3000`. Les modifications locales sont détectées automatiquement, y compris depuis le montage WSL.

Sans variables Supabase, l'audio, l'interface et le lien de soutien fonctionnent. Le compteur est partagé par les visiteurs du conteneur de prévisualisation, mais il repart de zéro au redémarrage. Avec Supabase, il devient persistant et mondial.

Le fichier `public/teuteuteu.mp3`, les deux états PNG du bouton et la timeline de 166 secousses proviennent directement de l'extraction du SWF original. Les secousses sont synchronisées à l'horloge audio et sont automatiquement désactivées avec `prefers-reduced-motion`.

## Supabase

Appliquer `supabase/migrations/20260710_teuteuteu.sql` dans le projet Supabase. Les clés de service restent uniquement dans `.env.local` ou dans les secrets du futur runtime.

## Buy Me a Coffee

Créer le webhook `https://<domaine>/api/webhooks/buymeacoffee`, sélectionner au minimum `donation.created` et `donation.refunded`, puis placer son Signing Secret dans `BUY_ME_A_COFFEE_WEBHOOK_SECRET`.

Le handler vérifie le corps brut avec `x-signature-sha256`, ignore les tests dashboard et les dons anonymes, et ne conserve ni e-mail, ni montant, ni message.

## Production

Construire et démarrer localement avec `docker compose -f docker-compose.production.yml up --build`. Le futur hébergement doit terminer TLS et écraser `X-Forwarded-For` avant d'atteindre Next, car cette adresse est utilisée uniquement sous forme hachée pour limiter les rafales de clics.
