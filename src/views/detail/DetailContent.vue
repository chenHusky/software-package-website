<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { data } = toRefs(props);
const { t } = useI18n();
const contentData = computed(() => [
  {
    key: 'pkg_name',
    label: t('名称'),
  },
  {
    key: 'desc',
    label: t('描述'),
  },
  {
    key: 'reason',
    label: t('目的'),
  },
  {
    key: 'source_code',
    label: t('源码地址'),
  },
  {
    key: 'license',
    label: 'License',
  },
  {
    key: 'sig',
    label: 'SIG',
  },
  {
    key: 'platform',
    label: t('平台'),
  },
]);

const getPlatformLabel = (key: string) => {
  const typesList: any = {
    gitee: 'Gitee',
    github: 'Github',
  };
  return typesList[key] || '';
};
const getContentValue = (key: string) => {
  if (data.value?.application) {
    if (key === 'platform') {
      return getPlatformLabel(data.value?.application[key]);
    }
    return data.value?.application[key] || '';
  }
  return '';
};
</script>
<template>
  <div>
    <h3 class="title">
      <span>申请信息</span>
      <el-popover
        width="200"
        :show-arrow="true"
        placement="top"
        trigger="click"
        content="总共需要2个人同意才能审批通过，当前还需1人同意。"
        propper-style="{font-size: 12px}"
      >
        <template #reference>
          <div v-if="data?.rejected_by?.length" class="person">
            <span style="margin-right: 8px">不同意:</span>
            <ProfilePhoto
              v-for="item in data?.rejected_by"
              :key="item"
              :name="item"
            ></ProfilePhoto>
          </div>
          <div v-else-if="data?.approved_by?.length" class="person">
            <span style="margin-right: 8px">同意:</span>
            <ProfilePhoto
              v-for="item in data?.approved_by"
              :key="item"
              :name="item"
            ></ProfilePhoto>
          </div>
        </template>
      </el-popover>
    </h3>
    <div class="content">
      <template v-for="item in contentData" :key="item.key">
        <div class="label">{{ item.label }}:</div>
        <el-scrollbar :max-height="110">
          <div class="value">{{ getContentValue(item.key) }}</div>
        </el-scrollbar>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-top: var(--o-spacing-h5);
  margin-bottom: var(--o-spacing-h5);
  font-size: var(--o-font-size-h6);
  display: flex;
  justify-content: space-between;
  .person {
    font-size: var(--o-font-size-tip);
    line-height: var(--o-line-height-tip);
    color: var(--o-color-neutral5);
    display: flex;
    align-items: center;
    background-color: var(--o-color-bg1);
  }
}
.content {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--o-spacing-h5);
  .label {
    text-align: right;
  }
  .value {
    white-space: pre-wrap;
  }
}
</style>
