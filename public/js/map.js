function init() { 
    const IUTCoords = [43.34216594139032, 5.412780422391714];
    const zoomLevel = 17;
    const map = L.map('map').setView(IUTCoords, zoomLevel);

    const mainLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' });
    mainLayer.addTo(map);

    const marker = L.marker([43.34214, 5.412821], { icon: jy2h/public/img/JY2H-npm_ping.png }).addTo(map);
    marker.bindPopup(`JY2h-npm-01`).openPopup();


}
