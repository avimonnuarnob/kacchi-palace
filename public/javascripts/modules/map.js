import axios from 'axios'
import { $ } from './bling'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXZpbW9ubnUiLCJhIjoiY2s2cTN1ZzZtMXN5bDNscXRhbG8yN290NSJ9.OViYUQHKMgMuhnASaPlEqA';

function loadPlaces(map, lat = 43.2 , lng = -79.8) {

    let stores = {
      type:"FeatureCollection",
      features:[]
  };

    axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
        .then(res => {
            const places = res.data
            if (!places.length) {
                alert('No place found!')
                return
            }

            places.map((place, i) => {
               let feature = {
                    type:"Feature",
                    geometry:{
                        type:"Point",
                        coordinates:[]
                    },
                    properties: {
                        name: place.name,
                        description: place.description,
                        slug: place.slug,
                        place
                    }
                }
                feature.geometry.coordinates.push(place.location.coordinates[0])
                feature.geometry.coordinates.push(place.location.coordinates[1])
                stores.features.push(feature)
            })
            console.log(stores)
            if (map.getLayer("locations")) {
              map.removeLayer("locations");
            }
            if (map.getSource("locations")) {
              map.removeSource("locations");
            }
            map.addLayer({
              "id": "locations",
              "type": "symbol",
              /* Add a GeoJSON source containing place coordinates and information. */
              "source": {
                "type": "geojson",
                "data": stores
              },
              "layout": {
                "icon-image": "restaurant-15",
                "icon-allow-overlap": true,
              }
            })
            showPlaces(map)
        })
}

function makeMap(mapdiv) {
if (!mapdiv) return
const map = new mapboxgl.Map({
    container: mapdiv,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-79.857, 43.256],
    zoom: 13
})

    loadPlaces(map)
    const input = $('[name="geolocate"]')
    var placesAutocomplete = places({
        appId: 'plJBGYBK32UT',
        apiKey: 'a5713d4be0b1cdd59f7891d0cd84ab3b',
        container: input
    });

    placesAutocomplete.on('change', function(e) {
      if(e.suggestion.value) {
        loadPlaces(map, e.suggestion.latlng.lat , e.suggestion.latlng.lng)  
        input.value = e.suggestion.value
        map.flyTo({
          center: [e.suggestion.latlng.lng, e.suggestion.latlng.lat],
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
          })
        }
    })
}

function showPlaces(map) {
  map.on('load', function (e) {
    /* Add the data to your map as a layer */
    map.on('click', function(e) {
        /* Determine if a feature in the "locations" layer exists at that point. */ 
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['locations']
        });
        
        /* If yes, then: */
        if (features.length) {
          var clickedPoint = features[0];
          
          /* Fly to the point */
          flyToStore(clickedPoint);
          
          /* Close all other popups and display popup for clicked store */
          createPopUp(clickedPoint);
          

        }

        function flyToStore(currentFeature) {
            map.flyTo({
              center: currentFeature.geometry.coordinates,
              zoom: 20
            });
          }
          
          function createPopUp(currentFeature) {
            var popUps = document.getElementsByClassName('mapboxgl-popup');
            /** Check if there is already a popup on the map and if so, remove it */
            if (popUps[0]) popUps[0].remove();
          
            var popup = new mapboxgl.Popup({ closeOnClick: false })
              .setLngLat(currentFeature.geometry.coordinates)
              .setHTML(
                `<a href="/stores/${currentFeature.properties.slug}"><h4 style="font-size: 2rem;">` + currentFeature.properties.name + `</h4></a>`
                )
              .addTo(map);
          }
        
      })

  })
}

export default makeMap