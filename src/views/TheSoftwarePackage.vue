<script lang="ts" setup>
import AppContent from '@/components/AppContent.vue';
import ReviewingList from './list/ReviewingList.vue';
import ImportedList from './list/ImportedList.vue';
import SchematicDiagram from './list/SchematicDiagram.vue';
import { FormRadioConfig } from '@/shared/@types/formRadio.interface';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStoreData } from '@/shared/login';

const { t } = useI18n();
const { guardAuthClient } = useStoreData();

const formRadioOption = computed((): FormRadioConfig[] => [
  {
    label: t('software.CLASSIFY'),
    id: 'importer',
    options: guardAuthClient.value.username
      ? [
          { label: t('software.ALL'), value: 'all' },
          { label: t('software.MINE'), value: 'mine' },
        ]
      : [{ label: t('software.ALL'), value: 'all' }],
  },
  {
    label: t('software.STATE'),
    id: 'phase',
    showDoneIcon: true,
    options: [
      { label: t('software.INTRODUCED'), value: 'imported' },
      { label: t('software.APPROVAL'), value: 'reviewing' },
      { label: t('software.CREATEING_SOFTWARE'), value: 'creating_repo' },
      { label: t('software.ENDED'), value: 'closed' },
    ],
  },
]);

const formRadioValue = ref({
  importer: 'all',
  phase: 'reviewing',
});
</script>
<template>
  <div class="package">
    <AppContent>
      <OCard class="filter">
        <div class="filter-header">
          <FormRadio
            v-model="formRadioValue"
            :option="formRadioOption"
          ></FormRadio>
          <SchematicDiagram></SchematicDiagram>
        </div>
      </OCard>
      <OCard>
        <ImportedList
          v-if="formRadioValue.phase === 'imported'"
          :importer="formRadioValue.importer"
        ></ImportedList>
        <ReviewingList v-else :params="formRadioValue"> </ReviewingList>
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
  .filter-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
