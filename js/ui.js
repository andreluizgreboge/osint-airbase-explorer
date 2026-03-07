// js/ui.js
// UI event wiring.
// Depends on: showBases() and resetMap() defined in js/map.js
// Depends on: window.airbases, window.navalBases, window.radarMissileSites

// Returns the correct dataset object based on the facility selector
function getActiveDataset() {
    var facilityType = document.getElementById('facility-select').value;
    if (facilityType === 'naval')         return window.navalBases;
    if (facilityType === 'radar_missile') return window.radarMissileSites;
    return window.airbases; // default
}

// When the country changes: show the facility selector, then populate bases
document.getElementById('country-select').addEventListener('change', function(e) {
    var countryCode = e.target.value;
    var facilityContainer = document.getElementById('facility-container');

    if (!countryCode) {
        facilityContainer.style.display = 'none';
        resetMap();
        return;
    }

    facilityContainer.style.display = 'block';
    showBases(countryCode, getActiveDataset());
});

// When the facility type changes: re-populate bases for the current country
document.getElementById('facility-select').addEventListener('change', function() {
    var countryCode = document.getElementById('country-select').value;
    if (!countryCode) return;
    showBases(countryCode, getActiveDataset());
});

// When a specific base is selected: tactical zoom + popup
document.getElementById('base-select').addEventListener('change', function(e) {
    var countryCode = document.getElementById('country-select').value;
    var idx = parseInt(e.target.value);
    if (isNaN(idx)) return;

    var dataset = getActiveDataset();
    var b = dataset[countryCode][idx];

    // Tactical zoom to level 14, centered exactly on the facility
    map.setView([b.lat, b.lng], 14, { animate: true });

    // Open popup without disrupting the centering
    b.marker.openPopup();
});
