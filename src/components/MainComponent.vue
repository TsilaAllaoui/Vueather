<script setup lang="ts">
import CurrentWeather from './CurrentWeatherComponent.vue';
import ForecastComponent from './ForecastComponent.vue';
import MapComponent from './MapComponent.vue';
import { ref, reactive, watch } from 'vue';
import { IWeather } from '@/interfaces/IWeather';
import { IForecast } from '@/interfaces/IForecast';
import { IHourlyForecast } from '@/interfaces/IHourlyForecast';
import HourlyForecastComponent from './HourlyForecastComponent.vue';
import { ILocation } from '@/interfaces/ILocation';
import RecentSearches from './RecentSearchesComponent.vue';

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

const dataReady = ref(false);
const unit = ref('c');
const forecasts: IForecast[] = reactive([]);
const todayHourlyForecasts: IHourlyForecast[] = reactive([]);

const props = defineProps<{
  currentLocation: ILocation;
  recentLocations: ILocation[];
}>();

const getWeatherInfos = () => {
  fetch(import.meta.env.VITE_VUE_APP_IP_API_URL)
    .then((res) =>
      res.json().then((data) => {
        const ip = data.ip;

        // Getting weather
        const url = new URL(import.meta.env.VITE_VUE_APP_API_URL + 'current.json');
        url.searchParams.append('key', import.meta.env.VITE_VUE_APP_API_KEY);
        url.searchParams.append(
          'q',
          props.currentLocation && props.currentLocation.name == ''
            ? ip
            : props.currentLocation.lat + ',' + props.currentLocation.long
        );

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
          })
          .catch((err) => {
            console.log(err);
          });

        // Getting daily forecast
        const urlForecasts = new URL(import.meta.env.VITE_VUE_APP_API_URL + 'forecast.json');
        urlForecasts.searchParams.append('key', import.meta.env.VITE_VUE_APP_API_KEY);
        urlForecasts.searchParams.append(
          'q',
          props.currentLocation && props.currentLocation.name == ''
            ? ip
            : props.currentLocation.lat + ',' + props.currentLocation.long
        );
        urlForecasts.searchParams.append('days', '6');

        fetch(urlForecasts.toString())
          .then((res) => res.json())
          .then((data) => {
            while (forecasts.length > 0) {
              forecasts.pop();
            }

            while (todayHourlyForecasts.length > 0) {
              todayHourlyForecasts.pop();
            }

            const forecastdays = data.forecast.forecastday;
            forecastdays.forEach((forecastday: any, index: number) => {
              if (index == 0) {
                const hourlyForecasts: any[] = forecastday.hour;
                hourlyForecasts.forEach((data) => {
                  const hourlyForecast = {
                    time: data.time.split(' ')[1],
                    temp_c: data.temp_c,
                    temp_f: data.temp_f,
                    icon: data.condition.icon,
                    condition: data.condition.text
                  };

                  todayHourlyForecasts.push(hourlyForecast);
                });
              }

              const forecast: IForecast = {
                icon: forecastday.day.condition.icon,
                min_temp_c: forecastday.day.mintemp_c,
                max_temp_c: forecastday.day.maxtemp_c,
                min_temp_f: forecastday.day.mintemp_f,
                max_temp_f: forecastday.day.maxtemp_f,
                date: forecastday.date
              };

              forecasts.push(forecast);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

watch(props.currentLocation, () => getWeatherInfos());

const emit = defineEmits(['updateCurrentLocation']);

const updateCurrentLocation = (newLocation: ILocation) => {
  emit('updateCurrentLocation', newLocation);
};
</script>

<template>
  <div class="main">
    <CurrentWeather :dataReady="dataReady" :weather="weather" :unit="unit" />
    <MapComponent :currentLocation="currentLocation" />
    <RecentSearches
      :recentLocations="props.recentLocations"
      :updateCurrentLocation="updateCurrentLocation"
    />
    <ForecastComponent :forecasts="forecasts" :unit="unit" />
    <HourlyForecastComponent :todayHourlyForecasts="todayHourlyForecasts" :unit="unit" />
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
  overflow: hidden;

  :nth-child(2) {
    grid-column-start: span 2;
  }

  :nth-child(5) {
    grid-column-start: span 3;
  }
}
</style>
