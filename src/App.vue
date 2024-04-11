<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import MainComponent from './components/MainComponent.vue'
</script>

<template>
  <HeaderComponent />
  <MainComponent />
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
