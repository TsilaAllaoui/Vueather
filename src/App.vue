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
</script>

<template>
  <HeaderComponent @current-location="updateCurrentLocation" />
  <MainComponent :currentLocation="currentLocation" />
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
