function init() { 
    const IUTCoords = [48.8566, 2.3522];
    const zoomLevel = 13;
    const map = L.map('map').setView(IUTCoords, zoomLevel);

    const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' });
    mainLayer.addTo(map);

}
