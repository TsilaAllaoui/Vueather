<script setup lang="ts">
import { IHourlyForecast } from '@/interfaces/IHourlyForecast';
import { ref } from 'vue';

const date = ref('Today');
defineProps<{
  unit: String;
  todayHourlyForecasts: IHourlyForecast[];
}>();
</script>

<template>
  <div v-if="todayHourlyForecasts.length > 0" class="summary">
    <div class="header">
      <h1>Summary</h1>
      <h2>{{ date }}</h2>
    </div>
    <div class="hourly-forecasts">
      <div v-for="(forecast, index) in todayHourlyForecasts" :key="index" class="hourly-forecast">
        <div
          v-show="index % 3 == 0 || index == todayHourlyForecasts.length - 1"
          class="hour"
          :title="forecast.condition.toString()"
        >
          <p>{{ forecast.time }}</p>
          <p class="temp">{{ unit == 'c' ? forecast.temp_c + '°C' : forecast.temp_f + '°F' }}</p>
          <img :src="forecast.icon.toString()" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <v-icon name="pr-spinner" animation="spin" scale="5" color="white" />
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.summary {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $dark;
  border-radius: 10px;
  color: white;
  background-image: url('background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.85;

  p,
  h1,
  h2 {
    margin: 0;
    padding: 0;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      margin: 1rem;
    }

    h2 {
      margin: 0 auto;
    }
  }

  .hourly-forecasts {
    padding: 0 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-grow: 1;

    .hourly-forecast {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: transform 350ms ease-in-out;

      &:hover {
        transform: scale(1.5);

        .hour {
          background-color: $main;
        }
      }

      .hour {
        background-color: $light;
        padding: 1rem;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }
    }

    p {
      font-size: larger;
    }
  }
}
</style>
