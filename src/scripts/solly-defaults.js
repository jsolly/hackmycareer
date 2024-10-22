const sollyDefaults = {
	includeKeywords: [
		"GIS",
		"Architect",
		"Senior",
		"Principle",
		"Staff",
		"Lead",
		"Developer",
		"Spatial",
		"Satellite",
		"Geospatial",
		"OpenLayers",
		"Leaflet",
		"GDAL",
		"PostGIS",
		"GeoPandas",
		"Turf.js",
		"Geoserver",
		"Rasterio",
		"Mapbox GL",
		"HERE",
		"GeoJSON",
		"AWS",
		"Digital Twin",
	],
	excludeKeywords: ["Specialist", "Landscape", "Consultant"],
	includeCompanies: [],
	excludeCompanies: [],
};

document.addEventListener("DOMContentLoaded", () => {
	const applyDefaultsButton = document.getElementById("apply-defaults-button");

	applyDefaultsButton.addEventListener("click", () => {
		document.getElementById("include-keywords").value =
			sollyDefaults.includeKeywords.join(", ");
		document.getElementById("exclude-keywords").value =
			sollyDefaults.excludeKeywords.join(", ");
		document.getElementById("include-companies").value =
			sollyDefaults.includeCompanies.join(", ");
		document.getElementById("exclude-companies").value =
			sollyDefaults.excludeCompanies.join(", ");

		// Trigger the query update
		document
			.getElementById("include-keywords")
			.dispatchEvent(new Event("input"));
	});
});
