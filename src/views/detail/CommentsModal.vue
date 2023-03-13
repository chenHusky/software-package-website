<script setup lang="ts">
import { ref, toRefs } from 'vue';
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
  textarea.value = '';
};

const getValue = () => {
  if (textarea.value) {
    emit('submit', textarea.value);
  }
  close();
};
const textarea = ref('');
</script>
<template>
  <el-dialog
    v-model="modelValue"
    :before-close="close"
    :title="t('回复')"
    width="35%"
    :show-close="true"
  >
    <el-input v-model="textarea" :rows="4" type="textarea" />
    <div class="textarea-btns">
      <OButton type="primary" size="small" @click="getValue">
        {{ t('确认') }}
      </OButton>
      <OButton @click="close">
        {{ t('取消') }}
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
