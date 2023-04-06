<script lang="ts" setup>
import { querySoftwareList } from '@/api/api-package';
import { ProTableColConfig } from '@/shared/@types/protable.interface';
import { useStoreData } from '@/shared/login';
import { useLangStore } from '@/stores';
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const props = defineProps({
  importer: {
    type: String,
    default: 'all',
  },
});

const { t } = useI18n();
const { guardAuthClient } = useStoreData();
const router = useRouter();
const lang = computed(() => {
  return useLangStore().lang;
});

const tableConfig = ref<ProTableColConfig[]>([
  {
    key: 'pkg_name',
    label: t('software.NAME'),
    type: 'link',
    click: (data: any) => {
      const language = lang.value === 'zh' ? 'zh' : 'en';
      router.push(`/${language}/package-detail/${data.id}`);
    },
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
    key: 'repo_link',
    label: t('software.REPO_LINK'),
    type: 'link',
    click: (data: any) => {
      const opener = window.open(data.repo_link, '_black') as Window;
      opener.opener = null;
    },
  },
  {
    key: 'applied_at',
    label: t('software.SUBMIT_TIME'),
  },
]);

const childRef = shallowRef<any>(null);
const total = ref(0);
const listData = ref<any>([]);
const searchName = ref('');

const initData = (filter?: any) => {
  const _filter = filter || childRef.value?.filterParam || {};
  const param = {
    count_per_page: _filter.pageSize || 10,
    page_num: _filter.currentPage || 1,
    phase: 'imported',
  };
  const obj: any = {};
  if (searchName.value) {
    obj['pkg_name'] = searchName.value;
  }
  if (props.importer === 'mine') {
    obj['importer'] = guardAuthClient.value.username;
  }
  const { filters = [] } = _filter;
  if (filters?.length) {
    filters.forEach((item: any) => {
      obj[item.key] = item.searchValue || item.selectValue;
    });
  }
  Object.assign(param, obj);
  querySoftwareList(param)
    .then((res) => {
      const { data } = res;
      const { pkgs = [], total: _total = 0 } = data || {};
      total.value = _total;
      listData.value = pkgs || [];
    })
    .catch(() => {
      total.value = 0;
      listData.value = [];
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
    <OSearch
      v-model="searchName"
      :placeholder="t('software.ENTER_NAME')"
      class="name-search"
      @change="initData()"
    ></OSearch>
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

<style scoped lang="scss">
.name-search {
  width: 300px;
  margin-bottom: 12px;
  :deep(.el-input__wrapper) {
    border-radius: 18px;
  }
}
</style>
