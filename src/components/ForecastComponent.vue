<script setup lang="ts">
import { IForecast } from '@/interfaces/IForecast';

defineProps<{
  forecasts: IForecast[];
  unit: String;
}>();

function formatDate(dateString: string): string {
  const dateObj: Date = new Date(dateString);
  const day: string = dateObj.toLocaleString('en-US', { day: '2-digit' });
  const month: string = dateObj.toLocaleString('en-US', { month: 'short' });
  const dayOfWeek: string = dateObj.toLocaleString('en-US', { weekday: 'short' });

  return `${day} ${month}, ${dayOfWeek}`;
}
</script>

<template>
  <div v-if="forecasts.length > 0" class="forecasts">
    <p>Forecast</p>
    <div v-for="(forecast, index) in forecasts" :key="index" class="forecast">
      <div class="info">
        <img :src="forecast.icon.toString()" />
        <p>
          {{
            unit == 'c'
              ? forecast.min_temp_c + ' °C /' + forecast.max_temp_c + '°C'
              : forecast.min_temp_f + '°F /' + forecast.max_temp_f + '°F'
          }}
        </p>
      </div>
      <p>{{ formatDate(forecast.date.toString()) }}</p>
    </div>
  </div>
  <div v-else class="loading">
    <v-icon name="pr-spinner" animation="spin" scale="5" color="white" />
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';
.forecasts {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: $dark;
  border-radius: 10px;
  padding: 0 1rem;
  color: white;

  p {
    font-weight: 600;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
  }

  & > p {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 20px;
  }

  .forecast {
    width: 95%;
    display: flex;
    gap: 1rem;
    align-items: space-evenly;
    padding-bottom: 0.5rem;
    border-radius: 10px;

    &:hover {
      background-color: $main;
      transition: background-color 250ms ease-in-out;
    }

    .info {
      display: flex;
      align-items: center;
      gap: 1rem;

      img {
        width: 3rem;
        height: 3rem;
      }
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
