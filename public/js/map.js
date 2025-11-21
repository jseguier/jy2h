/* ============================================================
   Leaflet – Carte NebuleAir
   Fichier : js/map.js
   ============================================================ */

/* ---------------------
   1) Coordonnées du capteur
   --------------------- */

// Exemple : IUT Saint-Jérôme (à remplacer par les coordonnées réelles)
const CAPTEUR_LAT = 43.343;
const CAPTEUR_LON = 5.415;
const ZOOM = 15;


/* ---------------------
   2) Initialisation de la carte
   --------------------- */

const map = L.map('map', {
  zoomControl: true,   // zoom +/- visible
  scrollWheelZoom: true
}).setView([CAPTEUR_LAT, CAPTEUR_LON], ZOOM);


/* ---------------------
   3) Fond de carte (Dark Mode)
   Attribution vide pour éviter le texte Leaflet imposé.
   Tu mettras l'attribution dans ton footer HTML.
   --------------------- */

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: ''   // PAS de texte Leaflet visible sur la carte
}).addTo(map);


/* ---------------------
   4) Icône personnalisée (optionnel)
   Mets ton icône dans /img/marker.png si tu veux.
   Sinon Leaflet utilisera un point rouge par défaut.
   --------------------- */

const markerIcon = L.icon({
  iconUrl: 'img/marker.png',  // Mets ton icône ici (40×40px)
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

/* Si tu n'as pas d'image, commente cette ligne :
const markerIcon = undefined;
*/


/* ---------------------
   5) Ajout du marqueur ("ping")
   --------------------- */

const marker = L.marker([CAPTEUR_LAT, CAPTEUR_LON], {
  icon: markerIcon
}).addTo(map);


/* ---------------------
   6) Popup d'information
   --------------------- */

marker.bindPopup(`
  <b>NebuleAir</b><br>
  Capteur extérieur JY2H<br>
  PM1.0 / PM2.5 / PM10<br>
  <span style="opacity:0.7;">Position géographique enregistrée</span>
`).openPopup();


// Fin du fichier map.js
