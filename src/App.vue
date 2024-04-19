<script setup lang="ts">
import { reactive } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import MainComponent from './components/MainComponent.vue';
import { ILocation } from './interfaces/ILocation';

const currentLocation: ILocation = reactive<ILocation>({
  name: '',
  subname: '',
  url: '',
  lat: 0,
  long: 0
});

const updateCurrentLocation = (location: ILocation) => {
  currentLocation.name = location.name;
  currentLocation.subname = location.subname;
  currentLocation.url = location.url;
  currentLocation.lat = location.lat;
  currentLocation.long = location.long;
};

const recentLocations: ILocation[] = reactive<ILocation[]>([]);

const upadetRecentLocations = (newLocation?: ILocation) => {
  if (!newLocation) {
    return;
  }

  const recentsInCache = localStorage.getItem('recents');

  if (!recentsInCache) {
    localStorage.setItem('recents', '');
    recentLocations.push(newLocation!);
    localStorage.setItem('recents', JSON.stringify(newLocation));
    return;
  }

  const recentsArray = recentsInCache!.split('||');
  if (recentsArray.includes(JSON.stringify(location))) {
    return;
  }

  while (recentLocations.length > 0) {
    recentLocations.pop();
  }

  recentsInCache!.split('||').forEach((location) => {
    const locationItem: ILocation = JSON.parse(location);
    recentLocations.push(locationItem);
  });

  recentLocations.push(newLocation);
  localStorage.setItem(
    'recents',
    localStorage.getItem('recents') + '||' + JSON.stringify(newLocation)
  );
};
</script>

<template>
  <HeaderComponent
    @updateCurrentLocation="updateCurrentLocation"
    @updateRecentLocations="upadetRecentLocations"
  />
  <MainComponent
    :currentLocation="currentLocation"
    :recentLocations="recentLocations"
    @updateCurrentLocation="updateCurrentLocation"
  />
</template>

<style lang="scss">
@import './assets/variables.scss';

body {
  margin: 0;
  height: 100vh;
  width: 100vw;
  background-color: $main;

  * {
    font-family: 'Ubuntu';
  }

  #app {
    display: flex !important;
    flex-direction: column;
    height: 100%;
  }
}
</style>
