// js/map.js
// Map initialization and marker logic.
// Depends on: Leaflet (global L)
// showBases(countryCode, dataset) — dataset is whichever window.* the UI passes in

var map = L.map('map', {
    zoomControl: false
}).setView([20, 0], 2);

L.control.zoom({ position: 'bottomleft' }).addTo(map);
L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri & OSINT Observer'
}).addTo(map);

var markersLayer = L.layerGroup().addTo(map);

var coordsDisplay = document.getElementById('coords-info');
map.on('mousemove', function(e) {
    coordsDisplay.innerHTML = 'LAT: ' + e.latlng.lat.toFixed(4) + ' | LNG: ' + e.latlng.lng.toFixed(4);
});

// dataset is explicitly passed in by ui.js — no hardcoded global reference here
function showBases(countryCode, dataset) {
    markersLayer.clearLayers();
    var baseContainer = document.getElementById('base-container');
    var baseSelect = document.getElementById('base-select');

    baseSelect.innerHTML = '<option value="">-- SELECT TARGET --</option>';

    if (!countryCode || !dataset[countryCode]) {
        baseContainer.style.display = 'none';
        return;
    }

    var latlngs = [];
    dataset[countryCode].forEach(function(b, i) {
        var marker = L.marker([b.lat, b.lng])
            .bindPopup(
                '<div style="color:white"><b>BASE:</b> ' + b.name + '<br><b>COORDS:</b> ' + b.lat + ', ' + b.lng + '</div>',
                { autoPan: false }
            )
            .addTo(markersLayer);

        b.marker = marker;
        latlngs.push([b.lat, b.lng]);

        var opt = document.createElement('option');
        opt.value = i;
        opt.text = b.name.toUpperCase();
        baseSelect.appendChild(opt);
    });

    baseContainer.style.display = 'block';
    var bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds.pad(0.2), { animate: true });
}

function resetMap() {
    document.getElementById('country-select').value = '';
    document.getElementById('facility-container').style.display = 'none';
    document.getElementById('base-container').style.display = 'none';
    markersLayer.clearLayers();
    map.setView([20, 0], 2);
}
