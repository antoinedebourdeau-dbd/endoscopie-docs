# Documents patients — Endoscopie digestive · CHU de Montpellier

Site statique (aucun serveur, aucune donnée transmise) pour générer les
documents patients du service : notes d'information & consentement,
ordonnances + guides de préparation colique, fiches illustrées.

## Utilisation

1. Ouvrir le site (ou `index.html` en local) ;
2. Cocher le(s) document(s) souhaité(s) ;
3. Choisir le médecin (liste gérable : « Gérer les médecins ») ;
4. Optionnel : renseigner le patient ;
5. « Imprimer / Enregistrer en PDF » → un seul flux, chaque document
   démarre sur une nouvelle page.

- **Version générique** (case à cocher) : documents sans médecin ni patient,
  zones en pointillés — pour la reprographie. Le bouton **Pack reprographie**
  sélectionne tout le catalogue en générique.
- **Nouveau document** : création guidée d'une fiche à partir d'un texte
  source, via un prompt calibré à coller dans Claude, avec validation et
  aperçu automatiques. Les documents créés restent locaux (badge « Document
  local ») jusqu'à intégration officielle.

## Numéros du service (fixes dans les documents)

- Endoscopie digestive : 04 67 33 70 67 — urgence 24 h/24 : 04 67 33 70 65, sinon 15
- Explorations fonctionnelles digestives : 04 67 33 29 53
- FINESS CHU : 340782036

## Architecture

| Fichier | Rôle |
| --- | --- |
| `index.html`, `css/app.css`, `js/app.js` | interface |
| `js/endoc-docs.js` | données des 23 notes (source de vérité éditoriale) |
| `js/render.js` | moteur de rendu (charte graphique), impression combinée |
| `js/tpl-ordos.js`, `js/tpl-fiches.js` | modèles générés par `tools/extract.mjs` |
| `js/barcode.js` | codes-barres Code 128 (RPPS, FINESS) en SVG |
| `js/doctors.js`, `js/localdocs.js` | annuaire médecins & documents locaux (localStorage) |

Les modèles d'ordonnances/fiches sont extraits des documents source
(`tools/extract.mjs`, chemin source à adapter) — à relancer si les documents
d'origine évoluent.

`tools/package-offline.mjs` fabrique `dist/endoscopie-docs-hors-ligne.zip`,
la version à télécharger pour un usage sans internet.

## Officialiser un document local

Un collègue exporte son document (lien « exporter » dans le catalogue) et
l'envoie ; après relecture, ajouter l'objet JSON dans `js/endoc-docs.js`
(clé nouvelle dans `DOCS`) et le déployer — il devient officiel pour tous.
