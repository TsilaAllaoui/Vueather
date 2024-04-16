<script setup lang="ts">
import { ref, onMounted } from 'vue';
import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const mapRoot = ref(null);

async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

onMounted(async () => {
  let latitude = 0;
  let longitude = 0;
  try {
    const position = await getCurrentPosition();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    const iconStyle = new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        scale: 0.5
      })
    });

    const locationFeature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude]))
    });

    locationFeature.setStyle(iconStyle);
  } catch (error) {
    console.error('Error getting user location:', error);
  }
  const map = new Map({
    target: mapRoot.value!,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([longitude, latitude]),
      zoom: 10,
      constrainResolution: true
    })
  });

  const iconStyle = new Style({
    image: new Icon({
      src: 'location.png',
      scale: 0.25
    })
  });

  const locationFeature = new Feature({
    geometry: new Point(fromLonLat([longitude, latitude]))
  });

  locationFeature.setStyle(iconStyle);

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [locationFeature]
    })
  });

  map.getView().animate({ center: fromLonLat([longitude, latitude]), zoom: 12 });
  map.addLayer(vectorLayer);
});
</script>

<template>
  <div ref="mapRoot" class="map" style="width: 100%; height: 100%"></div>
</template>

<style lang="scss">
.map {
  border-radius: 10px;
  overflow: hidden;
}
</style>
