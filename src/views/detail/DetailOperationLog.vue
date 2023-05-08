<script lang="ts" setup>
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const { t } = useI18n();

const keyToI18n: any = {
  approve: 'software.OPERATION_LOG_APPROVE',
  reject: 'software.OPERATION_LOG_REJECT',
  abandon: 'software.OPERATION_LOG_ABANDON',
  modify: 'software.OPERATION_LOG_MODIFY',
  restart: 'software.OPERATION_LOG_RESTART_CI',
};
</script>
<template>
  <div class="content">
    <h4>{{ t('software.OPERATION_LOG') }}</h4>
    <el-scrollbar max-height="128px">
      <p v-for="item in data" :key="item.time" class="log">
        <span class="time">{{ item.time }}</span>
        <span>{{ t(keyToI18n[item.action], [item.user]) }}</span>
      </p>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.content {
  margin: var(--o-spacing-h5);
  padding: var(--o-spacing-h5);
  border: 1px solid var(--o-color-black);
  width: 80%;
  h4 {
    margin-bottom: var(--o-spacing-h5);
  }
  .log {
    line-height: var(--o-line-height-h5);
    .time {
      margin-right: 48px;
    }
  }
}
</style>
