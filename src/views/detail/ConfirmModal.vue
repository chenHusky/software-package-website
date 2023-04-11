<script setup lang="ts">
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'submit']);

const close = () => {
  emit('update:modelValue', false);
};

const submit = () => {
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
    align-center
    :show-close="true"
  >
    <div>{{ t('software.CONFIRM_TIP') }}</div>
    <div class="textarea-btns">
      <OButton type="primary" size="small" @click="submit">
        {{ t('software.CONFIRM') }}
      </OButton>
      <OButton @click="close">
        {{ t('software.CANCEL') }}
      </OButton>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.textarea-btns {
  display: flex;
  justify-content: center;
  gap: var(--o-spacing-h5);
  padding-top: var(--o-spacing-h5);
}
</style>
