<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps({
  data: {
    type: String,
    default: 'reviewing',
  },
});
const { t } = useI18n();
const status: any = {
  reviewing: {
    completeArr: [],
    color: '#FEAA11',
  },
  creating_repo: {
    completeArr: ['reviewing'],
    color: '#002FA7',
  },
  imported: {
    completeArr: ['reviewing', 'creating_repo'],
    color: '#002FA7',
  },
  closed: {
    completeArr: ['reviewing', 'closed'],
    color: '#B2B2B2',
  },
};
const sucessStaus = computed(
  () => status[props.data]?.completeArr || status.reviewing.completeArr
);
const getSvgColor = (type: string) => {
  if (sucessStaus.value.includes(type)) {
    return '#6dc335';
  } else if (props.data === type) {
    const color = status[type]?.color;
    return color;
  }
  return '#cccccc';
};
const getBoxColor = (type: string) => {
  if (sucessStaus.value.includes(type)) {
    return {
      border: '1px solid #6dc335',
      color: '#fff',
      'background-color': '#6dc335',
    };
  } else if (props.data === type) {
    const color = status[type]?.color;
    return {
      border: `1px solid ${color}`,
      color: '#fff',
      'background-color': color,
    };
  }
  return {};
};
const getLineColor = (type: string) => {
  if (sucessStaus.value.includes(type)) {
    return {
      'border-color': '#6dc335',
    };
  } else if (props.data === type) {
    const color = status[type]?.color;
    return {
      'border-color': color,
    };
  }
  return {};
};
</script>
<template>
  <div class="map-top">
    <div class="box success-box">{{ t('software.SUBMIT') }}</div>
    <div class="line success-line"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" style="fill: #6dc335" />
    </svg>
    <div class="box" :style="getBoxColor('reviewing')">
      {{ t('software.APPROVAL') }}
    </div>
    <div class="line" :style="getLineColor('reviewing')"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path
        d="M0,0 L0,10 L10,5 Z"
        :style="{ fill: getSvgColor('reviewing') }"
      />
    </svg>
    <div class="box" :style="getBoxColor('creating_repo')">
      {{ t('software.CREATEING_SOFTWARE') }}
    </div>
    <div class="line" :style="getLineColor('creating_repo')"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path
        d="M0,0 L0,10 L10,5 Z"
        :style="{ fill: getSvgColor('creating_repo') }"
      />
    </svg>
    <div class="box" :style="getBoxColor('imported')">
      {{ t('software.INTRODUCED') }}
    </div>
    <div class="p-line" :style="getLineColor('closed')"></div>
    <div class="v-line" :style="getLineColor('closed')"></div>
    <div class="line closed-line" :style="getLineColor('closed')"></div>
    <svg width="10" height="10" version="1.1" view-box="0 0 10 10">
      <path d="M0,0 L0,10 L10,5 Z" :style="{ fill: getSvgColor('closed') }" />
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
.success-box {
  border: 1px solid #6dc335;
  color: #fff;
  background-color: #6dc335;
}
.waiting-box {
  border: 1px solid #feb32a;
  color: #fff;
  background-color: #feb32a;
}
.line {
  width: 40px;
  height: 0;
  border-bottom: 1px solid;
  border-color: #cccccc;
}

.p-line {
  width: 0;
  height: 24px;
  border-left: 1px solid;
  border-color: #cccccc;
  grid-column-start: 4;
  justify-self: center;
}
.v-line {
  width: 50%;
  height: calc(50% + 1px);
  border-left: 1px solid;
  border-bottom: 1px solid;
  border-color: #cccccc;
  grid-column-start: 4;
  justify-self: right;
  align-self: flex-start;
}
.success-line {
  border-color: #6dc335;
}
.waiting-line {
  border-color: #feb32a;
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
