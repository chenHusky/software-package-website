<script lang="ts" setup>
import { computed, onMounted, ref, toRefs } from 'vue';
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
    key: 'source_code',
    label: t('源码地址'),
  },
  {
    key: 'reason',
    label: t('目的'),
  },
  {
    key: 'sig',
    label: 'SIG',
  },
  {
    key: 'license',
    label: 'License',
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
      <span>正文内容</span>
      <el-popover
        width="200"
        :show-arrow="true"
        placement="top"
        trigger="click"
        content="总共需要2个人同意才能审批通过，当前还需1人同意。"
        propper-style="{font-size: 12px}"
      >
        <template #reference>
          <div class="person">
            <span style="margin-right: 8px">审批人</span>
            <ProfilePhoto name="我"></ProfilePhoto>
            <ProfilePhoto name="我"></ProfilePhoto>
          </div>
        </template>
      </el-popover>
    </h3>
    <div class="content">
      <template v-for="item in contentData" :key="item.key">
        <div class="label">{{ item.label }}:</div>
        <div>{{ getContentValue(item.key) }}</div>
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
  grid-template-columns: max-content 1fr max-content 1fr max-content 1fr;
  gap: var(--o-spacing-h5);
  .label {
    text-align: right;
  }
}
</style>
