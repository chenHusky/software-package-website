<script lang="ts" setup>
import AppContent from '@/components/AppContent.vue';
import { FormRadioConfig } from '@/shared/@types/formRadio.interface';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formRadioOption = computed((): FormRadioConfig[] => [
  {
    label: t('software.CLASSIFY'),
    id: 'metrics',
    options: [
      { label: t('software.ALL'), value: 'pr' },
      { label: t('software.MINE'), value: 'issue' },
    ],
  },
  {
    label: t('software.STATE'),
    id: 'interval',
    showDoneIcon: true,
    options: [
      { label: t('software.INTRODUCED'), value: '1d' },
      { label: t('software.APPROVAL'), value: '1w' },
      { label: t('software.CREATEING_SOFTWARE'), value: '1M' },
      { label: t('software.ENDED'), value: '1M1' },
    ],
  },
]);

const formRadioValue = ref({
  metrics: 'pr',
  interval: '1d',
});

const initData = () => {
  console.log('in');
};
</script>
<template>
  <div class="package">
    <AppContent>
      <OCard class="filter">
        <FormRadio
          v-model="formRadioValue"
          :option="formRadioOption"
          @change="initData"
        ></FormRadio>
      </OCard>
      <OCard>
        <el-scrollbar class="Escrollbar">
          <div class="list">
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
            <SwListItem></SwListItem>
          </div>
        </el-scrollbar>
      </OCard>
    </AppContent>
  </div>
</template>

<style scoped lang="scss">
:deep(.app-content) {
  @media screen and (max-width: 1620px) {
    width: calc(100% - 48px);
  }
  .filter {
    margin-bottom: var(--o-spacing-h4);
  }
  .list {
    display: grid;
    row-gap: 8px;
    max-height: 600px;
  }
}
</style>
