<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const time = ref('');
const dataReady = ref(false);

interface IWeather {
  locationName: String;
  region: String;
  country: String;
  temp_f: number;
  temp_c: number;
  is_day: boolean;
  condition: String;
  icon: String;
  humidity: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
  cloud: number;
}

const weather: IWeather = reactive({
  locationName: '',
  region: '',
  country: '',
  temp_f: -1,
  temp_c: -1,
  is_day: false,
  condition: '',
  icon: '',
  humidity: -1,
  gust_mph: -1,
  gust_kph: -1,
  uv: -1,
  cloud: -1
});

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

  // Getting weather
  fetch(import.meta.env.VITE_VUE_APP_IP_API_URL)
    .then((res) =>
      res.json().then((data) => {
        const ip = data.ip;

        const url = new URL(import.meta.env.VITE_VUE_APP_API_URL + 'current.json');
        url.searchParams.append('key', import.meta.env.VITE_VUE_APP_API_KEY);
        url.searchParams.append('q', ip);

        fetch(url.toString())
          .then((res) => res.json())
          .then((data) => {
            weather.cloud = data.current.cloud;
            weather.condition = data.current.condition.text;
            weather.country = data.location.country;
            weather.gust_kph = data.current.gust_kph;
            weather.gust_mph = data.current.gust_mph;
            weather.humidity = data.current.humidity;
            weather.icon = data.current.condition.icon;
            weather.is_day = data.current.is_day;
            weather.locationName = data.location.name;
            weather.region = data.location.region;
            weather.temp_c = data.current.temp_c;
            weather.temp_f = data.current.temp_f;
            weather.uv = data.current.uv;

            dataReady.value = true;

            console.log(weather);
          })
          .catch((err) => console.log(err));
      })
    )
    .catch((err) => console.log(err));
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
        <p>{{ weather.temp_c }} <span>°C</span></p>
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
    <v-icon name="pr-spinner" animation="spin" scale="5" />
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
