<script lang="ts" setup>
import { getLastTime } from '@/shared/utils';
import { toRefs } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { data } = toRefs(props);
</script>
<template>
  <div class="content">
    <div class="title">
      <ProfilePhoto :name="data.author"></ProfilePhoto>
      <div>
        <div class="name">{{ data.author }}</div>
        <div class="time">{{ getLastTime(data.created_at) }}</div>
      </div>
    </div>
    <div class="text">{{ data.content }}</div>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: var(--o-spacing-h5);
  border-bottom: 1px solid var(--o-color-division1);
  .title {
    padding-bottom: var(--o-spacing-h5);
    display: flex;
    align-items: center;
    font-size: var(--o-font-size-h7);
    gap: var(--o-spacing-h8);
    .name {
      font-size: var(--o-font-size-text);
      line-height: var(--o-line-height-text);
      color: var(--o-color-text1);
    }
    .time {
      font-size: var(--o-font-size-tip);
      line-height: var(--o-line-height-tip);
      color: var(--o-color-text4);
    }
  }
  .text {
    font-size: var(--o-font-size-text);
    white-space: pre-wrap;
  }
}
</style>
