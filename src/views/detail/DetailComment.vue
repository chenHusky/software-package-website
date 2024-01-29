<script lang="ts" setup>
import { translateComment } from '@/api/api-package';
import { useStoreData } from '@/shared/login';
import { handleMarkdown } from '@/shared/mkit';
import { useLangStore } from '@/stores';
import { computed, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import IconTranslate from '~icons/app/icon-translate.svg';
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
console.log(data.value.content)
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
        <div class="time">{{ data.created_at }}</div>
      </div>
    </div>
    <div v-dompurify-html="handleMarkdown(data.content)" class="md-txt"></div>
    <div v-if="translateData" v-dompurify-html="handleMarkdown(translateData)" class="md-txt translate-text"></div>
    <div v-if="guardAuthClient.username && !translateData" class="operate">
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
:deep(.md-txt) {
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
  table {
    display: block;
    width: 100%;
    overflow: auto;
    border-collapse: collapse;
    border-spacing: 0;
    tr {
      background-color: var(--o-color-bg2);
      border-top: 1px solid var(--o-color-border2);
      th {
        padding: 6px 13px;
        border: 1px solid var(--o-color-border2);
        font-weight: 600;
      }
      td {
        padding: 6px 13px;
        border: 1px solid var(--o-color-border2);
      }
    };
    tr:nth-child(2n) {
      background-color: var(--o-color-bg3);
    }
  }
}

</style>
