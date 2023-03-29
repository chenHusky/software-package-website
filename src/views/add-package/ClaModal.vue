<script setup lang="ts">
import { useLangStore } from '@/stores';
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const lang = computed(() => {
  return useLangStore().lang;
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const { modelValue } = toRefs(props);

const jumpToHome = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  router.push(`/${language}/package`);
};
const refresh = () => {
  window.location.reload();
};
</script>
<template>
  <el-dialog
    v-model="modelValue"
    :draggable="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="450px"
    align-center
    :title="t('software.SIGN_CLA')"
    center
  >
    <div style="word-break: break-word">
      {{ t('software.SIGN_CLA_TIPS1') }}
      <a
        href="https://clasign.osinfra.cn/sign/Z2l0ZWUlMkZvcGVuZXVsZXI="
        target="_blank"
        rel="noopener"
      >
        {{ t('software.SIGN_CLA_TIPS2') }}
      </a>
    </div>
    <template #footer>
      <div class="cla-footer">
        <OButton size="small" @click="jumpToHome">
          {{ t('software.TO_HOME') }}
        </OButton>
        <OButton size="small" type="primary" @click="refresh">
          {{ t('software.SIGN_CLA_TOO') }}
        </OButton>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cla-footer {
  display: flex;
  justify-content: center;
  column-gap: var(--o-gap-4);
}
</style>
