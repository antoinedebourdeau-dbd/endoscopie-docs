# Doc'HGE — Documents patients · Hépato-Gastroentérologie · CHU de Montpellier

Site 100 % statique (aucune donnée patient ne quitte le navigateur) permettant aux
médecins et secrétariats du service de générer : notes d'information & consentement,
ordonnances de préparation colique, ordonnances libres (éditeur riche, simple/ALD
bizone, RPPS + code-barres), demandes d'examen endoscopique (bon PTED Saint-Éloi),
avec impression combinée et envoi par e-mail. Propriétaire : Dr Antoine Debourdeau.

## Production

- **URL : https://dochge.pages.dev** — Cloudflare Pages, protégé par Cloudflare
  Access (code e-mail à usage unique, autorisés : `@chu-montpellier.fr` +
  antoinedebourdeau@gmail.com). Account id CF : `f076971b6b0d58241b8d6a9b706eaf3c`,
  jeton API dans `~/.config/dochge/cf-token`.
- **Déployer : `./tools/deploy-pages.sh`** (wrangler direct upload, effet immédiat).
  Toujours **incrémenter `APP_VERSION`** dans `js/app.js` avant (affichée dans le
  bandeau — sert à diagnostiquer les caches des postes CHU).
- GitHub `antoinedebourdeau-dbd/endoscopie-docs` = sauvegarde du code (git push) +
  distribution du zip hors-ligne : `node tools/package-offline.mjs` puis
  `~/.local/bin/gh release upload v1.0 dist/endoscopie-docs-hors-ligne.zip --clobber`.
  GitHub Pages est désactivé (ancienne URL morte).

## Architecture

| Fichier | Rôle |
| --- | --- |
| `js/endoc-docs.js` | données des 23 notes (source de vérité éditoriale) — pour « officialiser » un document local d'un collègue, ajouter son JSON dans `DOCS` |
| `js/render.js` | rendu charte graphique (Barlow, #0072BC/#EF7D00) : notes, ordonnances, demande d'examen, fiches ; impression via sections + table thead/tfoot, @page margin 0 |
| `js/app.js` | UI : catalogue, parcours, profils médecin/secrétariat, demandes, envois e-mail, wizard IA |
| `js/tpl-ordos.js`, `js/tpl-fiches.js` | GÉNÉRÉS par `tools/extract.mjs` depuis `~/Downloads/prepa et infos` (ne pas éditer) |
| `js/barcode.js` | Code 128 SVG (RPPS médecin, FINESS 340782036) |
| `vendor/` | html2canvas + jsPDF (PDF des e-mails), qrcode (affiche) — embarqués pour le hors-ligne |

## Pièges connus (durement appris)

- **Outlook PC décode les mailto ET les .eml en ANSI (windows-1252), pas en UTF-8.**
  Tout texte d'e-mail passe par `mailtoEncode()` / `qpCp1252()` avec substitution
  des caractères typographiques (`MAILTO_SUBST` : — • ’ « » → ASCII). Attention aux
  classes de caractères : l'espace insécable U+00A0 y figure — ne pas le confondre
  avec un espace normal (bug des « espaces avalés »).
- Le navigateur ne peut PAS joindre un PDF à un mailto → flux guidé (modale
  d'instructions) + option .eml X-Unsent avec PJ incluse (support variable selon
  Outlook — à re-tester sur les postes CHU).
- Contenu riche (ordonnance) : sanitizer `sanitizeRich()` au rendu ET au collage.
- Numéros fixes du service : endoscopie 04 67 33 70 67, urgence 04 67 33 70 65
  (sinon 15), explorations 04 67 33 29 53, fax PTED 04 67 33 73 58.
- Vérifier le rendu : serveur local + Playwright (`channel: 'chrome'`), PDF via
  `page.pdf()` puis rasterisation pdf.js ; simuler Outlook PC en décodant en
  windows-1252. Les modales ont chacune leur `.modal-close` (scoper les sélecteurs).

## Décisions produit (ne pas revenir dessus sans demander)

- Générique/reprographie : pointillés, sans médecin/patient ni date.
- Consentement : date/signature toujours manuscrites.
- Badge « Document local » à l'écran seulement, jamais à l'impression.
- Les fiches illustrées et notes d'explorations fonctionnelles sont rangées dans
  « Notes d'information & consentement » (pas de sections séparées).
- Catalogue masqué par défaut, piloté par les boutons de catégories.

## En attente (décidé, non fait)

- Bons de radiologie + explorations fonctionnelles (attendent les PDF d'Antoine) —
  le choix du type existe déjà dans « Demande d'examen » (boutons « bientôt »).
- Liste officielle des médecins embarquée (attend l'export JSON d'Antoine).
- Traductions/FALC des notes, PWA, envoi e-mail automatique (intranet CHU).
