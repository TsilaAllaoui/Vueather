<script setup lang="ts">
import CurrentWeather from './CurrentWeather.vue';
import MapComponent from './MapComponent.vue';
</script>

<template>
  <div class="main">
    <CurrentWeather />
    <MapComponent />
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.main {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  flex-grow: 1;
  padding: 1rem;
  row-gap: 1rem;
  column-gap: 1rem;

  :nth-child(2) {
    grid-column-start: span 2;
  }

  :nth-child(5) {
    grid-column-start: span 3;
  }
}
</style>
