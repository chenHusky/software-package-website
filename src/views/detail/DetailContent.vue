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
    label: t('software.NAME'),
  },
  {
    key: 'desc',
    label: t('software.DESC'),
  },
  {
    key: 'reason',
    label: t('software.REASON'),
  },
  {
    key: 'source_code',
    label: t('software.SOURCE_CODE'),
  },
  {
    key: 'license',
    label: t('software.SOURCE_CODE_LICENSE'),
  },
  {
    key: 'sig',
    label: 'SIG',
  },
  {
    key: 'platform',
    label: t('software.PLATFORM'),
  },
  {
    key: 'repo_link',
    label: t('software.REPO_LINK'),
    hidden: data.value.phase !== 'imported',
    bold: true,
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
      <span>{{ t('software.APPLY_INFO') }}</span>
      <el-popover
        width="200"
        :show-arrow="true"
        placement="top"
        trigger="click"
        :disabled="data?.rejected_by?.length || data?.approved_by?.length !== 1"
        :content="t('software.APPROVE_APPLY_INFO')"
        propper-style="{font-size: 12px}"
      >
        <template #reference>
          <div v-if="data?.rejected_by?.length" class="person">
            <span style="margin-right: 8px">{{ t('software.REJECT') }}:</span>
            <ProfilePhoto
              v-for="item in data?.rejected_by"
              :key="item"
              :name="item"
            ></ProfilePhoto>
          </div>
          <div v-else-if="data?.approved_by?.length" class="person">
            <span style="margin-right: 8px">{{ t('software.APPROVE') }}:</span>
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
        <template v-if="!item.hidden">
          <div class="label">{{ item.label }}:</div>
          <el-scrollbar :max-height="110">
            <div class="value" :class="item.bold ? 'blod' : ''">
              {{ getContentValue(item.key) }}
            </div>
          </el-scrollbar>
        </template>
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
  .blod {
    font-weight: bold;
  }
}
</style>
