<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IWeather } from '../interfaces/IWeather';

defineProps<{ dataReady: boolean; weather: IWeather; unit: String }>();

const time = ref('');

const setTime = async () => {
  // Setting date
  const date = new Date();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  time.value =
    (hours < 10 ? `0${hours}` : hours.toString()) +
    ':' +
    (minutes < 10 ? `0${minutes}` : minutes.toString()) +
    (hours < 12 ? ' AM' : ' PM');
};

onMounted(() => setTime());
</script>

<template>
  <div v-if="dataReady" class="current-weather">
    <div class="header">
      <p><b>Current Weather</b></p>
      <p>{{ time }}</p>
    </div>
    <div class="condition">
      <img :src="weather.icon.toString()" />
      <div class="temp">
        <p>{{ unit == 'c' ? weather.temp_c : weather.temp_f }} <span>°C</span></p>
        <p>{{ weather.condition }}</p>
      </div>
    </div>
    <div class="infos">
      <div class="info">
        <v-icon name="md-waves" />
        <span>{{ weather.cloud }}</span>
      </div>
      <div class="info">
        <v-icon name="ri-drop-line" />
        <span>{{ weather.humidity }}</span>
      </div>
      <div class="info">
        <v-icon name="ri-windy-line" />
        <span>{{ weather.gust_kph }}</span>
      </div>
      <div class="info">
        <v-icon name="pr-sun" />
        <span>{{ weather.uv }}</span>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <v-icon name="pr-spinner" animation="spin" scale="5" color="white" />
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.current-weather,
.loading {
  padding: 1rem;
  background-color: $dark;
  border-radius: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  .header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;

    p {
      margin: 0;
    }
  }

  .condition {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 50%;
      height: 100%;
    }

    .temp {
      font-size: large;
      p {
        margin: 0;

        &:first-of-type {
          font-size: 5rem;
          font-weight: bolder;
          display: flex;
          gap: 1rem;

          span {
            font-size: 1.25rem;
          }
        }
      }
    }
  }

  .infos {
    display: flex;
    justify-content: space-between;

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        font-size: 1.25rem;
      }

      svg {
        width: 2rem;
        height: 2rem;
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
