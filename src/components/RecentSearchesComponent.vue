<script setup lang="ts">
import { ILocation } from '@/interfaces/ILocation';

const props = defineProps<{
  recentLocations: ILocation[];
  updateCurrentLocation: (location: ILocation) => void;
}>();
</script>

<template lang="">
  <div class="searches">
    <h1>Recent Searches</h1>
    <div class="recents">
      <div
        class="recent"
        v-for="(recent, index) in props.recentLocations"
        :key="index"
        @click="updateCurrentLocation(recent)"
      >
        {{
          recent.name.length + recent.subname.length > 15
            ? recent.name.toString() +
              (recent.subname != '' ? ' ( ' + recent.subname.toString() + ' )' : '').substring(
                0,
                15
              )
            : recent.name.toString() +
              (recent.subname != '' ? ' ( ' + recent.subname.toString() + ' )' : '')
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.searches {
  color: white;
  background-color: $dark;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem 0.5rem 1rem;

  h1 {
    margin: 0.5rem 0 0 0.5rem;
    font-size: $h1Size;
  }

  .recents {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    overflow-y: auto;
    overflow-x: hidden;

    .recent {
      font-weight: 600;
      padding: 1rem 0.5rem;
      border-radius: 5px;
      transition: background-color 250ms ease-in-out;

      &:hover {
        background-color: $light;
        cursor: pointer;
      }
    }
  }
}
</style>
