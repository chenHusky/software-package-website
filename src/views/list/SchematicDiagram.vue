<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="map-top">
    <div class="box">{{ t('software.SUBMIT') }}</div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #0041bd" />
    </svg>
    <div class="box">{{ t('software.APPROVAL') }}</div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #0041bd" />
    </svg>
    <div class="box">{{ t('software.CREATEING_SOFTWARE') }}</div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #0041bd" />
    </svg>
    <div class="box">{{ t('software.INTRODUCED') }}</div>
    <div class="v-line closed"></div>
    <svg
      class="closed"
      width="10"
      height="10"
      version="1.1"
      view-box="0 0 10 10"
    >
      <path d="M0,0 L10,0 L5,10 Z" style="fill: #0041bd" />
    </svg>
    <div class="box closed">{{ t('software.ENDED') }}</div>
  </div>
</template>

<style scoped lang="scss">
.box {
  padding-left: var(--o-gap-4);
  padding-right: var(--o-gap-4);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-h3);
  text-align: center;
  border: 1px solid #0041bd;
  color: #313131;
  background-color: #e1e6ee;
}
.line {
  width: 40px;
  height: 1px;
  background-color: #0041bd;
}
.v-line {
  width: 1px;
  height: 24px;
  background-color: #0041bd;
}
.closed {
  grid-column-start: 4;
  grid-column-end: 5;
  justify-self: center;
}
.map-top {
  display: grid;
  grid-template-columns: repeat(10, max-content);
  align-items: center;
}
</style>
