<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import IconTips from '~icons/app/icon-tips.svg';
import IconDownload from '~icons/app/icon-download.svg';
import { useI18n } from 'vue-i18n';
import HtmlTag from '@/shared/html-tag';
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
    key: 'upstream',
    label: t('software.UPSTREAM_URL'),
    bold: true,
  },
  {
    key: 'spec',
    label: t('software.SOURCE_CODE'),
    download: true,
  },
  {
    key: 'srpm',
    label: t('software.SOURCE_CODE_LICENSE'),
    download: true,
  },
  {
    key: 'sig',
    label: 'SIG',
  },
  {
    key: 'repo_link',
    label: t('software.REPO_LINK'),
    bold: true,
  },
  {
    key: 'committers',
    label: 'Committers',
  },
]);

const getContentValue = (key: string) => {
  if (data.value) {
    if (key === 'committers') {
      let str = '';
      if (data.value?.committers?.length) {
        str = data.value?.committers?.join(',');
      }
      return str;
    }
    return data.value[key] || '';
  }
  return '';
};
</script>
<template>
  <div>
    <div class="content">
      <template v-for="item in contentData" :key="item.key">
        <div class="label">{{ item.label }}:</div>
        <el-scrollbar :max-height="110">
          <a
            v-if="item.bold"
            rel="noopener"
            target="_blank"
            class="value blod"
            :href="getContentValue(item.key)"
          >
            {{ getContentValue(item.key) }}
          </a>
          <div v-else-if="item.download" class="download-item">
            <span>{{ data[item.key]?.src }}</span>
            <span v-if="data[item.key]?.download_addr"></span>
            <el-tooltip v-else placement="top" effect="light">
              <template #content>
                <div style="font-size: 14px">
                  {{ t('software.DOWNLOAD_TIP') }}
                </div>
              </template>
              <OIcon style="font-size: 18px; cursor: pointer">
                <IconTips></IconTips>
              </OIcon>
            </el-tooltip>

            <HtmlTag
              :tag="data[item.key]?.download_addr ? 'a' : 'p'"
              rel="noopener"
              target="_blank"
              :href="data[item.key]?.download_addr"
              download
              class="download-btn"
            >
              <span class="download-label">{{ data[item.key]?.name }}</span>
              <OIcon style="font-size: 24px">
                <IconDownload></IconDownload>
              </OIcon>
            </HtmlTag>
          </div>
          <div v-else class="value">
            {{ getContentValue(item.key) }}
          </div>
        </el-scrollbar>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  .download-item {
    display: grid;
    grid-template-columns: auto 20px 300px;
    align-items: center;
    column-gap: 8px;
    .download-btn {
      display: flex;
      align-items: center;
      column-gap: 8px;
      width: max-content;
    }
  }
}
</style>
