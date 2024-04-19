<script setup lang="ts">
import { ILocation } from '@/interfaces/ILocation';
import { reactive, ref, watch, defineEmits, onMounted } from 'vue';

const searchValue = ref<String>('');
const locations: ILocation[] = reactive<ILocation[]>([]);
const currentLocation: ILocation = reactive<ILocation>({
  name: '',
  subname: '',
  url: '',
  lat: 0,
  long: 0
});

const hideSuggestion = () => {
  while (locations.length > 0) {
    locations.pop();
  }
};

watch(
  searchValue,
  async () => {
    while (locations.length > 0) {
      locations.pop();
    }

    const url = new URL(import.meta.env.VITE_VUE_APP_API_URL + 'search.json');
    url.searchParams.append('key', import.meta.env.VITE_VUE_APP_API_KEY);
    url.searchParams.append('q', searchValue.value.toString());

    const locationNames: String[] = [];

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 1) {
          for (let i = 0; i < data.length; i++) {
            const location = data[i];
            const subs = location.url.split('-');
            locations.push({
              name: location.name,
              subname:
                subs.length > 1
                  ? locationNames.find((name) => location.name == name)
                    ? ''
                    : subs[1][0].toUpperCase() + subs[1].substring(1)
                  : '',
              lat: location.lat,
              long: location.lon,
              url: location.url
            });
            locationNames.push(location.name);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  { deep: true }
);

const emit = defineEmits(['updateCurrentLocation', 'updateRecentLocations']);

const updateCurrentLocation = (location: ILocation) => {
  currentLocation.name = location.name;
  currentLocation.subname = location.subname;
  currentLocation.url = location.url;
  currentLocation.lat = location.lat;
  currentLocation.long = location.long;

  while (locations.length > 0) {
    locations.pop();
  }

  if (currentLocation) {
    emit('updateCurrentLocation', currentLocation);
    emit('updateRecentLocations', currentLocation);
  }
};

const triggerSearch = (event: any) => {
  searchValue.value = event.target.value;
};

onMounted(() => {
  fetch(import.meta.env.VITE_VUE_APP_IP_API_URL).then((res) => {
    res.json().then((data) => {
      const ip = data.ip;

      // Getting weather
      const url = new URL(import.meta.env.VITE_VUE_APP_API_URL + 'current.json');
      url.searchParams.append('key', import.meta.env.VITE_VUE_APP_API_KEY);
      url.searchParams.append('q', ip);

      fetch(url.toString())
        .then((res) => res.json())
        .then((data) => {
          const url = data.location.region.toLowerCase().replace(' ', '-');
          const location: ILocation = {
            name: data.location.name,
            lat: data.location.lat,
            long: data.location.lon,
            subname: data.location.country,
            url: url
          };
          updateCurrentLocation(location);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  emit('updateRecentLocations');
});
</script>

<template>
  <div class="header">
    <div class="search">
      <div class="input">
        <v-icon name="ri-search-2-line" scale="1.25" />
        <input
          type="text"
          placeholder="Search for location"
          v-model="searchValue"
          @focus="triggerSearch($event)"
        />
      </div>
      <div v-if="locations.length > 0" class="results" @mouseleave="hideSuggestion">
        <p
          v-for="(location, index) in locations"
          :key="index"
          @click="updateCurrentLocation(location)"
        >
          {{
            location.name.length + location.subname.length > 15
              ? location.name.toString() +
                (location.subname != ''
                  ? ' ( ' + location.subname.toString() + ' )'
                  : ''
                ).substring(0, 15)
              : location.name.toString() +
                (location.subname != '' ? ' ( ' + location.subname.toString() + ' )' : '')
          }}
        </p>
      </div>
    </div>
    <p class="location-name">{{ currentLocation?.name }}</p>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 1rem;

  svg {
    color: white;
  }

  .location-name {
    color: white;
    font-size: 25px;
    font-weight: bold;
    position: absolute;
    left: 50%;
  }

  .search {
    position: relative;
    margin: 1rem 0;

    .input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: $dark;
      border-radius: 10px;
      height: 60%;
      padding: 0 0.5rem;

      input {
        outline: none;
        border: none;
        background-color: transparent;
        height: 2rem;
        text-align: center;
        color: white;

        &::placeholder {
          color: rgba(245, 245, 245, 0.486);
        }
      }
    }

    .results {
      margin: 1rem 0;
      border-radius: 10px;
      width: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0;
      color: white;
      font-weight: 600;

      p {
        margin: 0 0.5rem;
        padding: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 250ms;

        &:hover {
          background-color: $dark;
        }
      }

      background-color: $light;
    }
  }
}
</style>
