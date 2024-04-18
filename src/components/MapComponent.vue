<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
import { ILocation } from '@/interfaces/ILocation';

const mapRoot = ref<HTMLElement | null>(null);
let map: Map | null = null;
let vectorLayer: VectorLayer<VectorSource<Feature<Point>>> | null = null;

const props = defineProps<{
  currentLocation: ILocation;
}>();

onMounted(async () => {
  await getCurrentPosition();
});

async function getCurrentPosition(): Promise<void> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;
    updateMap(latitude, longitude);
  } catch (error) {
    console.error('Error getting user location:', error);
  }
}

const updateMap = async (latitude: number, longitude: number): Promise<void> => {
  try {
    if (!map && mapRoot.value) {
      // Create the map if it doesn't exist and mapRoot is not null
      map = new Map({
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

      vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [locationFeature]
        })
      });

      map.addLayer(vectorLayer);
    } else if (map && mapRoot.value) {
      // Update map view and location feature if map and mapRoot are available
      map.getView().animate({ center: fromLonLat([longitude, latitude]), zoom: 12 });

      if (vectorLayer) {
        const source = vectorLayer.getSource();
        source!.clear();
        const locationFeature = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude]))
        });
        locationFeature.setStyle(
          new Style({
            image: new Icon({
              src: 'location.png',
              scale: 0.25
            })
          })
        );
        source!.addFeature(locationFeature);
      }
    }
  } catch (error) {
    console.error('Error updating map:', error);
  }
};

watch(mapRoot, (newMapRoot) => {
  if (newMapRoot && props.currentLocation.lat !== 0 && props.currentLocation.long !== 0) {
    updateMap(props.currentLocation.lat, props.currentLocation.long);
  }
});

watch(props.currentLocation, () => {
  if (props.currentLocation.lat !== 0 && props.currentLocation.long !== 0) {
    updateMap(props.currentLocation.lat, props.currentLocation.long);
  }
});
</script>

<template>
  <div
    v-if="props.currentLocation.name != ''"
    ref="mapRoot"
    class="map"
    style="width: 100%; height: 100%"
  ></div>
  <div v-else class="loading">
    <v-icon name="pr-spinner" animation="spin" scale="5" color="white" />
  </div>
</template>

<style lang="scss">
.map {
  border-radius: 10px;
  overflow: hidden;
}
</style>
