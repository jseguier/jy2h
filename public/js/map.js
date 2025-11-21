function init() { 
    // Initialisation carte Leaflet
    const IUTCoords = [43.34216594139032, 5.412780422391714];
    const zoomLevel = 16.5;
    const map = L.map('map').setView(IUTCoords, zoomLevel);

    // Obligation
    const mainLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' });
    mainLayer.addTo(map);

    // Marqueur JY2H-npm-01
    const Icon = L.icon({iconUrl: 'public/img/JY2H-npm_ping.png', iconSize: [30, 30], popupAnchor: [0, -40]});

    const marker = L.marker([43.34214, 5.412821], { icon: Icon }).addTo(map);

    // Animation marqueur + texte
    marker.bindPopup(`JY2H-npm-01`);
    marker.on('mouseover', function () {this.openPopup();});
    marker.on('mouseout', function () {this.closePopup();});




}
