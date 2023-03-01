<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n();
</script>

<template>
  <div class="all">
    <div class="content">
      <SwListItemContent> </SwListItemContent>
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
