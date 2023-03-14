<script lang="ts" setup>
import { querySoftwareList } from '@/api/api-package';
import { ProTableColConfig } from '@/shared/@types/protable.interface';
import { ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  importer: {
    type: String,
    default: 'all',
  },
});

const { t } = useI18n();

const tableConfig = ref<ProTableColConfig[]>([
  {
    key: 'pkg_name',
    label: t('software.NAME'),
  },
  {
    key: 'desc',
    label: t('software.DESC'),
  },
  {
    key: 'sig',
    label: 'SIG',
  },
  {
    key: 'platform',
    label: t('software.PLATFORM'),
    filtersConfig: {
      select: {
        options: [
          {
            label: 'Gitee',
            value: 'gitee',
          },
          {
            label: 'Github',
            value: 'github',
          },
        ],
      },
    },
  },
  {
    key: 'importer',
    label: t('software.SUBMITTER'),
  },
  {
    key: 'source_code',
    label: t('software.SOURCE_CODE'),
  },
  {
    key: 'applied_at',
    label: t('software.SUBMIT_TIME'),
  },
]);

const childRef = shallowRef<any>(null);
const total = ref(0);
const listData = ref<any>([]);

const initData = (filter?: any) => {
  const _filter = filter || childRef.value?.filterParam || {};
  const param = {
    count_per_page: _filter.pageSize || 10,
    page_num: _filter.currentPage || 1,
    phase: 'imported',
  };
  const obj: any = {};
  if (props.importer === 'mine') {
    obj['importer'] = 'ceshi';
  }
  Object.assign(param, obj);
  querySoftwareList(param).then((res) => {
    const { data } = res;
    const { pkgs = [], total: _total = 0 } = data || {};
    total.value = _total;
    listData.value = pkgs || [];
  });
};
watch(
  () => props.importer,
  () => initData(),
  {
    immediate: true,
  }
);
</script>
<template>
  <div>
    <ProTable
      id="importedList"
      ref="childRef"
      :data="listData"
      :table-config="tableConfig"
      :total="total"
      :is-async="true"
      :height="600"
      @filter="initData"
    ></ProTable>
  </div>
</template>

<style scoped lang="scss"></style>
