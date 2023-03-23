<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLangStore } from '@/stores';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import { refreshInfo } from '@/shared/login';

refreshInfo();
const { locale } = useI18n();
const langStore = useLangStore();
watch(
  () => langStore.lang,
  (val) => {
    locale.value = val;
  }
);
</script>

<template>
  <header><AppHeader /></header>
  <main class="software-main"><RouterView></RouterView></main>
  <footer><AppFooter /></footer>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: url(@/assets/category/background.png);
  background-position: center top;
  background-size: cover;
  background-repeat: repeat;
  background-color: rgb(1, 10, 51);
}

.software-main {
  position: relative;
  min-height: calc(100vh - 339px);
  overflow: hidden;

  @media (max-width: 1100px) {
    margin-top: 48px;
  }
}
</style>
