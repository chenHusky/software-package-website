<script setup lang="ts">
import { LICENSE_LIST } from '@/shared/license';
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'select']);

const close = () => {
  emit('update:modelValue', false);
  search.value = '';
};

const getValue = (val: string) => {
  emit('select', val);
};
const searchData = computed(() =>
  LICENSE_LIST.filter((item) => {
    return item.toLocaleLowerCase().includes(search.value.toLocaleLowerCase());
  })
);
LICENSE_LIST;
const search = ref('');
</script>
<template>
  <el-dialog
    v-model="modelValue"
    :before-close="close"
    :title="t('software.SELECT_LICENSE')"
    width="35%"
    :show-close="true"
  >
    <div>
      <div class="search-input">
        <el-input v-model="search" placeholder="Filter..."></el-input>
      </div>

      <el-scrollbar :max-height="250">
        <div v-for="item in searchData" :key="item" class="selct-item">
          <a @click="getValue(item)">{{ item }}</a>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.search-input {
  padding-left: var(--o-gap-3);
  padding-right: var(--o-gap-3);
  padding-bottom: var(--o-gap-3);
}
.selct-item {
  padding-left: var(--o-gap-6);
  padding-top: var(--o-gap-3);
  padding-bottom: var(--o-gap-3);
  border-top: 1px solid var(--o-color-division1);
  border-bottom: 1px solid var(--o-color-division1);
  a {
    color: var(--o-color-text1);
    &:hover {
      color: var(--o-color-primary1);
    }
  }
}
</style>
