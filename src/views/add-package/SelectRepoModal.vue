<script setup lang="ts">
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const submit = () => {
  window.open(import.meta.env.VITE_LOGIN_ORIGIN);
  emit('submit');
  close();
};
</script>
<template>
  <el-dialog
    v-model="modelValue"
    :before-close="close"
    :title="t('software.CONFIRM')"
    width="35%"
    center
    align-center
    :show-close="true"
  >
    <div>{{ t('software.GO_CENTER_TIP', [type]) }}</div>
    <template #footer>
      <div class="textarea-btns">
        <OButton type="primary" size="mini" @click="submit">
          {{ t('software.GO_CENTER') }}
        </OButton>
        <OButton size="mini" @click="close">
          {{ t('software.CANCEL') }}
        </OButton>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss">
.textarea-btns {
  display: flex;
  justify-content: center;
  gap: var(--o-spacing-h5);
}
</style>
