/* global L */

// TODO: decouple from personal account.
const accessToken =
    "pk.eyJ1IjoibGFzc2VndWwiLCJhIjoiQVNxTklPSSJ9.WGPBVU6BcFO8ptFvjWpiDA";

// let mymap = null;
let mymap = null;

let cachedFloodGeojson = null;

export function renderFloodMap(mapid, geojson = null) {
    if (geojson) {
        cachedFloodGeojson = geojson;
        if (!mymap) {
            mymap = L.map(mapid);
        } else {
            mymap.remove();
            mymap = L.map(mapid);
        }
    } else {
        geojson = cachedFloodGeojson;
    }

    // TODO: don't rebuild layers all the time, instead toggle?
    mymap.eachLayer(layer => {
        console.log(layer);
        mymap.removeLayer(layer);
    });

    const tiffUrl = "http://127.0.0.1:8888/wind_speed.tif";

    const tiffLayer = L.leafletGeotiff(tiffUrl, {
        renderer: null
    }).addTo(mymap);

    mymap.fitBounds(
        L.geoJSON(geojson, {
            color: "#333",
            filter: feature => {
                return true; // feature.properties.featurecla == "Coastline";
            }
        })
            .addTo(mymap)
            .getBounds()
    );

    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox/streets-v11",
            accessToken
        }
    ).addTo(mymap);

    L.marker([-17.6207203, 177.4359126]).addTo(mymap);

    mymap.on("click", e => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    });
}
