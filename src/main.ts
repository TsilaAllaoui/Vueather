import { createApp } from 'vue';
import App from './App.vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiSearch2Line,
  HiBell,
  MdWaves,
  RiDropLine,
  RiWindyLine,
  PrSun,
  PrSpinner
} from 'oh-vue-icons/icons';

addIcons(RiSearch2Line, HiBell, MdWaves, RiDropLine, RiWindyLine, PrSun, PrSpinner);

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.mount('#app');
