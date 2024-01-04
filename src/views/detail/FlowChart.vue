<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
const props = defineProps({
  data: {
    type: String,
    default: 'reviewing',
  },
});
const { t } = useI18n();
const getBoxColor = (type: string) => {
  if (props.data === type) {
    return {
      border: `1px solid #002FA7`,
      color: '#fff',
      'background-color': '#002FA7',
    };
  }
  return {};
};
</script>
<template>
  <div class="map-top">
    <div class="box">{{ t('software.SUBMIT') }}</div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #002fa7" />
    </svg>
    <div class="box" :style="getBoxColor('reviewing')">
      {{ t('software.APPROVAL') }}
    </div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #002fa7" />
    </svg>
    <div class="box" :style="getBoxColor('creating_repo')">
      {{ t('software.CREATEING_SOFTWARE') }}
    </div>
    <div class="line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #002fa7" />
    </svg>
    <div class="box" :style="getBoxColor('imported')">
      {{ t('software.INTRODUCED') }}
    </div>
    <div class="p-line"></div>
    <div class="v-line"></div>
    <div class="line closed-line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #002fa7" />
    </svg>
    <div class="box closed" :style="getBoxColor('closed')">
      {{ t('software.ENDED') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  padding-left: var(--o-gap-4);
  padding-right: var(--o-gap-4);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-h1);
  text-align: center;
  border: 1px solid #e1e6ee;
  color: #313131;
  background-color: #e1e6ee;
}
.line {
  width: 40px;
  height: 0;
  border-bottom: 1px solid;
  border-color: #002fa7;
}

.p-line {
  width: 0;
  height: 24px;
  border-left: 1px solid;
  border-color: #002fa7;
  grid-column-start: 4;
  justify-self: center;
}
.v-line {
  width: 50%;
  height: calc(50% + 1px);
  border-left: 1px solid;
  border-bottom: 1px solid;
  border-color: #002fa7;
  grid-column-start: 4;
  justify-self: right;
  align-self: flex-start;
}
.closed-line {
  width: 100%;
  grid-column-start: 5;
  grid-column-end: 9;
}
.closed {
  width: 100%;
  grid-column-start: 10;
  justify-self: center;
}
.map-top {
  display: grid;
  grid-template-columns: repeat(10, max-content);
  align-items: center;
}
</style>
