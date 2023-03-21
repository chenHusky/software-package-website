<script lang="ts" setup>
import { translateComment } from '@/api/api-package';
import { useStoreData } from '@/shared/login';
import { getLastTime } from '@/shared/utils';
import { useLangStore } from '@/stores';
import { computed, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import IconTranslate from '~icons/app/icon-link.svg';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { guardAuthClient } = useStoreData();
const route = useRoute();
const lang = computed(() => {
  return useLangStore().lang;
});
const translateData = ref('');
const { data } = toRefs(props);
const translate = () => {
  const obj = {
    id: route.params.id,
    cid: data.value.id,
  };
  const param = {
    language: lang.value === 'zh' ? 'chinese' : 'english',
  };
  translateComment(obj, param).then((res) => {
    translateData.value = res?.data?.content || '';
  });
};
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
    <div v-if="translateData" class="translate-text text">
      {{ translateData }}
    </div>
    <div v-if="guardAuthClient.username" class="operate">
      <OIcon class="translate-btn" @click="translate">
        <IconTranslate></IconTranslate>
      </OIcon>
    </div>
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
  .translate-text {
    border-top: 1px solid var(--o-color-division1);
    padding-top: var(--o-gap-2);
    margin-top: var(--o-gap-2);
  }
  .operate {
    display: flex;
    justify-content: end;
  }
  .translate-btn {
    cursor: pointer;
    font-size: var(--o-font_size-h2);
  }
}
</style>
