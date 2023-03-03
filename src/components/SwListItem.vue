<script lang="ts" setup>
import { useLangStore } from '@/stores';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const router = useRouter();
const lang = computed(() => {
  return useLangStore().lang;
});
const openDetail = (data: any) => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  router.push(`/${language}/package-detail/${data.id}`);
};
</script>

<template>
  <div class="all" @click="openDetail(data)">
    <div class="content">
      <SwListItemContent :data="data"> </SwListItemContent>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all {
  border: 1px solid var(--o-color-transparent);
  &:hover {
    border: 1px solid var(--o-color-brand1);
  }
  cursor: pointer;
}
.content {
  background-color: var(--o-color-bg1);
  padding: var(--o-spacing-h5);
  border-left: 2px solid var(--o-color-brand2);
}
</style>
