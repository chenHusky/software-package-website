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

const status = computed((): any => ({
  imported: {
    text: t('software.INTRODUCED'),
    color: '#002FA7',
  },
  reviewing: {
    text: t('software.APPROVAL'),
    color: '#FEAA11',
  },
  creating_repo: {
    text: t('software.CREATEING_SOFTWARE'),
    color: '#002FA7',
  },
  closed: {
    text: t('software.ENDED'),
    color: '#B2B2B2',
  },
}));

const statusDiv = computed(() => status.value[props.data]);
</script>

<template>
  <div class="tag" :style="{ backgroundColor: statusDiv.color }">
    {{ statusDiv.text }}
  </div>
</template>

<style lang="scss" scoped>
.tag {
  padding: var(--o-spacing-h10) var(--o-spacing-h8);
  color: var(--o-color-text2);
  font-size: var(--o-font-size-tip);
  line-height: var(--o-line-height-tip);
}
</style>
