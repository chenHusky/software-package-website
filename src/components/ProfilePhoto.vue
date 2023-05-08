<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  sig: {
    type: String,
    default: '',
  },
  isTC: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();

const char = computed(() => props.name.slice(0, 1));
const content = computed(() => {
  if (!props.sig) {
    return props.name;
  }
  return props.isTC
    ? `${props.name} / ${t('software.TC_MEMBER')}`
    : `${props.name} / SIG:${props.sig}`;
});
</script>
<template>
  <el-tooltip :content="content" placement="top" effect="light">
    <div class="char">
      <span>
        {{ char }}
      </span>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
.char {
  background-color: var(--o-color-brand1);
  width: 2em;
  height: 2em;
  border-radius: 50%;
  text-align: center;
  line-height: 2em;
  color: var(--o-color-white);
}
</style>
